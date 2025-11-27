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
		Body:       `{"email": "", "password": "test123", "name": "Test"}`,
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

	if errorResp.Error != "Email, password, and name are required" {
		t.Errorf("Expected validation error, got '%s'", errorResp.Error)
	}
}

func TestHandler_MissingPassword(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       `{"email": "test@example.com", "password": "", "name": "Test"}`,
	}

	response, err := Handler(context.Background(), request)
	if err != nil {
		t.Fatalf("Handler returned error: %v", err)
	}

	if response.StatusCode != 400 {
		t.Errorf("Expected status 400, got %d", response.StatusCode)
	}
}

func TestHandler_MissingName(t *testing.T) {
	request := events.APIGatewayProxyRequest{
		HTTPMethod: "POST",
		Body:       `{"email": "test@example.com", "password": "test123", "name": ""}`,
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

func TestRegisterRequest_Struct(t *testing.T) {
	req := RegisterRequest{
		Email:    "test@example.com",
		Password: "password123",
		Name:     "Test User",
	}

	if req.Email != "test@example.com" {
		t.Errorf("Expected email 'test@example.com', got '%s'", req.Email)
	}

	if req.Password != "password123" {
		t.Errorf("Expected password 'password123', got '%s'", req.Password)
	}

	if req.Name != "Test User" {
		t.Errorf("Expected name 'Test User', got '%s'", req.Name)
	}
}
