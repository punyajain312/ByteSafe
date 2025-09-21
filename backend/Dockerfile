FROM golang:1.25-alpine AS builder
WORKDIR /app

# Add netcat here 👇
RUN apk add --no-cache git netcat-openbsd

ENV GOPROXY=https://proxy.golang.org,direct

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server .

# final stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/server .

# Add netcat in runtime too (needed for "nc")
RUN apk add --no-cache netcat-openbsd

EXPOSE 8080
CMD ["./server"]