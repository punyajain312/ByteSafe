package handlers

import (
	"balkanid-capstone/internal/services"
	"encoding/json"
	"net/http"
)

type AdminDashHandler struct {
	service services.AdminDashService
}

func NewAdminDashHandler(s services.AdminDashService) *AdminDashHandler {
	return &AdminDashHandler{service: s}
}

// GET /admin/users
func (h *AdminDashHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.ListUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(users)
}

// GET /admin/files
func (h *AdminDashHandler) ListAllFiles(w http.ResponseWriter, r *http.Request) {
	files, err := h.service.ListAllFiles()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(files)
}

// GET /admin/stats
func (h *AdminDashHandler) SystemStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.service.SystemStats()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(stats)
}