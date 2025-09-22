package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

func runMigrations(dsn string) error {
	fmt.Println("Running migrations...")

	cmd := exec.Command("migrate", "app/backend/", "migrations", "-database", dsn, "up")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func main() {
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN environment variable not set")
	}

	if err := runMigrations(dsn); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	fmt.Println(" Migrations applied successfully")
}