package config

import (
	"testing"
)

func TestLoad(t *testing.T) {
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load returned error: %v", err)
	}

	if cfg == nil {
		t.Fatal("Expected config, got nil")
	}
}

func TestConfig_Defaults(t *testing.T) {
	cfg, _ := Load()

	if cfg.Environment != "development" {
		t.Errorf("Expected default environment 'development', got '%s'", cfg.Environment)
	}

	if cfg.AWSRegion != "eu-west-2" {
		t.Errorf("Expected default region 'eu-west-2', got '%s'", cfg.AWSRegion)
	}

	if cfg.APIVersion != "v1" {
		t.Errorf("Expected default API version 'v1', got '%s'", cfg.APIVersion)
	}

	if cfg.LogLevel != "info" {
		t.Errorf("Expected default log level 'info', got '%s'", cfg.LogLevel)
	}
}

func TestConfig_IsDevelopment(t *testing.T) {
	cfg := &Config{Environment: "development"}

	if !cfg.IsDevelopment() {
		t.Error("Expected IsDevelopment to return true")
	}

	cfg.Environment = "production"
	if cfg.IsDevelopment() {
		t.Error("Expected IsDevelopment to return false")
	}
}

func TestConfig_IsProduction(t *testing.T) {
	cfg := &Config{Environment: "production"}

	if !cfg.IsProduction() {
		t.Error("Expected IsProduction to return true")
	}

	cfg.Environment = "development"
	if cfg.IsProduction() {
		t.Error("Expected IsProduction to return false")
	}
}

func TestConfig_Validate(t *testing.T) {
	cfg := &Config{Environment: ""}

	err := cfg.Validate()
	if err == nil {
		t.Error("Expected validation error for empty environment")
	}

	cfg.Environment = "development"
	err = cfg.Validate()
	if err != nil {
		t.Errorf("Expected no validation error, got: %v", err)
	}
}

func TestGetEnv(t *testing.T) {
	result := getEnv("NONEXISTENT_VAR", "default")
	if result != "default" {
		t.Errorf("Expected 'default', got '%s'", result)
	}
}

func TestGetEnvAsInt(t *testing.T) {
	result := getEnvAsInt("NONEXISTENT_VAR", 42)
	if result != 42 {
		t.Errorf("Expected 42, got %d", result)
	}
}
