# ---- Build Stage ----
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install dependencies for Go and curl for migrate
RUN apk add --no-cache git build-base curl bash

# Install migrate CLI (static binary)
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.17.0/migrate.linux-amd64.tar.gz \
    | tar -xz -C /usr/local/bin

# Copy go.mod and go.sum first (better layer caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Build Go binaries
RUN go build -o server ./cmd/server
RUN go build -o init ./cmd/init

# ---- Runtime Stage ----
FROM alpine:latest

WORKDIR /app

RUN apk add --no-cache ca-certificates bash wget

# Copy migrate binary
COPY --from=builder /usr/local/bin/migrate /usr/local/bin/migrate

# Copy backend binaries
COPY --from=builder /app/server .
COPY --from=builder /app/init .

# Copy migrations into image (so backend and migrate can use them)
COPY --from=builder /app/migrations ./migrations

# ✅ Ensure binaries are executable
# Build Go binaries for Linux amd64 (to match Alpine runtime)
# RUN GOOS=linux GOARCH=amd64 go build -o server ./cmd/server
# RUN GOOS=linux GOARCH=amd64 go build -o init ./cmd/init
RUN chmod +x /app/server /app/init /usr/local/bin/migrate

EXPOSE 8080

# Default: run server (migrations are handled by "migrate" service in docker-compose)
CMD ["./server"]