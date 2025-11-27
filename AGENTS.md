# AGENTS.md

## Build/Lint/Test Commands

### Frontend (Next.js/TypeScript)
- Build: `npm run build`
- Lint: `npm run lint`
- Dev server: `npm run dev`
- Start production: `npm run start`
- Test all: `npm test`
- Test single file: `npx playwright test e2e/settings.spec.ts`
- Test with UI: `npm run test:ui`
- Test headed: `npm run test:headed`

### Backend (Go)
- Build all: `cd backend && make build`
- Build single Lambda: `cd backend && make build-health` (or other function name)
- Test all: `cd backend && make test`
- Test single: `cd backend && go test ./cmd/lambda/health/...`
- Clean: `cd backend && make clean`
- Install deps: `cd backend && make deps`
- Run locally: `cd backend && make run`

## Code Style Guidelines

### TypeScript/React
- Use strict TypeScript with `strict: true`
- Functional components with hooks
- Absolute imports with `@/` aliases
- shadcn/ui components with Tailwind CSS
- PascalCase for components, camelCase for variables/functions
- Import grouping: external libs, then internal with `@/` aliases
- Error handling: try/catch with proper error messages
- Form validation with React Hook Form + Zod

### Go
- Standard Go formatting and naming conventions
- AWS Lambda handlers with proper error responses
- JSON responses with consistent structure
- Environment-based configuration
- Proper error handling with descriptive messages

### General
- No comments unless absolutely necessary
- Follow existing patterns in codebase
- Use existing libraries (Radix UI, Tailwind, etc.)