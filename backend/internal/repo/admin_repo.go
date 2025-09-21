package repo

import (
	"balkanid-capstone/internal/models"
	"database/sql"
)

type AdminRepo interface {
	GetAdminByEmail(email string) (*models.User, error)
}

type adminRepo struct {
	db *sql.DB
}

func NewAdminRepo(db *sql.DB) AdminRepo {
	return &adminRepo{db: db}
}

func (r *adminRepo) GetAdminByEmail(email string) (*models.User, error) {
	var user models.User
	query := `
		SELECT id, name, email, password_hash, role
		FROM users
		WHERE email=$1 AND role='admin'
	`
	err := r.db.QueryRow(query, email).
		Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash, &user.Role)

	if err != nil {
		return nil, err
	}
	return &user, nil
}