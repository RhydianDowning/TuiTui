package main

import (
	"fmt"
	"log"

	"github.com/yourusername/tuitui-backend/internal/config"
)

func main() {
	// Load configuration from environment variables
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	fmt.Printf("Health check endpoint running in %s environment\n", cfg.Environment)
	fmt.Printf("Log level: %s\n", cfg.LogLevel)
	fmt.Printf("AWS Region: %s\n", cfg.AWSRegion)
	fmt.Printf("API Version: %s\n", cfg.APIVersion)

	// This is ready for Phase 2 Lambda implementation
	fmt.Println("Status: OK")
}
