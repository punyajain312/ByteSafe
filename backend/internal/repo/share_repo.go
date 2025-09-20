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


func (r *ShareRepo) CreateShare(fileID, ownerID string) (string, error) {
    // Check if already shared
    var existingID string
    err := r.DB.QueryRow(`
        SELECT id FROM public_files
        WHERE file_id = $1 AND owner_id = $2
    `, fileID, ownerID).Scan(&existingID)

    if err == nil {
        // already exists → increment ref_count
        _, err = r.DB.Exec(`
            UPDATE public_files
            SET ref_count = ref_count + 1
            WHERE id = $1
        `, existingID)
        if err != nil {
            return "", err
        }
        return existingID, nil
    }

    // else → create new
    id := uuid.New().String()
    _, err = r.DB.Exec(`
        INSERT INTO public_files (id, file_id, owner_id, ref_count, download_count, created_at)
        VALUES ($1, $2, $3, 1, 0, NOW())
    `, id, fileID, ownerID)
    if err != nil {
        return "", err
    }
    return id, nil
}
func (r *ShareRepo) RemoveShare(fileID, ownerID string) error {
    var refCount int
    err := r.DB.QueryRow(`
        SELECT ref_count FROM public_files
        WHERE file_id = $1 AND owner_id = $2
    `, fileID, ownerID).Scan(&refCount)
    if err != nil {
        return err
    }

    if refCount > 1 {
        // just decrement
        _, err = r.DB.Exec(`
            UPDATE public_files
            SET ref_count = ref_count - 1
            WHERE file_id = $1 AND owner_id = $2
        `, fileID, ownerID)
        return err
    }

    // else delete row
    _, err = r.DB.Exec(`
        DELETE FROM public_files
        WHERE file_id = $1 AND owner_id = $2
    `, fileID, ownerID)
    return err
}

// List all public shares with file info
func (r *ShareRepo) ListShares() ([]models.PublicFile, error) {
    rows, err := r.DB.Query(`
        SELECT pf.id, pf.file_id, pf.owner_id, u.name,
            f.filename, f.mime_type, f.size,
            pf.download_count, pf.created_at
        FROM public_files pf
        JOIN files f ON pf.file_id = f.id
        JOIN users u ON pf.owner_id = u.id  
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
            &pf.ID, &pf.FileID, &pf.OwnerID, &pf.OwnerName,
            &pf.Filename, &pf.MimeType, &pf.Size,
            &pf.DownloadCount, &pf.CreatedAt,
        ); err != nil {
            return nil, err
        }
        shares = append(shares, pf)
    }
    return shares, nil
}

// Get share by ID
func (r *ShareRepo) GetShareByID(id string) (*models.PublicFile, error) {
    var pf models.PublicFile
    err := r.DB.QueryRow(`
        SELECT pf.id, pf.file_id, pf.owner_id, f.filename, f.mime_type, f.size,
               pf.download_count, pf.created_at
        FROM public_files pf
        JOIN files f ON pf.file_id = f.id
        WHERE pf.id = $1
    `, id).Scan(
        &pf.ID, &pf.FileID, &pf.OwnerID,
        &pf.Filename, &pf.MimeType, &pf.Size,
        &pf.DownloadCount, &pf.CreatedAt,
    )
    if err != nil {
        return nil, err
    }
    return &pf, nil
}

// Increment download count
func (r *ShareRepo) IncrementDownloadCount(id string) error {
    _, err := r.DB.Exec(`
        UPDATE public_files 
        SET download_count = download_count + 1
        WHERE id = $1
    `, id)
    return err
}