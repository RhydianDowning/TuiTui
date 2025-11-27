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

// VerifyRequest represents the request body for email verification
type VerifyRequest struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

// VerifyResponse represents the response for successful verification
type VerifyResponse struct {
	Message string `json:"message"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler for email verification
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
	var verifyReq VerifyRequest
	if err := json.Unmarshal([]byte(request.Body), &verifyReq); err != nil {
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
	if verifyReq.Email == "" || verifyReq.Code == "" {
		errorResponse := ErrorResponse{
			Error: "Email and verification code are required",
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

	// Confirm sign up
	confirmInput := &cognitoidentityprovider.ConfirmSignUpInput{
		ClientId:         aws.String(cfg.CognitoUserPoolClientID),
		Username:         aws.String(verifyReq.Email),
		ConfirmationCode: aws.String(verifyReq.Code),
	}

	_, err = cognitoClient.ConfirmSignUp(confirmInput)
	if err != nil {
		// Extract more user-friendly error messages from Cognito errors
		errorMsg := err.Error()

		if strings.Contains(errorMsg, "CodeMismatchException") {
			errorMsg = "Invalid verification code. Please check and try again."
		} else if strings.Contains(errorMsg, "ExpiredCodeException") {
			errorMsg = "Verification code has expired. Please request a new code."
		} else if strings.Contains(errorMsg, "NotAuthorizedException") {
			errorMsg = "User is already verified or the code is invalid."
		} else {
			errorMsg = fmt.Sprintf("Verification failed: %v", err)
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
	response := VerifyResponse{
		Message: "Email verified successfully. You can now sign in.",
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
