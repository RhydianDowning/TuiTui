# Archive the Lambda binaries
data "archive_file" "lambda_health" {
  type        = "zip"
  source_dir  = "../backend/bin/health"
  output_path = "${path.module}/.terraform/lambda_health.zip"
}

data "archive_file" "lambda_auth_register" {
  type        = "zip"
  source_dir  = "../backend/bin/auth-register"
  output_path = "${path.module}/.terraform/lambda_auth_register.zip"
}

data "archive_file" "lambda_auth_login" {
  type        = "zip"
  source_dir  = "../backend/bin/auth-login"
  output_path = "${path.module}/.terraform/lambda_auth_login.zip"
}

data "archive_file" "lambda_chat" {
  type        = "zip"
  source_dir  = "../backend/bin/chat"
  output_path = "${path.module}/.terraform/lambda_chat.zip"
}

data "archive_file" "lambda_auth_verify" {
  type        = "zip"
  source_dir  = "../backend/bin/auth-verify"
  output_path = "${path.module}/.terraform/lambda_auth_verify.zip"
}

data "archive_file" "lambda_auth_resend_code" {
  type        = "zip"
  source_dir  = "../backend/bin/auth-resend-code"
  output_path = "${path.module}/.terraform/lambda_auth_resend_code.zip"
}

# Lambda function
resource "aws_lambda_function" "health" {
  filename         = data.archive_file.lambda_health.output_path
  function_name    = "${var.project_name}-${var.environment}-health"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_health.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT = var.environment
      API_VERSION = "v1"
      LOG_LEVEL   = "info"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_health
  ]
}

# Auth Register Lambda function
resource "aws_lambda_function" "auth_register" {
  filename         = data.archive_file.lambda_auth_register.output_path
  function_name    = "${var.project_name}-${var.environment}-auth-register"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_auth_register.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT                  = var.environment
      API_VERSION                  = "v1"
      LOG_LEVEL                    = "info"
      COGNITO_USER_POOL_ID         = aws_cognito_user_pool.main.id
      COGNITO_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.main.id
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_auth_register
  ]
}

# Auth Login Lambda function
resource "aws_lambda_function" "auth_login" {
  filename         = data.archive_file.lambda_auth_login.output_path
  function_name    = "${var.project_name}-${var.environment}-auth-login"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_auth_login.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT                  = var.environment
      API_VERSION                  = "v1"
      LOG_LEVEL                    = "info"
      COGNITO_USER_POOL_ID         = aws_cognito_user_pool.main.id
      COGNITO_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.main.id
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_auth_login
  ]
}

# Chat Lambda function
resource "aws_lambda_function" "chat" {
  filename         = data.archive_file.lambda_chat.output_path
  function_name    = "${var.project_name}-${var.environment}-chat"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_chat.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT                  = var.environment
      API_VERSION                  = "v1"
      LOG_LEVEL                    = "info"
      COGNITO_USER_POOL_ID         = aws_cognito_user_pool.main.id
      COGNITO_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.main.id
      AMAZON_AI_API_KEY            = var.amazon_ai_api_key
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_chat
  ]
}

# Auth Verify Lambda function
resource "aws_lambda_function" "auth_verify" {
  filename         = data.archive_file.lambda_auth_verify.output_path
  function_name    = "${var.project_name}-${var.environment}-auth-verify"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_auth_verify.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT                  = var.environment
      API_VERSION                  = "v1"
      LOG_LEVEL                    = "info"
      COGNITO_USER_POOL_ID         = aws_cognito_user_pool.main.id
      COGNITO_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.main.id
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_auth_verify
  ]
}

# Auth Resend Code Lambda function
resource "aws_lambda_function" "auth_resend_code" {
  filename         = data.archive_file.lambda_auth_resend_code.output_path
  function_name    = "${var.project_name}-${var.environment}-auth-resend-code"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "bootstrap"
  source_code_hash = data.archive_file.lambda_auth_resend_code.output_base64sha256
  runtime         = var.lambda_runtime
  memory_size     = var.lambda_memory_size
  timeout         = var.lambda_timeout

  environment {
    variables = {
      ENVIRONMENT                  = var.environment
      API_VERSION                  = "v1"
      LOG_LEVEL                    = "info"
      COGNITO_USER_POOL_ID         = aws_cognito_user_pool.main.id
      COGNITO_USER_POOL_CLIENT_ID  = aws_cognito_user_pool_client.main.id
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.lambda_auth_resend_code
  ]
}
