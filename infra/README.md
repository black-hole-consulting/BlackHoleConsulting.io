# Infrastructure as Code (Terraform)

This directory contains Terraform configuration for the Black Hole Consulting website infrastructure on AWS.

## Architecture

```
                                    ┌─────────────────┐
                                    │   Route 53      │
                                    │ (DNS - manual)  │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        │
         ┌──────────────────┐    ┌──────────────────┐                │
         │   CloudFront     │    │   API Gateway    │                │
         │   Distribution   │    │   HTTP API       │                │
         │   (CDN + SSL)    │    │   POST /contact  │                │
         └────────┬─────────┘    └────────┬─────────┘                │
                  │                       │                          │
                  ▼                       ▼                          │
         ┌──────────────────┐    ┌──────────────────┐    ┌──────────┴───────┐
         │   S3 Bucket      │    │   Lambda         │    │   ACM Certificate │
         │   (Static Site)  │    │   (Contact Form) │    │   (us-east-1)     │
         └──────────────────┘    └────────┬─────────┘    └──────────────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │   Brevo API      │
                                 │   (Email)        │
                                 └──────────────────┘
```

## Prerequisites

- Terraform >= 1.6.0
- AWS CLI configured with appropriate credentials
- ACM certificate for `blackholeconsulting.io` in `us-east-1`

## Directory Structure

```
infra/
├── bootstrap/          # State backend setup (run first)
│   └── main.tf
├── backend.tf          # S3 backend configuration
├── versions.tf         # Provider version constraints
├── main.tf             # Provider + data sources
├── variables.tf        # Input variables
├── outputs.tf          # Output values
├── s3.tf               # S3 bucket + policies
├── cloudfront.tf       # CloudFront distribution + OAC
├── lambda.tf           # Lambda function + IAM
├── api-gateway.tf      # HTTP API + routes
└── README.md           # This file
```

## Initial Setup

### 1. Bootstrap State Backend

Run this once to create the S3 bucket and DynamoDB table for state management:

```bash
cd infra/bootstrap
terraform init
terraform apply
```

### 2. Import Existing Resources

Set environment variables for sensitive values:

```bash
export TF_VAR_s3_bucket_name="your-bucket-name"
export TF_VAR_cloudfront_distribution_id="EXXXXXXXXXX"
export TF_VAR_brevo_api_key="your-brevo-key"
```

Initialize and import:

```bash
cd infra
terraform init

# Import existing S3 bucket
terraform import aws_s3_bucket.website "$TF_VAR_s3_bucket_name"

# Import existing CloudFront distribution
terraform import aws_cloudfront_distribution.website "$TF_VAR_cloudfront_distribution_id"

# Verify configuration matches existing resources
terraform plan
```

### 3. Apply Configuration

```bash
terraform apply
```

## Daily Usage

### Preview Changes

```bash
cd infra
terraform plan
```

### Apply Changes

```bash
terraform apply
```

### View Current State

```bash
terraform show
```

### View Outputs

```bash
terraform output
terraform output api_endpoint  # Specific output
```

## CI/CD Integration

Infrastructure changes are managed via GitHub Actions:

- **Pull Requests**: `terraform plan` runs automatically, results posted as PR comment
- **Merge to main**: `terraform apply` runs automatically with approval gate

## Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region | `eu-west-3` |
| `project_name` | Resource name prefix | `bhc` |
| `domain_name` | Primary domain | `blackholeconsulting.io` |
| `s3_bucket_name` | S3 bucket name | (required) |
| `cloudfront_distribution_id` | CloudFront ID | (required) |
| `brevo_api_key` | Brevo API key | (required) |
| `cors_allowed_origins` | CORS origins | `[production, localhost]` |
| `lambda_memory_size` | Lambda memory (MB) | `128` |
| `lambda_timeout` | Lambda timeout (s) | `10` |
| `log_retention_days` | Log retention | `14` |

## Sensitive Values

Sensitive variables are passed via environment variables in CI/CD:

```bash
TF_VAR_s3_bucket_name
TF_VAR_cloudfront_distribution_id
TF_VAR_brevo_api_key
```

Never commit sensitive values to the repository.

## State Management

- **State file**: `s3://blackholeconsulting-terraform-state/website/terraform.tfstate`
- **Locking**: DynamoDB table `bhc-terraform-locks`
- **Encryption**: AES-256 server-side encryption

## Security

- S3 bucket has `prevent_destroy = true`
- CloudFront has `prevent_destroy = true`
- State bucket blocks all public access
- State is encrypted at rest
- OAC used for CloudFront-to-S3 access (no public bucket)

## Troubleshooting

### State Lock Issues

If a lock is stuck (e.g., interrupted apply):

```bash
terraform force-unlock LOCK_ID
```

### Import Drift

If imported resources don't match configuration:

```bash
terraform refresh
terraform plan  # Review differences
# Adjust configuration to match, then:
terraform apply
```

### CloudFront 403 Errors

Check S3 bucket policy allows CloudFront OAC:

```bash
terraform state show aws_s3_bucket_policy.website
```
