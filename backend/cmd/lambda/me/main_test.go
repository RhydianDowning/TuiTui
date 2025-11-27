package main

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestHandler_NoAuthorizer(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 401 {
		t.Errorf("Expected status 401, got %d", response.StatusCode)
	}

	var errorResp ErrorResponse
	if err := json.Unmarshal([]byte(response.Body), &errorResp); err != nil {
		t.Fatalf("Failed to parse error response: %v", err)
	}

	if errorResp.Error != "No authorization context found" {
		t.Errorf("Expected 'No authorization context found', got '%s'", errorResp.Error)
	}
}

func TestHandler_WithAuthorizer(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"sub":   "user-123",
					"email": "test@example.com",
					"name":  "Test User",
				},
			},
		},
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 200 {
		t.Errorf("Expected status 200, got %d", response.StatusCode)
	}

	if response.Headers["Content-Type"] != "application/json" {
		t.Error("Expected Content-Type header")
	}
}

func TestHandler_ContentType(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.Headers["Content-Type"] != "application/json" {
		t.Error("Expected Content-Type application/json")
	}
}

func TestResponse_Struct(t *testing.T) {
	resp := Response{
		Message: "test",
		User:    map[string]interface{}{"id": "123"},
	}

	if resp.Message != "test" {
		t.Errorf("Expected message 'test', got '%s'", resp.Message)
	}

	if resp.User["id"] != "123" {
		t.Error("Expected user id '123'")
	}
}
