package repo

import (
	"database/sql"
)

type SuggestionRepo struct {
	DB *sql.DB
}

func NewSuggestionRepo(db *sql.DB) *SuggestionRepo {
	return &SuggestionRepo{DB: db}
}

func (r *SuggestionRepo) SuggestFilenames(userID, query string) ([]string, error) {
	rows, err := r.DB.Query(`
		SELECT DISTINCT filename
		FROM files
		WHERE user_id = $1
		  AND filename ILIKE $2
		ORDER BY filename
		LIMIT 8
	`, userID, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		results = append(results, name)
	}
	return results, nil
}

func (r *SuggestionRepo) SuggestUploaders(userID, query string) ([]string, error) {
	rows, err := r.DB.Query(`
		SELECT DISTINCT u.name
		FROM files f
		JOIN users u ON f.user_id = u.id
		WHERE f.user_id = $1
		  AND u.name ILIKE $2
		ORDER BY u.name
		LIMIT 8
	`, userID, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		results = append(results, name)
	}
	return results, nil
}