package services

import (
	"balkanid-capstone/internal/models"
	"balkanid-capstone/internal/repo"
)

type PartialPublicService struct {
	repo *repo.PartialPublicRepo
}

func NewPartialPublicService(repo *repo.PartialPublicRepo) *PartialPublicService {
	return &PartialPublicService{repo: repo}
}

func (s *PartialPublicService) ShareFile(fileID, email string) error {
	return s.repo.CreateAndAttach(fileID, email)
}

func (s *PartialPublicService) UnshareFile(fileID, email string) error {
	return s.repo.Delete(fileID, email)
}

func (s *PartialPublicService) GetFileShares(fileID string) ([]models.PartialPublic, error) {
	return s.repo.GetByFile(fileID)
}

func (s *PartialPublicService) GetFilesForUser(email string) ([]models.PartialPublic, error) {
	return s.repo.GetByEmail(email)
}