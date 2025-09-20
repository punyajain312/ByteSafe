package services

import (
    "balkanid-capstone/internal/models"
    "balkanid-capstone/internal/repo"
)

type ShareService struct {
    Repo *repo.ShareRepo
}

func NewShareService(repo *repo.ShareRepo) *ShareService {
    return &ShareService{Repo: repo}
}

func (s *ShareService) CreateShare(fileID, ownerID string) (string, error) {
    return s.Repo.CreateShare(fileID, ownerID)
}

func (s *ShareService) ListShares() ([]models.PublicFile, error) {
    return s.Repo.ListShares()
}

func (s *ShareService) GetShareByID(id string) (*models.PublicFile, error) {
    return s.Repo.GetShareByID(id)
}

func (s *ShareService) IncrementDownload(id string) error {
    return s.Repo.IncrementDownloadCount(id)
}