package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/yourusername/tuitui-backend/internal/config"
)

// LoginRequest represents the request body for user login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the response for successful login
type LoginResponse struct {
	Message      string `json:"message"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	IDToken      string `json:"id_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler for user login
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
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
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Parse request body
	var loginReq LoginRequest
	if err := json.Unmarshal([]byte(request.Body), &loginReq); err != nil {
		errorResponse := ErrorResponse{
			Error: "Invalid request body",
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Validate required fields
	if loginReq.Email == "" || loginReq.Password == "" {
		errorResponse := ErrorResponse{
			Error: "Email and password are required",
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
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
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Create Cognito client
	cognitoClient := cognitoidentityprovider.New(sess)

	// Authenticate user
	authInput := &cognitoidentityprovider.InitiateAuthInput{
		ClientId: aws.String(cfg.CognitoUserPoolClientID),
		AuthFlow: aws.String("USER_PASSWORD_AUTH"),
		AuthParameters: map[string]*string{
			"USERNAME": aws.String(loginReq.Email),
			"PASSWORD": aws.String(loginReq.Password),
		},
	}

	authResult, err := cognitoClient.InitiateAuth(authInput)
	if err != nil {
		errorResponse := ErrorResponse{
			Error: fmt.Sprintf("Authentication failed: %v", err),
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       string(errorBody),
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Create response
	response := LoginResponse{
		Message:      "Login successful",
		AccessToken:  *authResult.AuthenticationResult.AccessToken,
		RefreshToken: *authResult.AuthenticationResult.RefreshToken,
		IDToken:      *authResult.AuthenticationResult.IdToken,
		TokenType:    *authResult.AuthenticationResult.TokenType,
		ExpiresIn:    int(*authResult.AuthenticationResult.ExpiresIn),
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
			Headers: map[string]string{
				"Content-Type": "application/json",
			},
		}, nil
	}

	// Return successful response
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}, nil
}

func main() {
	// Start Lambda handler
	lambda.Start(Handler)
}
