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

// POST
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
        "link":     "http://localhost:8080/public/file?id=" + shareID, // ✅ full link
    })
}

// GET
func (h *ShareHandler) ListShares(w http.ResponseWriter, r *http.Request) {
    shares, err := h.Service.ListShares()
    if err != nil {
        http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{"files": shares})
}


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
