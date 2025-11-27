# TuiTui Infrastructure

This directory contains Terraform configuration for deploying the TuiTui backend to AWS.

## Prerequisites

1. **Install Terraform**: Download from [terraform.io](https://www.terraform.io/downloads)
2. **AWS CLI configured**: Run `aws configure` with your credentials
3. **Build Lambda binary**: Run `cd ../backend && make build`

## Quick Start

### 1. Initialize Terraform
```bash
cd infrastructure
terraform init
```

### 2. Review the deployment plan
```bash
terraform plan
```

### 3. Deploy to AWS
```bash
terraform apply
```

### 4. Test the Lambda function
```bash
aws lambda invoke --function-name tuitui-development-health response.json
cat response.json
```

### 5. View logs
```bash
aws logs tail /aws/lambda/tuitui-development-health --follow
```

## Configuration

You can customize the deployment by creating a `terraform.tfvars` file:

```hcl
aws_region    = "us-east-1"
environment   = "development"
project_name  = "tuitui"
```

## Resources Created

- **Lambda Function**: The health check Lambda function
- **IAM Role**: Execution role for Lambda with CloudWatch Logs permissions
- **CloudWatch Log Group**: For Lambda execution logs (7-day retention)

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

## File Structure

- `main.tf` - Provider and Terraform configuration
- `variables.tf` - Input variables
- `iam.tf` - IAM roles and policies
- `lambda.tf` - Lambda function definition
- `cloudwatch.tf` - CloudWatch log groups
- `outputs.tf` - Output values after deployment
