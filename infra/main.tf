# Main Provider Configuration

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "black-hole-consulting"
      ManagedBy   = "terraform"
      Environment = "production"
      Repository  = "black-hole-consulting/website"
    }
  }
}

# Provider for ACM certificates (must be us-east-1 for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "black-hole-consulting"
      ManagedBy   = "terraform"
      Environment = "production"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ACM certificate (must exist in us-east-1 for CloudFront)
data "aws_acm_certificate" "website" {
  provider = aws.us_east_1
  domain   = var.domain_name
  statuses = ["ISSUED"]
}

# Managed CloudFront policies
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "cors_s3_origin" {
  name = "Managed-CORS-S3Origin"
}
