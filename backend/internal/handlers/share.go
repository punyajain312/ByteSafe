package handlers

import (
	"encoding/json"
	"net/http"
	"balkanid-capstone/internal/services"
)

type ShareHandler struct {
	Service *services.ShareService
}

func NewShareHandler(service *services.ShareService) *ShareHandler {
	return &ShareHandler{Service: service}
}

// POST /share?id=<fileID>
func (h *ShareHandler) CreateShare(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := r.Context().Value("user_id").(string)
	if !ok || ownerID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	fileID := r.URL.Query().Get("id")
	if fileID == "" {
		http.Error(w, "missing file id", http.StatusBadRequest)
		return
	}

	shareID, err := h.Service.CreateShare(fileID, ownerID)
	if err != nil {
		http.Error(w, "create share error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"share_id": shareID,
		"link":     "http://localhost:8080/public/file?id=" + shareID,
	})
}

// POST /unshare?id=<fileID>
func (h *ShareHandler) UnshareFile(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := r.Context().Value("user_id").(string)
	if !ok || ownerID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	fileID := r.URL.Query().Get("id")
	if fileID == "" {
		http.Error(w, "missing file id", http.StatusBadRequest)
		return
	}

	if err := h.Service.RemoveShare(fileID, ownerID); err != nil {
		http.Error(w, "failed to unshare: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "File unshared successfully",
	})
}

// POST /share/user
func (h *ShareHandler) ShareWithUser(w http.ResponseWriter, r *http.Request) {
	ownerID, ok := r.Context().Value("user_id").(string)
	if !ok || ownerID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		FileID string `json:"file_id"`
		Email  string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	// TODO: Implement file_shares table logic
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "File shared with " + req.Email,
	})
}

// GET /public/list
func (h *ShareHandler) ListShares(w http.ResponseWriter, r *http.Request) {
	shares, err := h.Service.ListShares()
	if err != nil {
		http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"files": shares})
}

// GET /public/file?id=<shareID>
func (h *ShareHandler) AccessShare(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "missing share id", http.StatusBadRequest)
		return
	}

	if err := h.Service.IncrementDownload(id); err != nil {
		http.Error(w, "failed to increment: "+err.Error(), http.StatusInternalServerError)
		return
	}

	share, err := h.Service.GetShareByID(id)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(share)
}