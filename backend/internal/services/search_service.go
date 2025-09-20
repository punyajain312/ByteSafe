package services

import (
    "balkanid-capstone/internal/models"
    "balkanid-capstone/internal/repo"
)

type SearchService struct {
    Repo *repo.SearchRepo
}

func NewSearchService(r *repo.SearchRepo) *SearchService {
    return &SearchService{Repo: r}
}

func (s *SearchService) SearchFiles(userID, q, mime string) ([]models.File, error) {
    return s.Repo.SearchFiles(userID, q, mime)
}