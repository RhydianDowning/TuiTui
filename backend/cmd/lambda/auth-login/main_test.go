package main

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestHandler_OptionsRequest(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "OPTIONS",
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 200 {
		t.Errorf("Expected status 200, got %d", response.StatusCode)
	}
}

func TestHandler_InvalidJSON(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       `{invalid json}`,
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 400 {
		t.Errorf("Expected status 400, got %d", response.StatusCode)
	}

	var errorResp ErrorResponse
	if err := json.Unmarshal([]byte(response.Body), &errorResp); err != nil {
		t.Fatalf("Failed to parse error response: %v", err)
	}

	if errorResp.Error != "Invalid request body" {
		t.Errorf("Expected 'Invalid request body', got '%s'", errorResp.Error)
	}
}

func TestHandler_MissingEmail(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       `{"email": "", "password": "test123"}`,
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 400 {
		t.Errorf("Expected status 400, got %d", response.StatusCode)
	}

	var errorResp ErrorResponse
	if err := json.Unmarshal([]byte(response.Body), &errorResp); err != nil {
		t.Fatalf("Failed to parse error response: %v", err)
	}

	if errorResp.Error != "Email and password are required" {
		t.Errorf("Expected 'Email and password are required', got '%s'", errorResp.Error)
	}
}

func TestHandler_MissingPassword(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       `{"email": "test@example.com", "password": ""}`,
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 400 {
		t.Errorf("Expected status 400, got %d", response.StatusCode)
	}
}

func TestHandler_CORSHeaders(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "OPTIONS",
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.Headers["Access-Control-Allow-Origin"] != "*" {
		t.Error("Expected CORS origin header")
	}

	if response.Headers["Access-Control-Allow-Methods"] != "POST,OPTIONS" {
		t.Error("Expected CORS methods header")
	}
}

func TestLoginRequest_Struct(t *testing.T) {
	req := LoginRequest{
		Email:    "test@example.com",
		Password: "password123",
	}

	if req.Email != "test@example.com" {
		t.Errorf("Expected email 'test@example.com', got '%s'", req.Email)
	}

	if req.Password != "password123" {
		t.Errorf("Expected password 'password123', got '%s'", req.Password)
	}
}
