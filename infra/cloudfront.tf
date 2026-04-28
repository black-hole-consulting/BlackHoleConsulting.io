# CloudFront Distribution
#
# This resource will be IMPORTED from existing infrastructure.
# Run: terraform import aws_cloudfront_distribution.website "DISTRIBUTION_ID"

# CloudFront Function for URL rewriting (add index.html to directory requests)
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${var.project_name}-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite URLs to add index.html for directory requests"
  publish = true

  code = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // If URI ends with '/', append index.html
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      }
      // If URI doesn't have an extension, append /index.html
      else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
  EOF
}

# Origin Access Control for secure S3 access
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "${var.project_name}-website-oac"
  description                       = "OAC for ${var.domain_name} S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Shared security headers (HSTS, CSP, etc.) reused by every response policy.
# Done via a local because aws_cloudfront_response_headers_policy doesn't accept
# a "common" block — we duplicate inline but at least keep the values DRY.
locals {
  csp = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google.com https://www.gstatic.com; font-src 'self'; connect-src 'self' https://*.execute-api.${var.aws_region}.amazonaws.com https://www.google.com https://www.google-analytics.com; frame-src https://www.google.com; base-uri 'self'; form-action 'self'"
}

# HTML / default cache: short cache, must-revalidate.
# Browsers should refetch frequently so a fresh deploy goes live within minutes.
resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name    = "${var.project_name}-security-headers"
  comment = "Security + short-cache headers for HTML responses on ${var.domain_name}"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    content_security_policy {
      content_security_policy = local.csp
      override                = true
    }
  }

  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
    items {
      header   = "Cache-Control"
      value    = "public, max-age=300, must-revalidate"
      override = true
    }
  }
}

# Static assets cache: immutable 1y. Used for fingerprinted /_astro/* assets
# and rarely-changed /images/* and /fonts/*. Names with hash → safe to immutable.
resource "aws_cloudfront_response_headers_policy" "static_assets_headers" {
  name    = "${var.project_name}-static-assets-headers"
  comment = "Security + immutable cache for fingerprinted assets on ${var.domain_name}"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

    content_type_options {
      override = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
  }

  custom_headers_config {
    items {
      header   = "Cache-Control"
      value    = "public, max-age=31536000, immutable"
      override = true
    }
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # Europe + North America
  http_version        = "http2and3"
  comment             = "Black Hole Consulting website"

  aliases = [var.domain_name, "www.${var.domain_name}"]

  # S3 Origin
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-${var.s3_bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  # Default cache behavior — HTML and anything not matched below.
  # Short browser cache so fresh deploys go live quickly.
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.cors_s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # Fingerprinted Astro assets: immutable 1y
  ordered_cache_behavior {
    path_pattern           = "/_astro/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.cors_s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_assets_headers.id
  }

  # Images: long browser cache (immutable filenames in practice)
  ordered_cache_behavior {
    path_pattern           = "/images/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.cors_s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_assets_headers.id
  }

  # Fonts (woff2 etc): immutable
  ordered_cache_behavior {
    path_pattern           = "/fonts/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${var.s3_bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.cors_s3_origin.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.static_assets_headers.id
  }

  # Custom error responses for SPA-like behavior
  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 403
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 10
  }

  # No geo restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL certificate
  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "${var.project_name}-website-distribution"
  }
}
