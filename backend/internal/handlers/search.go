package handlers

import (
	"encoding/json"
	"net/http"

	"balkanid-capstone/internal/services"
)

type SearchHandler struct {
	Service *services.SearchService
}

func NewSearchHandler(service *services.SearchService) *SearchHandler {
	return &SearchHandler{Service: service}
}

func (h *SearchHandler) SearchFiles(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Filename string `json:"filename"`
        Mime     string `json:"mime"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request", http.StatusBadRequest)
        return
    }

    // ✅ Fix: use "user_id" to match AuthMiddleware
    uid := r.Context().Value("user_id")
    userID, ok := uid.(string)
    if !ok {
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }

    files, err := h.Service.SearchFiles(userID, req.Filename, req.Mime)
    if err != nil {
        http.Error(w, "search failed", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(map[string]interface{}{"files": files}); err != nil {
        http.Error(w, "failed to encode response", http.StatusInternalServerError)
        return
    }
}