package handlers

import (
	"balkanid-capstone/internal/models"
	"balkanid-capstone/internal/services"
	"encoding/json"
	"net/http"
)

type AdminAuthHandler struct {
	service services.AdminService
}

func NewAdminAuthHandler(s services.AdminService) *AdminAuthHandler {
	return &AdminAuthHandler{service: s}
}

func (h *AdminAuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var creds models.Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	token, err := h.service.Login(creds)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}