variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "development"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "tuitui"
}

variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "provided.al2023"
}

variable "lambda_memory_size" {
  description = "Lambda memory size in MB"
  type        = number
  default     = 128
}

variable "lambda_timeout" {
  description = "Lambda timeout in seconds"
  type        = number
  default     = 30
}

variable "amazon_ai_api_key" {
  description = "Amazon AI API key for AmazonQ"
  type        = string
  default     = ""
  sensitive   = true
}

variable "ai_model_name" {
  description = "AI model name (e.g., claude-3-haiku-20240307 or Amazon Q model)"
  type        = string
  default     = "claude-3-haiku-20240307"
}

variable "ai_api_endpoint" {
  description = "AI API endpoint URL"
  type        = string
  default     = "https://api.anthropic.com/v1/messages"
}
