.PHONY: build clean test run

# Build the Lambda function
build:
	@echo "Building Lambda function..."
	cd cmd/lambda/health && GOOS=linux GOARCH=amd64 go build -o ../../../bin/health main.go
	@echo "Build complete: bin/health"

# Build for local testing (native OS)
build-local:
	@echo "Building for local testing..."
	cd cmd/lambda/health && go build -o ../../../bin/health-local main.go
	@echo "Build complete: bin/health-local"

# Run the health function locally
run: build-local
	@echo "Running health function..."
	./bin/health-local

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -rf bin/
	@echo "Clean complete"

# Run tests
test:
	@echo "Running tests..."
	go test ./...

# Install dependencies
deps:
	@echo "Installing dependencies..."
	go mod tidy
	go mod download
