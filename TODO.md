[x] Phase 1: Setup basic backend structure (folders, go.mod, basic configs)

[ ] Phase 2: Create a simple 'Hello World' Lambda function
[ ] Phase 3: Setup basic Terraform for single Lambda deployment
[ ] Phase 4: Add API Gateway integration for Lambda
[ ] Phase 5: Implement AWS Cognito authentication
[ ] Phase 6: Add DynamoDB for data storage
[ ] Phase 7: Integrate Amazon Q for AI processing
[ ] Phase 8: Connect frontend to backend APIs

Phase 1: Setup Basic Backend Structure
Goal: Create the initial folder structure and Go module
What you'll do:
- Create backend/ directory
- Initialize Go module (go.mod)
- Create basic folder structure:
    backend/
  ├── cmd/lambda/health/main.go
  ├── internal/config/
  ├── pkg/api/
  ├── go.mod
  └── Makefile
  - No AWS deployment yet, just local setup
Deliverable: A Go project that compiles locally
---
Phase 2: Create Simple "Hello World" Lambda
Goal: Build your first Lambda function that runs locally
What you'll do:
- Create a simple Lambda handler in cmd/lambda/health/main.go
- Add AWS Lambda Go SDK dependency
- Build the Lambda binary
- Test locally (no AWS yet)
Deliverable: A compiled Lambda binary that responds with "Hello World"
---
Phase 3: Basic Terraform + Deploy First Lambda
Goal: Deploy your first Lambda to AWS
What you'll do:
- Create infrastructure/ folder
- Write minimal Terraform:
  - Lambda function resource
  - IAM role for Lambda execution
  - CloudWatch Logs
- Deploy to AWS
- Test via AWS Console
Deliverable: A working Lambda in AWS that you can invoke manually
---
Phase 4: Add API Gateway
Goal: Make your Lambda accessible via HTTP
What you'll do:
- Add API Gateway to Terraform
- Create a single HTTP endpoint: GET /health
- Link API Gateway to your Lambda
- Test with curl/Postman
Deliverable: A public HTTP endpoint that returns your Lambda response
---
Phase 5: Implement Cognito Authentication
Goal: Add user authentication
What you'll do:
- Create Cognito User Pool via Terraform
- Create auth Lambda functions (register, login)
- Implement JWT token validation
- Add an authenticated endpoint to test
Deliverable: User registration and login working, protected endpoints require tokens
---
Phase 6: Add DynamoDB Storage
Goal: Persist conversation data
What you'll do:
- Create DynamoDB table via Terraform
- Create Lambda for storing/retrieving conversations
- Add API endpoints for CRUD operations
- Test data persistence
Deliverable: Store and retrieve conversation history from DynamoDB
---
Phase 7: Integrate Amazon Q
Goal: Add AI capabilities
What you'll do:
- Add Amazon Q SDK
- Create prompt processing Lambda
- Handle streaming responses (if needed)
- Connect authenticated user to AI service
Deliverable: Send prompts to Amazon Q and receive responses
---
Phase 8: Frontend Integration
Goal: Connect your Next.js app to backend
What you'll do:
- Add API client in frontend
- Implement authentication flow
- Connect chat UI to backend APIs
- Handle real-time updates
Deliverable: Full-stack application working end-to-end
