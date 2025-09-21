package main

import (
	"fmt"
	"log"
	"net/http"

	"balkanid-capstone/internal/db"
	"balkanid-capstone/internal/handlers"
	"balkanid-capstone/internal/middleware"
	"balkanid-capstone/internal/repo"
	"balkanid-capstone/internal/services"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

func main() {
	dsn := "postgres://postgres:1234@localhost:5432/balkanid?sslmode=disable"
	database, err := db.Connect(dsn)
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}
	defer database.Close()

	// Auth
	userRepo := repo.NewUserRepo(database)
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	// Files
	fileRepo := repo.NewFileRepo(database)
	fileService := services.NewFileService(fileRepo, database)
	fileHandler := handlers.NewFileHandler(fileService)

	// Search
	searchRepo := repo.NewSearchRepo(database)
	searchService := services.NewSearchService(searchRepo)
	searchHandler := handlers.NewSearchHandler(searchService)

	// Upload
	uploadRepo := repo.NewUploadRepo(database)
	uploadService := services.NewUploadService(uploadRepo)
	uploadHandler := handlers.NewUploadHandler(uploadService)

	// Public Files
	shareRepo := repo.NewShareRepo(database)
	shareService := services.NewShareService(shareRepo)
	shareHandler := handlers.NewShareHandler(shareService)

	// Stats & Admin
	statsHandler := &handlers.StatsHandler{DB: database}
	adminHandler := &handlers.AdminHandler{DB: database}

	mux := http.NewServeMux()

	// Public routes
	mux.HandleFunc("/signup", authHandler.Signup)
	mux.HandleFunc("/login", authHandler.Login)

	// Protected routes
	mux.Handle("/files", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.ListFiles)))
	mux.Handle("/upload", middleware.AuthMiddleware(http.HandlerFunc(uploadHandler.UploadFile)))
	mux.Handle("/delete", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.DeleteFile)))
	mux.Handle("/search", middleware.AuthMiddleware(http.HandlerFunc(searchHandler.SearchFiles)))
	mux.Handle("/stats", middleware.AuthMiddleware(http.HandlerFunc(statsHandler.GetStats)))

	// Share routes
	mux.Handle("/share", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.CreateShare)))
	mux.Handle("/unshare", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.UnshareFile))) // ✅ fixed
	mux.Handle("/share/user", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.ShareWithUser)))

	// Visibility route
	mux.Handle("/files/visibility", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.UpdateVisibility)))

	// Public share routes
	mux.HandleFunc("/public/list", shareHandler.ListShares)
	mux.HandleFunc("/public/file", shareHandler.AccessShare)

	// Admin routes
	mux.Handle("/admin/users", middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminHandler.ListUsers))))
	mux.Handle("/admin/files", middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminHandler.ListAllFiles))))
	mux.Handle("/admin/stats", middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminHandler.SystemStats))))

	// CORS
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}