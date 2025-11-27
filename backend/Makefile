.PHONY: build clean test run

# Build the Lambda functions
build: build-health build-auth-register build-auth-login build-chat
	@echo "All Lambda functions built"

build-health:
	@echo "Building health Lambda function..."
	cd cmd/lambda/health && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/bootstrap main.go
	@echo "Build complete: bin/bootstrap"

build-auth-register:
	@echo "Building auth-register Lambda function..."
	cd cmd/lambda/auth-register && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/bootstrap-auth-register main.go
	chmod +x bin/bootstrap-auth-register
	@echo "Build complete: bin/bootstrap-auth-register"

build-auth-login:
	@echo "Building auth-login Lambda function..."
	cd cmd/lambda/auth-login && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/bootstrap-auth-login main.go
	chmod +x bin/bootstrap-auth-login
	@echo "Build complete: bin/bootstrap-auth-login"

build-chat:
	@echo "Building chat Lambda function..."
	cd cmd/lambda/chat && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/bootstrap main.go
	chmod +x bin/bootstrap
	@echo "Build complete: bin/bootstrap"

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
