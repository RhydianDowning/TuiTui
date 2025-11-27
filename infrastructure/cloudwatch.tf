# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda_health" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-health"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-health-logs"
  }
}

# CloudWatch Log Group for Auth Register Lambda
resource "aws_cloudwatch_log_group" "lambda_auth_register" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-auth-register"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-auth-register-logs"
  }
}

# CloudWatch Log Group for Auth Login Lambda
resource "aws_cloudwatch_log_group" "lambda_auth_login" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-auth-login"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-auth-login-logs"
  }
}

# CloudWatch Log Group for Chat Lambda
resource "aws_cloudwatch_log_group" "lambda_chat" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-chat"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-chat-logs"
  }
}

resource "aws_cloudwatch_log_group" "lambda_auth_verify" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-auth-verify"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-auth-verify-logs"
  }
}

resource "aws_cloudwatch_log_group" "lambda_auth_resend_code" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}-auth-resend-code"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-${var.environment}-auth-resend-code-logs"
  }
}
