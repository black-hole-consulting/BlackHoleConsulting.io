# Lambda Function for Contact Form

# IAM role for Lambda execution
resource "aws_iam_role" "contact_form" {
  name = "${var.project_name}-contact-form-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-contact-form-role"
  }
}

# Attach basic Lambda execution policy (CloudWatch Logs)
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.contact_form.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# CloudWatch Log Group with retention
resource "aws_cloudwatch_log_group" "contact_form" {
  name              = "/aws/lambda/${var.project_name}-contact-form"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-contact-form-logs"
  }
}

# Package Lambda code as ZIP
data "archive_file" "contact_form" {
  type        = "zip"
  source_file = "${path.module}/../lambda/contact-form/index.mjs"
  output_path = "${path.module}/.terraform/tmp/contact-form.zip"
}

# Lambda function
resource "aws_lambda_function" "contact_form" {
  function_name = "${var.project_name}-contact-form"
  description   = "Contact form handler - sends emails via Brevo API"

  filename         = data.archive_file.contact_form.output_path
  source_code_hash = data.archive_file.contact_form.output_base64sha256

  runtime       = "nodejs20.x"
  handler       = "index.handler"
  architectures = ["arm64"]
  memory_size   = var.lambda_memory_size
  timeout       = var.lambda_timeout

  role = aws_iam_role.contact_form.arn

  environment {
    variables = {
      BREVO_API_KEY        = var.brevo_api_key
      RECAPTCHA_SECRET_KEY = var.recaptcha_secret_key
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.contact_form,
    aws_iam_role_policy_attachment.lambda_basic
  ]

  tags = {
    Name = "${var.project_name}-contact-form"
  }
}

# Lambda permission for API Gateway invocation
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact_form.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.contact.execution_arn}/*/*"
}
