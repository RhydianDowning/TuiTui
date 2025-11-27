package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
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

// ChatMessage represents a message in the conversation history
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// callClaude calls the Anthropic Claude API with conversation history and system context
func callClaude(messages []ChatMessage, systemPrompt string, apiKey string) (string, error) {
	if apiKey == "" {
		return "", fmt.Errorf("Anthropic API key not configured")
	}

	url := "https://api.anthropic.com/v1/messages"

	// Convert ChatMessage to the format Claude expects
	claudeMessages := make([]map[string]string, len(messages))
	for i, msg := range messages {
		claudeMessages[i] = map[string]string{
			"role":    msg.Role,
			"content": msg.Content,
		}
	}

	requestBody := map[string]interface{}{
		"model":      "claude-3-haiku-20240307",
		"max_tokens": 1000,
		"messages":   claudeMessages,
	}

	// Add system prompt if provided
	if systemPrompt != "" {
		requestBody["system"] = systemPrompt
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", apiKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to call Claude API: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Claude API error: %s", string(body))
	}

	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %v", err)
	}

	if content, ok := response["content"].([]interface{}); ok && len(content) > 0 {
		if textBlock, ok := content[0].(map[string]interface{}); ok {
			if text, ok := textBlock["text"].(string); ok {
				return text, nil
			}
		}
	}

	return "No response from Claude", nil
}

// Handler is the Lambda function handler
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

	// Parse request body
	var chatReq struct {
		Message             string        `json:"message"`
		ConversationHistory []ChatMessage `json:"conversationHistory,omitempty"`
		Team                string        `json:"team,omitempty"`
		TeamInfo            []string      `json:"teamInfo,omitempty"`
		MarkdownContent     string        `json:"markdownContent,omitempty"`
	}
	if err := json.Unmarshal([]byte(request.Body), &chatReq); err != nil {
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
	if chatReq.Message == "" {
		errorResponse := ErrorResponse{
			Error: "Message is required",
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Build system prompt with additional context
	var systemParts []string
	if chatReq.Team != "" {
		systemParts = append(systemParts, "Team: "+chatReq.Team)
	}
	if len(chatReq.TeamInfo) > 0 {
		systemParts = append(systemParts, "Team Information: "+strings.Join(chatReq.TeamInfo, ", "))
	}
	if chatReq.MarkdownContent != "" {
		systemParts = append(systemParts, "Additional context from uploaded document:\n"+chatReq.MarkdownContent)
	}

	systemPrompt := ""
	if len(systemParts) > 0 {
		systemPrompt = "You have access to the following additional context:\n\n" + strings.Join(systemParts, "\n\n")
	}

	// Build messages array with conversation history and new message
	var messages []ChatMessage
	if len(chatReq.ConversationHistory) > 0 {
		messages = append(messages, chatReq.ConversationHistory...)
	}
	messages = append(messages, ChatMessage{
		Role:    "user",
		Content: chatReq.Message,
	})

	// Log for debugging
	fmt.Printf("Conversation history received: %d messages\n", len(chatReq.ConversationHistory))
	fmt.Printf("Total messages being sent to Claude: %d\n", len(messages))
	for i, msg := range messages {
		fmt.Printf("Message %d [%s]: %s\n", i, msg.Role, msg.Content[:min(50, len(msg.Content))])
	}

	// Get API key from environment
	apiKey := os.Getenv("ANTHROPIC_API_KEY")

	// Call Claude API with conversation history and system prompt
	claudeResponse, err := callClaude(messages, systemPrompt, apiKey)
	if err != nil {
		errorResponse := ErrorResponse{
			Error: fmt.Sprintf("Failed to get response from Claude: %v", err),
		}
		errorBody, _ := json.Marshal(errorResponse)
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       string(errorBody),
			Headers:    corsHeaders,
		}, nil
	}

	// Create response
	response := Response{
		Message:     claudeResponse,
		Environment: "development",
		AWSRegion:   "eu-west-2",
		APIVersion:  "v1",
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
