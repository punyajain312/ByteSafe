package repo

import (
	"balkanid-capstone/internal/models"
	"database/sql"
)

type PartialPublicRepo struct {
	db *sql.DB
}

func NewPartialPublicRepo(db *sql.DB) *PartialPublicRepo {
	return &PartialPublicRepo{db: db}
}

// Create entry
func (r *PartialPublicRepo) CreateAndAttach(fileID, email string) error {
	// 1. Find user by email
	var userID string
	err := r.db.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&userID)
	if err != nil {
		return err
	}

	// 2. Get file details from original owner
	var blobID, filename, mimeType string
	var size int64
	err = r.db.QueryRow(
		"SELECT blob_id, filename, mime_type, size FROM files WHERE id=$1",
		fileID,
	).Scan(&blobID, &filename, &mimeType, &size)
	if err != nil {
		return err
	}

	// 3. Insert into file_shares table
	_, err = r.db.Exec(
		"INSERT INTO file_shares (file_id, shared_with_email) VALUES ($1, $2)",
		fileID, email,
	)
	if err != nil {
		return err
	}

	// 4. Insert into files table for the new user (visibility = 'shared')
	_, err = r.db.Exec(`
		INSERT INTO files (user_id, blob_id, filename, visibility, mime_type, size)
		VALUES ($1, $2, $3, 'shared', $4, $5)
	`, userID, blobID, filename, mimeType, size)
	if err != nil {
		return err
	}

	return nil
}

// Get all partial publics for a file
func (r *PartialPublicRepo) GetByFile(fileID string) ([]models.PartialPublic, error) {
	rows, err := r.db.Query("SELECT id, file_id, shared_with_email, created_at FROM file_shares WHERE file_id=$1", fileID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var shares []models.PartialPublic
	for rows.Next() {
		var s models.PartialPublic
		if err := rows.Scan(&s.ID, &s.FileID, &s.SharedWithEmail, &s.CreatedAt); err != nil {
			return nil, err
		}
		shares = append(shares, s)
	}
	return shares, nil
}

// Get all files shared with a user
func (r *PartialPublicRepo) GetByEmail(email string) ([]models.PartialPublic, error) {
	rows, err := r.db.Query("SELECT id, file_id, shared_with_email, created_at FROM file_shares WHERE shared_with_email=$1", email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var shares []models.PartialPublic
	for rows.Next() {
		var s models.PartialPublic
		if err := rows.Scan(&s.ID, &s.FileID, &s.SharedWithEmail, &s.CreatedAt); err != nil {
			return nil, err
		}
		shares = append(shares, s)
	}
	return shares, nil
}

// Delete entry
func (r *PartialPublicRepo) Delete(fileID, email string) error {
	_, err := r.db.Exec("DELETE FROM file_shares WHERE file_id=$1 AND shared_with_email=$2", fileID, email)
	return err
}