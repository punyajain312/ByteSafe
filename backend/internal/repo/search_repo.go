package repo

import (
	"database/sql"
	"strconv"

	"balkanid-capstone/internal/models"
)

type SearchRepo struct {
	DB *sql.DB
}

func NewSearchRepo(db *sql.DB) *SearchRepo {
	return &SearchRepo{DB: db}
}

func (r *SearchRepo) SearchFiles(userID, q, mime string, minSize, maxSize int64, dateFrom, dateTo, uploader string) ([]models.File, error) {
    if q == "" && mime == "" && minSize == 0 && maxSize == 0 && dateFrom == "" && dateTo == "" && uploader == "" {
		return []models.File{}, nil
	}
	query := `
		SELECT f.id, f.filename, f.mime_type, f.size, f.created_at, b.hash, b.ref_count, f.visibility
		FROM files f
		JOIN file_blobs b ON f.blob_id = b.id
		JOIN users u ON f.user_id = u.id
		WHERE f.user_id = $1
	`
	args := []interface{}{userID}
	argIndex := 2

	if q != "" {
		query += " AND f.filename ILIKE $" + strconv.Itoa(argIndex)
		args = append(args, "%"+q+"%")
		argIndex++
	}

	if mime != "" {
		query += " AND f.mime_type ILIKE $" + strconv.Itoa(argIndex)
		args = append(args, "%"+mime+"%")
		argIndex++
	}

	if minSize > 0 {
		query += " AND f.size >= $" + strconv.Itoa(argIndex)
		args = append(args, minSize)
		argIndex++
	}

	if maxSize > 0 {
		query += " AND f.size <= $" + strconv.Itoa(argIndex)
		args = append(args, maxSize)
		argIndex++
	}

	if dateFrom != "" {
		query += " AND f.created_at >= $" + strconv.Itoa(argIndex)
		args = append(args, dateFrom)
		argIndex++
	}

	if dateTo != "" {
		query += " AND f.created_at <= $" + strconv.Itoa(argIndex)
		args = append(args, dateTo)
		argIndex++
	}

	if uploader != "" {
		query += " AND u.name ILIKE $" + strconv.Itoa(argIndex)
		args = append(args, "%"+uploader+"%")
		argIndex++
	}

	query += " ORDER BY f.created_at DESC"

	rows, err := r.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var files []models.File
	for rows.Next() {
		var f models.File
		if err := rows.Scan(&f.ID, &f.Filename, &f.MimeType, &f.Size, &f.CreatedAt, &f.Hash, &f.RefCount, &f.Visibility); err != nil {
			return nil, err
		}
		files = append(files, f)
	}
	return files, nil
}