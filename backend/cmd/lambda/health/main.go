package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"tuitui-backend/internal/config"
)

// Response represents the Lambda response structure
type Response struct {
	Message     string `json:"message"`
	Environment string `json:"environment"`
	AWSRegion   string `json:"aws_region"`
	APIVersion  string `json:"api_version"`
	Status      string `json:"status"`
}

// ErrorResponse represents an error response structure
type ErrorResponse struct {
	Error string `json:"error"`
}

// Handler is the Lambda function handler
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

	// Create response
	response := Response{
		Message:     "Hello World from TuiTui Lambda!",
		Environment: cfg.Environment,
		AWSRegion:   cfg.AWSRegion,
		APIVersion:  cfg.APIVersion,
		Status:      "OK",
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
