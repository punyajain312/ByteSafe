package handlers

import (
	"encoding/json"
	"net/http"

	"balkanid-capstone/internal/services"
)

type SuggestionHandler struct {
	Service *services.SuggestionService
}

func NewSuggestionHandler(service *services.SuggestionService) *SuggestionHandler {
	return &SuggestionHandler{Service: service}
}

func (h *SuggestionHandler) SuggestFilenames(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if len(query) < 2 {
		json.NewEncoder(w).Encode([]string{})
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	results, err := h.Service.SuggestFilenames(userID, query)
	if err != nil {
		http.Error(w, "failed to fetch suggestions", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

func (h *SuggestionHandler) SuggestUploaders(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if len(query) < 2 {
		json.NewEncoder(w).Encode([]string{})
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	results, err := h.Service.SuggestUploaders(userID, query)
	if err != nil {
		http.Error(w, "failed to fetch suggestions", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}