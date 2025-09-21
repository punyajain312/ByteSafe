package services

import (
	"balkanid-capstone/internal/models"
	"balkanid-capstone/internal/repo"
)

type AdminDashService interface {
	ListUsers() ([]models.AdminUser, error)
	ListAllFiles() ([]models.AdminFile, error)
	SystemStats() (models.AdminStats, error)
}

type adminDashService struct {
	repo repo.AdminDashRepo
}

func NewAdminDashService(r repo.AdminDashRepo) AdminDashService {
	return &adminDashService{repo: r}
}

func (s *adminDashService) ListUsers() ([]models.AdminUser, error) {
	return s.repo.ListUsers()
}

func (s *adminDashService) ListAllFiles() ([]models.AdminFile, error) {
	return s.repo.ListAllFiles()
}

func (s *adminDashService) SystemStats() (models.AdminStats, error) {
	return s.repo.SystemStats()
}