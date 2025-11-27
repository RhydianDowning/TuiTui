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

// RegisterRequest represents the request body for user registration
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// RegisterResponse represents the response for successful registration
type RegisterResponse struct {
	Message string `json:"message"`
	UserSub string `json:"user_sub"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler for user registration
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
	var registerReq RegisterRequest
	if err := json.Unmarshal([]byte(request.Body), &registerReq); err != nil {
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
	if registerReq.Email == "" || registerReq.Password == "" || registerReq.Name == "" {
		errorResponse := ErrorResponse{
			Error: "Email, password, and name are required",
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

	// Register user
	signUpInput := &cognitoidentityprovider.SignUpInput{
		ClientId: aws.String(cfg.CognitoUserPoolClientID),
		Username: aws.String(registerReq.Email),
		Password: aws.String(registerReq.Password),
		UserAttributes: []*cognitoidentityprovider.AttributeType{
			{
				Name:  aws.String("email"),
				Value: aws.String(registerReq.Email),
			},
			{
				Name:  aws.String("name"),
				Value: aws.String(registerReq.Name),
			},
		},
	}

	signUpResult, err := cognitoClient.SignUp(signUpInput)
	if err != nil {
		// Extract more user-friendly error messages from Cognito errors
		errorMsg := err.Error()

		// Common Cognito error patterns
		if strings.Contains(errorMsg, "InvalidPasswordException") {
			errorMsg = "Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters."
		} else if strings.Contains(errorMsg, "UsernameExistsException") {
			errorMsg = "An account with this email already exists."
		} else if strings.Contains(errorMsg, "InvalidParameterException") {
			errorMsg = "Invalid input. Please check your email and password."
		} else {
			errorMsg = fmt.Sprintf("Registration failed: %v", err)
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
	response := RegisterResponse{
		Message: "Registration successful. Please check your email to confirm your account.",
		UserSub: *signUpResult.UserSub,
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
