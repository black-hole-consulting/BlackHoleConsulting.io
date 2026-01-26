# Input Variables

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Project name prefix for resource naming"
  type        = string
  default     = "bhc"
}

variable "domain_name" {
  description = "Primary domain name for the website"
  type        = string
  default     = "blackholeconsulting.io"
}

# Existing resources to import
variable "s3_bucket_name" {
  description = "Name of existing S3 bucket to import"
  type        = string
  sensitive   = true
}

variable "cloudfront_distribution_id" {
  description = "ID of existing CloudFront distribution to import"
  type        = string
  sensitive   = true
}

# Lambda configuration
variable "brevo_api_key" {
  description = "Brevo API key for email sending"
  type        = string
  sensitive   = true
}

variable "recaptcha_secret_key" {
  description = "reCAPTCHA v3 secret key for server-side verification"
  type        = string
  sensitive   = true
  default     = ""
}

# CORS origins for API Gateway
variable "cors_allowed_origins" {
  description = "List of allowed CORS origins for the contact API"
  type        = list(string)
  default = [
    "https://blackholeconsulting.io",
    "http://localhost:4321"
  ]
}

# Lambda settings
variable "lambda_memory_size" {
  description = "Memory size for Lambda function in MB"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "Timeout for Lambda function in seconds"
  type        = number
  default     = 10
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 14
}
