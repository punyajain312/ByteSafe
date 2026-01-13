package services

import "balkanid-capstone/internal/repo"

type SuggestionService struct {
	Repo *repo.SuggestionRepo
}

func NewSuggestionService(r *repo.SuggestionRepo) *SuggestionService {
	return &SuggestionService{Repo: r}
}

func (s *SuggestionService) SuggestFilenames(userID, query string) ([]string, error) {
	return s.Repo.SuggestFilenames(userID, query)
}

func (s *SuggestionService) SuggestUploaders(userID, query string) ([]string, error) {
	return s.Repo.SuggestUploaders(userID, query)
}