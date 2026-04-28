# API Gateway HTTP API for Contact Form

# HTTP API
resource "aws_apigatewayv2_api" "contact" {
  name          = "${var.project_name}-contact-api"
  protocol_type = "HTTP"
  description   = "Contact form API for ${var.domain_name}"

  cors_configuration {
    allow_origins = var.cors_allowed_origins
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["Content-Type"]
    max_age       = 300
  }

  tags = {
    Name = "${var.project_name}-contact-api"
  }
}

# Lambda integration
resource "aws_apigatewayv2_integration" "contact" {
  api_id             = aws_apigatewayv2_api.contact.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.contact_form.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}

# POST /contact route
resource "aws_apigatewayv2_route" "contact_post" {
  api_id    = aws_apigatewayv2_api.contact.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.contact.id}"
}

# Default stage with auto-deploy
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.contact.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      requestTime    = "$context.requestTime"
      httpMethod     = "$context.httpMethod"
      routeKey       = "$context.routeKey"
      status         = "$context.status"
      responseLength = "$context.responseLength"
      errorMessage   = "$context.error.message"
    })
  }

  tags = {
    Name = "${var.project_name}-contact-api-default-stage"
  }
}

# CloudWatch Log Group for API Gateway access logs
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-contact-api"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-contact-api-logs"
  }
}
