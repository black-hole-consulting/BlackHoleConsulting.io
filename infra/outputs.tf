# Output Values

# S3
output "website_bucket_name" {
  description = "S3 bucket name for website hosting"
  value       = aws_s3_bucket.website.id
}

output "website_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.website.arn
}

# CloudFront
output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.website.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

# API Gateway
output "api_endpoint" {
  description = "API Gateway endpoint URL for contact form"
  value       = "${aws_apigatewayv2_api.contact.api_endpoint}/contact"
}

output "api_id" {
  description = "API Gateway ID"
  value       = aws_apigatewayv2_api.contact.id
}

# Lambda
output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.contact_form.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.contact_form.arn
}

# Useful for debugging
output "aws_account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}

output "aws_region" {
  description = "AWS Region"
  value       = data.aws_region.current.name
}
