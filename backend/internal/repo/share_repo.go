package repo

import (
    "database/sql"
    "balkanid-capstone/internal/models"
    "github.com/google/uuid"
)

type ShareRepo struct {
    DB *sql.DB
}

func NewShareRepo(db *sql.DB) *ShareRepo {
    return &ShareRepo{DB: db}
}

// Insert new share
func (r *ShareRepo) CreateShare(fileID, ownerID string, visibility string) (string, error) {
    id := uuid.New().String()
    _, err := r.DB.Exec(`
        INSERT INTO public_files (id, file_id, owner_id, visibility, download_count, created_at)
        VALUES ($1, $2, $3, $4, 0, NOW())
    `, id, fileID, ownerID, visibility)
    if err != nil {
        return "", err
    }
    return id, nil
}

// List all public shares with joined file info
func (r *ShareRepo) ListShares() ([]models.PublicFile, error) {
    rows, err := r.DB.Query(`
        SELECT pf.id, pf.file_id, pf.owner_id, f.filename, f.mime_type, f.size,
               pf.visibility, pf.download_count, pf.created_at
        FROM public_files pf
        JOIN files f ON pf.file_id = f.id
        ORDER BY pf.created_at DESC
    `)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    shares := []models.PublicFile{}
    for rows.Next() {
        var pf models.PublicFile
        if err := rows.Scan(
            &pf.ID, &pf.FileID, &pf.OwnerID,
            &pf.Filename, &pf.MimeType, &pf.Size,
            &pf.Visibility, &pf.DownloadCount, &pf.CreatedAt,
        ); err != nil {
            return nil, err
        }
        shares = append(shares, pf)
    }
    return shares, nil
}

func (r *ShareRepo) GetShareByID(id string) (*models.PublicFile, error) {
    var pf models.PublicFile
    err := r.DB.QueryRow(`
        SELECT pf.id, pf.file_id, pf.owner_id, f.filename, f.mime_type, f.size,
               pf.visibility, pf.download_count, pf.created_at
        FROM public_files pf
        JOIN files f ON pf.file_id = f.id
        WHERE pf.id = $1
    `, id).Scan(
        &pf.ID, &pf.FileID, &pf.OwnerID,
        &pf.Filename, &pf.MimeType, &pf.Size,
        &pf.Visibility, &pf.DownloadCount, &pf.CreatedAt,
    )
    if err != nil {
        return nil, err
    }
    return &pf, nil
}

func (r *ShareRepo) IncrementDownloadCount(id string) error {
    _, err := r.DB.Exec(`
        UPDATE public_files 
        SET download_count = download_count + 1
        WHERE id = $1
    `, id)
    return err
}