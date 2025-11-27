package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Response represents the /me endpoint response
type Response struct {
	Message string                 `json:"message"`
	User    map[string]interface{} `json:"user"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler for /me endpoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Extract user information from Cognito authorizer claims
	claims := request.RequestContext.Authorizer

	if claims == nil {
		errorResponse := ErrorResponse{
			Error: "No authorization context found",
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

	// Extract user details from claims
	userInfo := make(map[string]interface{})

	// Cognito provides claims in the authorizer context
	if claimsMap, ok := claims["claims"].(map[string]interface{}); ok {
		// Extract common Cognito claims
		if sub, ok := claimsMap["sub"].(string); ok {
			userInfo["user_id"] = sub
		}
		if email, ok := claimsMap["email"].(string); ok {
			userInfo["email"] = email
		}
		if name, ok := claimsMap["name"].(string); ok {
			userInfo["name"] = name
		}
		if emailVerified, ok := claimsMap["email_verified"].(string); ok {
			userInfo["email_verified"] = emailVerified
		}

		// Add all claims for debugging
		userInfo["all_claims"] = claimsMap
	}

	// Create response
	response := Response{
		Message: "Authenticated user information",
		User:    userInfo,
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
