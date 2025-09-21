package handlers

import (
	"balkanid-capstone/internal/services"
	"net/http"

	"encoding/json"
)

type PartialPublicHandler struct {
	service *services.PartialPublicService
}

func NewPartialPublicHandler(service *services.PartialPublicService) *PartialPublicHandler {
	return &PartialPublicHandler{service: service}
}

// POST /partial-public/share
func (h *PartialPublicHandler) ShareFile(w http.ResponseWriter, r *http.Request) {
	var body struct {
		FileID string `json:"file_id"`
		Email  string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	if err := h.service.ShareFile(body.FileID, body.Email); err != nil {
		http.Error(w, "could not share", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "file shared"})
}

// DELETE /partial-public/unshare
func (h *PartialPublicHandler) UnshareFile(w http.ResponseWriter, r *http.Request) {
	var body struct {
		FileID string `json:"file_id"`
		Email  string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	if err := h.service.UnshareFile(body.FileID, body.Email); err != nil {
		http.Error(w, "could not unshare", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "file unshared"})
}

// GET /partial-public/file?id=xxx
func (h *PartialPublicHandler) GetFileShares(w http.ResponseWriter, r *http.Request) {
	fileID := r.URL.Query().Get("id")
	if fileID == "" {
		http.Error(w, "missing file id", http.StatusBadRequest)
		return
	}

	shares, err := h.service.GetFileShares(fileID)
	if err != nil {
		http.Error(w, "could not fetch", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(shares)
}

// GET /partial-public/user?email=xxx
func (h *PartialPublicHandler) GetFilesForUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "missing email", http.StatusBadRequest)
		return
	}

	files, err := h.service.GetFilesForUser(email)
	if err != nil {
		http.Error(w, "could not fetch", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(files)
}