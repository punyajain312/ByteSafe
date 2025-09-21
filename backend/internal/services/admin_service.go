package services

import (
	"balkanid-capstone/internal/models"
	"balkanid-capstone/internal/repo"
	"errors"
	"time"
    "fmt"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var adminJwtKey = []byte("supersecretkey") // move to config/env

type AdminService interface {
	Login(creds models.Credentials) (string, error)
}

type adminService struct {
	repo repo.AdminRepo
}

func NewAdminService(r repo.AdminRepo) AdminService {
	return &adminService{repo: r}
}

func (s *adminService) Login(creds models.Credentials) (string, error) {
	user, err := s.repo.GetAdminByEmail(creds.Email)
    if err != nil {
        fmt.Println("No user found:", err)   // DEBUG
        return "", errors.New("invalid credentials")
    }

    if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(creds.Password)) != nil {
        fmt.Println("Password mismatch")    // DEBUG
        return "", errors.New("invalid credentials")
    }

	// Create JWT token
	claims := &models.AdminClaims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(adminJwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}