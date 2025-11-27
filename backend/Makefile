.PHONY: build clean test run

# Build the Lambda functions
build: build-health build-auth-register build-auth-login build-auth-verify build-auth-resend-code build-chat
	@echo "All Lambda functions built"

build-health:
	@echo "Building health Lambda function..."
	mkdir -p bin/health
	cd cmd/lambda/health && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/health/bootstrap main.go
	chmod +x bin/health/bootstrap
	@echo "Build complete: bin/health/bootstrap"

build-auth-register:
	@echo "Building auth-register Lambda function..."
	mkdir -p bin/auth-register
	cd cmd/lambda/auth-register && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/auth-register/bootstrap main.go
	chmod +x bin/auth-register/bootstrap
	@echo "Build complete: bin/auth-register/bootstrap"

build-auth-login:
	@echo "Building auth-login Lambda function..."
	mkdir -p bin/auth-login
	cd cmd/lambda/auth-login && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/auth-login/bootstrap main.go
	chmod +x bin/auth-login/bootstrap
	@echo "Build complete: bin/auth-login/bootstrap"

build-auth-verify:
	@echo "Building auth-verify Lambda function..."
	mkdir -p bin/auth-verify
	cd cmd/lambda/auth-verify && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/auth-verify/bootstrap main.go
	chmod +x bin/auth-verify/bootstrap
	@echo "Build complete: bin/auth-verify/bootstrap"

build-auth-resend-code:
	@echo "Building auth-resend-code Lambda function..."
	mkdir -p bin/auth-resend-code
	cd cmd/lambda/auth-resend-code && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/auth-resend-code/bootstrap main.go
	chmod +x bin/auth-resend-code/bootstrap
	@echo "Build complete: bin/auth-resend-code/bootstrap"

build-chat:
	@echo "Building chat Lambda function..."
	mkdir -p bin/chat
	cd cmd/lambda/chat && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../../../bin/chat/bootstrap main.go
	chmod +x bin/chat/bootstrap
	@echo "Build complete: bin/chat/bootstrap"

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
