# Terraform State Backend Configuration
# State is stored in S3 with DynamoDB locking
#
# Prerequisites:
#   Run bootstrap/main.tf first to create the state bucket and lock table

terraform {
  backend "s3" {
    bucket       = "blackholeconsulting-terraform-state"
    key          = "website/terraform.tfstate"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}
