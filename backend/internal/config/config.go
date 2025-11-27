package config

import (
	"fmt"
	"os"
	"strconv"
)

// Config holds all configuration for the application
type Config struct {
	// App configuration
	Environment string // e.g., "development", "staging", "production"
	LogLevel    string // e.g., "debug", "info", "warn", "error"

	// AWS configuration
	AWSRegion string

	// API configuration
	APIVersion string

	// Cognito configuration
	CognitoUserPoolID       string
	CognitoUserPoolClientID string

	// Database configuration (for future use)
	DBHost     string
	DBPort     int
	DBName     string
	DBUser     string
	DBPassword string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		Environment:             getEnv("ENVIRONMENT", "development"),
		LogLevel:                getEnv("LOG_LEVEL", "info"),
		AWSRegion:               getEnv("AWS_REGION", "eu-west-2"), // Default to eu-west-2 for our deployment
		APIVersion:              getEnv("API_VERSION", "v1"),
		CognitoUserPoolID:       getEnv("COGNITO_USER_POOL_ID", ""),
		CognitoUserPoolClientID: getEnv("COGNITO_USER_POOL_CLIENT_ID", ""),
		DBHost:                  getEnv("DB_HOST", ""),
		DBPort:                  getEnvAsInt("DB_PORT", 5432),
		DBName:                  getEnv("DB_NAME", ""),
		DBUser:                  getEnv("DB_USER", ""),
		DBPassword:              getEnv("DB_PASSWORD", ""),
	}

	// Validate required fields
	if err := cfg.Validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// Validate checks if required configuration values are set
func (c *Config) Validate() error {
	// Add validation for required fields here
	// For now, we'll keep it simple since health endpoint doesn't need much
	if c.Environment == "" {
		return fmt.Errorf("ENVIRONMENT must be set")
	}
	return nil
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

// Helper functions

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt gets an environment variable as an integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue
	}

	value, err := strconv.Atoi(valueStr)
	if err != nil {
		return defaultValue
	}

	return value
}
