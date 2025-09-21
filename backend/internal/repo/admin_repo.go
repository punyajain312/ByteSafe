package repo

import (
	"balkanid-capstone/internal/models"
	"database/sql"
)

type AdminDashRepo interface {
	ListUsers() ([]models.AdminUser, error)
	ListAllFiles() ([]models.AdminFile, error)
	SystemStats() (models.AdminStats, error)
}

type adminDashRepo struct {
	db *sql.DB
}

func NewAdminDashRepo(db *sql.DB) AdminDashRepo {
	return &adminDashRepo{db: db}
}

func (r *adminDashRepo) ListUsers() ([]models.AdminUser, error) {
	query := `SELECT id, name, email, password_hash, role FROM users ORDER BY name ASC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.AdminUser
	for rows.Next() {
		var u models.AdminUser
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.PasswordHash, &u.Role); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (r *adminDashRepo) ListAllFiles() ([]models.AdminFile, error) {
	query := `
		SELECT 
			f.id,
			f.filename,
			u.email AS uploader_email,
			f.size,
			f.mime_type,
			f.created_at,
			COALESCE(p.download_count, 0) AS download_count
		FROM files f
		JOIN users u ON f.user_id = u.id
		LEFT JOIN public_files p ON p.file_id = f.id
		ORDER BY f.created_at DESC;
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []models.AdminFile
	for rows.Next() {
		var f models.AdminFile
		if err := rows.Scan(&f.ID, &f.Filename, &f.UploaderEmail, &f.Size, &f.MimeType, &f.CreatedAt, &f.DownloadCount); err != nil {
			return nil, err
		}
		files = append(files, f)
	}
	return files, nil
}

func (r *adminDashRepo) SystemStats() (models.AdminStats, error) {
	var stats models.AdminStats
	query := `
		SELECT 
			COUNT(*) AS total_files,
			COALESCE(SUM(p.download_count), 0) AS total_downloads
		FROM files f
		LEFT JOIN public_files p ON p.file_id = f.id;
	`
	err := r.db.QueryRow(query).Scan(&stats.TotalFiles, &stats.TotalDownloads)
	if err != nil {
		return stats, err
	}
	return stats, nil
}