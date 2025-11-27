package main

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestHandler(t *testing.T) {
	// Create a test request
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
		Path:       "/health",
	}

	// Set up environment variables for testing
	t.Setenv("ENVIRONMENT", "development")
	t.Setenv("AWS_REGION", "us-east-1")
	t.Setenv("API_VERSION", "v1")

	// Call the handler
	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	// Check status code
	if response.StatusCode != 200 {
		t.Errorf("Expected status code 200, got %d", response.StatusCode)
	}

	// Check content type
	contentType := response.Headers["Content-Type"]
	if contentType != "application/json" {
		t.Errorf("Expected Content-Type application/json, got %s", contentType)
	}

	// Parse response body
	var result Response
	if err := json.Unmarshal([]byte(response.Body), &result); err != nil {
		t.Fatalf("Failed to parse response body: %v", err)
	}

	// Check response fields
	if result.Status != "OK" {
		t.Errorf("Expected status OK, got %s", result.Status)
	}

	if result.Message == "" {
		t.Error("Expected non-empty message")
	}

	if result.Environment != "development" {
		t.Errorf("Expected environment development, got %s", result.Environment)
	}

	// Print the response for visual inspection
	t.Logf("Response: %s", response.Body)
}
