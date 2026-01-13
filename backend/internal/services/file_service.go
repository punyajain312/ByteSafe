package services

import (
    "database/sql"
    "os"
    "balkanid-capstone/internal/models"
    "balkanid-capstone/internal/repo"
)

type FileService struct {
    Repo *repo.FileRepo
    DB   *sql.DB
}

func NewFileService(r *repo.FileRepo, db *sql.DB) *FileService {
    return &FileService{Repo: r, DB: db}
}

func (s *FileService) ListFiles(userID string) ([]models.File, error) {
    return s.Repo.ListFiles(userID)
}

func (s *FileService) DeleteFile(userID, fileID string) error {
    tx, err := s.DB.Begin()
    if err != nil {
        return err
    }
    defer tx.Rollback()

    blobID, blobPath, err := s.Repo.GetFileBlob(tx, fileID, userID)
    if err != nil {
        return err
    }

    if err := s.Repo.DeleteFileRecord(tx, fileID, userID); err != nil {
        return err
    }

    refCount, err := s.Repo.DecrementRefCount(tx, blobID)
    if err != nil {
        return err
    }

    if refCount <= 0 {
        if err := s.Repo.DeleteBlob(tx, blobID); err != nil {
            return err
        }
        _ = os.Remove(blobPath) // remove file from disk
    }

    return tx.Commit()
}

func (s *FileService) UpdateVisibility(fileID, visibility string) error {
    return s.Repo.UpdateVisibility(fileID, visibility)
}

func (s *FileService) ShareWithUser(fileID, email string) error {
    return s.Repo.ShareWithUser(fileID, email)
}

func (s *FileService) BulkUpdateVisibility(userID string, fileIDs []string, visibility string) error {
    return s.Repo.BulkUpdateVisibility(userID, fileIDs, visibility)
}

func (s *FileService) BulkDelete(userID string, fileIDs []string) error {
    for _, fileID := range fileIDs {
        if err := s.DeleteFile(userID, fileID); err != nil {
            return err
        }
    }
    return nil
}