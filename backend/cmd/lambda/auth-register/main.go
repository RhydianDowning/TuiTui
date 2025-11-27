package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// Handler is the Lambda function handler for user registration
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Simple test response
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "Auth register Lambda is working!",
		Headers: map[string]string{
			"Content-Type": "text/plain",
		},
	}, nil
}

func main() {
	// Start Lambda handler
	lambda.Start(Handler)
}
