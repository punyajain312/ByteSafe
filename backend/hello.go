package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func ma() {
	hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	fmt.Println(string(hash))
}