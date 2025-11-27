output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.health.function_name
}

output "lambda_function_arn" {
  description = "ARN of the Lambda function"
  value       = aws_lambda_function.health.arn
}

output "lambda_function_invoke_arn" {
  description = "Invoke ARN of the Lambda function"
  value       = aws_lambda_function.health.invoke_arn
}

output "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_execution.arn
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group name"
  value       = aws_cloudwatch_log_group.lambda_health.name
}

output "api_gateway_url" {
  description = "Base URL for API Gateway stage"
  value       = aws_api_gateway_stage.main.invoke_url
}

output "health_endpoint_url" {
  description = "Full URL for the health endpoint"
  value       = "${aws_api_gateway_stage.main.invoke_url}/health"
}

output "auth_register_endpoint_url" {
  description = "Full URL for the auth register endpoint"
  value       = "${aws_api_gateway_stage.main.invoke_url}/auth/register"
}

output "auth_login_endpoint_url" {
  description = "Full URL for the auth login endpoint"
  value       = "${aws_api_gateway_stage.main.invoke_url}/auth/login"
}

output "chat_endpoint_url" {
  description = "Full URL for the chat endpoint"
  value       = "${aws_api_gateway_stage.main.invoke_url}/chat"
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.main.id
}
