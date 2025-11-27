package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"tuitui-backend/internal/config"
)

// ResendCodeRequest represents the request body for resending verification code
type ResendCodeRequest struct {
	Email string `json:"email"`
}

// ResendCodeResponse represents the response for successful resend
type ResendCodeResponse struct {
	Message string `json:"message"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler for resending verification code
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// CORS headers for all responses
	corsHeaders := map[string]string{
		"Content-Type":                 "application/json",
		"Access-Control-Allow-Origin":  "*",
		"Access-Control-Allow-Headers": "Content-Type,Authorization",
		"Access-Control-Allow-Methods": "POST,OPTIONS",
	}

	// Handle OPTIONS preflight request
	if request.HTTPMethod == "OPTIONS" {
		return events.APIGatewayProxyResponse{
			StatusCode: 200,
			Headers:    corsHeaders,
		}, nil
	}

	// Load configuration from environment variables
	cfg, err := config.Load()
	if err != nil {
		errorResponse := ErrorResponse{
			Error: fmt.Sprintf("Failed to load configuration: %v", err),
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Parse request body
	var resendReq ResendCodeRequest
	if err := json.Unmarshal([]byte(request.Body), &resendReq); err != nil {
		errorResponse := ErrorResponse{
			Error: "Invalid request body",
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Validate required fields
	if resendReq.Email == "" {
		errorResponse := ErrorResponse{
			Error: "Email is required",
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Create AWS session
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(cfg.AWSRegion),
	})
	if err != nil {
		errorResponse := ErrorResponse{
			Error: fmt.Sprintf("Failed to create AWS session: %v", err),
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Create Cognito client
	cognitoClient := cognitoidentityprovider.New(sess)

	// Resend confirmation code
	resendInput := &cognitoidentityprovider.ResendConfirmationCodeInput{
		ClientId: aws.String(cfg.CognitoUserPoolClientID),
		Username: aws.String(resendReq.Email),
	}

	_, err = cognitoClient.ResendConfirmationCode(resendInput)
	if err != nil {
		// Extract more user-friendly error messages from Cognito errors
		errorMsg := err.Error()

		if strings.Contains(errorMsg, "UserNotFoundException") {
			errorMsg = "No account found with this email."
		} else if strings.Contains(errorMsg, "InvalidParameterException") {
			errorMsg = "User is already verified."
		} else if strings.Contains(errorMsg, "LimitExceededException") {
			errorMsg = "Too many requests. Please wait a few minutes and try again."
		} else {
			errorMsg = fmt.Sprintf("Failed to resend code: %v", err)
		}

		errorResponse := ErrorResponse{
			Error: errorMsg,
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Create response
	response := ResendCodeResponse{
		Message: "Verification code has been resent to your email.",
	}

	// Marshal response to JSON
	responseBody, err := json.Marshal(response)
	if err != nil {
		errorResponse := ErrorResponse{
			Error: fmt.Sprintf("Failed to marshal response: %v", err),
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Return successful response
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
		Headers:    corsHeaders,
	}, nil
}

func main() {
	// Start Lambda handler
	lambda.Start(Handler)
}
