package handlers

import (
    "encoding/json"
    "net/http"

    "balkanid-capstone/internal/services"
)

type FileHandler struct {
    Service *services.FileService
}

func NewFileHandler(service *services.FileService) *FileHandler {
    return &FileHandler{Service: service}
}

func (h *FileHandler) ListFiles(w http.ResponseWriter, r *http.Request) {
    userID, ok := r.Context().Value("user_id").(string)
    if !ok || userID == "" {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    files, err := h.Service.ListFiles(userID)
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(files)
}

func (h *FileHandler) DeleteFile(w http.ResponseWriter, r *http.Request) {
    userID, ok := r.Context().Value("user_id").(string)
    if !ok || userID == "" {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    fileID := r.URL.Query().Get("id")
    if fileID == "" {
        http.Error(w, "missing file id", http.StatusBadRequest)
        return
    }

    if err := h.Service.DeleteFile(userID, fileID); err != nil {
        http.Error(w, "delete error: "+err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

func (h *FileHandler) UpdateVisibility(w http.ResponseWriter, r *http.Request) {
    fileID := r.URL.Query().Get("id")
    var req struct {
        Visibility string `json:"visibility"`
        Email      string `json:"email,omitempty"`
    }

    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request", http.StatusBadRequest)
        return
    }

    if req.Visibility == "shared" && req.Email != "" {
        // add to file_shares
        if err := h.Service.ShareWithUser(fileID, req.Email); err != nil {
            http.Error(w, "failed to share with user", http.StatusInternalServerError)
            return
        }
    }

    if err := h.Service.UpdateVisibility(fileID, req.Visibility); err != nil {
        http.Error(w, "failed to update visibility", http.StatusInternalServerError)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"status": "updated"})
}