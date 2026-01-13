package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"balkanid-capstone/internal/db"
	"balkanid-capstone/internal/handlers"
	"balkanid-capstone/internal/middleware"
	"balkanid-capstone/internal/repo"
	"balkanid-capstone/internal/services"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

func RunServer() {
	// Load DB
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// ===== Services & Handlers =====

	// Auth
	userRepo := repo.NewUserRepo(database)
	authService := services.NewAuthService(userRepo)
	authHandler := handlers.NewAuthHandler(authService)

	// Files
	fileRepo := repo.NewFileRepo(database)
	fileService := services.NewFileService(fileRepo, database)
	fileHandler := handlers.NewFileHandler(fileService)

	// Search & Suggest
	searchRepo := repo.NewSearchRepo(database)
	searchService := services.NewSearchService(searchRepo)
	searchHandler := handlers.NewSearchHandler(searchService)

	suggestRepo := repo.NewSuggestionRepo(database)
	suggestService := services.NewSuggestionService(suggestRepo)
	suggestHandler := handlers.NewSuggestionHandler(suggestService)

	// Upload
	uploadRepo := repo.NewUploadRepo(database)
	uploadService := services.NewUploadService(uploadRepo)
	uploadHandler := handlers.NewUploadHandler(uploadService)

	// Share
	shareRepo := repo.NewShareRepo(database)
	shareService := services.NewShareService(shareRepo)
	shareHandler := handlers.NewShareHandler(shareService)

	// Admin
	adminRepo := repo.NewAdminRepo(database)
	adminService := services.NewAdminService(adminRepo)
	adminAuthHandler := handlers.NewAdminAuthHandler(adminService)

	adminDashRepo := repo.NewAdminDashRepo(database)
	adminDashService := services.NewAdminDashService(adminDashRepo)
	adminDashHandler := handlers.NewAdminDashHandler(adminDashService)

	// Partial Public
	partialPublicRepo := repo.NewPartialPublicRepo(database)
	partialPublicService := services.NewPartialPublicService(partialPublicRepo)
	partialPublicHandler := handlers.NewPartialPublicHandler(partialPublicService)

	// ===== Router =====
	mux := http.NewServeMux()

	// ✅ GLOBAL OPTIONS HANDLER (CRITICAL)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	// ===== Public Routes =====
	mux.HandleFunc("/signup", authHandler.Signup)
	mux.HandleFunc("/login", authHandler.Login)
	mux.HandleFunc("/admin/login", adminAuthHandler.Login)

	mux.HandleFunc("/public/list", shareHandler.ListShares)
	mux.HandleFunc("/public/file", shareHandler.AccessShare)

	// ===== Protected Routes =====
	mux.Handle("/files", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.ListFiles)))
	mux.Handle("/files/bulk", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.BulkAction)))
	mux.Handle("/files/visibility", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.UpdateVisibility)))
	mux.Handle("/upload", middleware.AuthMiddleware(http.HandlerFunc(uploadHandler.UploadFile)))
	mux.Handle("/delete", middleware.AuthMiddleware(http.HandlerFunc(fileHandler.DeleteFile)))
	mux.Handle("/search", middleware.AuthMiddleware(http.HandlerFunc(searchHandler.SearchFiles)))

	mux.Handle("/suggest/files",
		middleware.AuthMiddleware(http.HandlerFunc(suggestHandler.SuggestFilenames)),
	)
	mux.Handle("/suggest/uploaders",
		middleware.AuthMiddleware(http.HandlerFunc(suggestHandler.SuggestUploaders)),
	)

	// Share
	mux.Handle("/share", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.CreateShare)))
	mux.Handle("/unshare", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.UnshareFile)))
	mux.Handle("/share/user", middleware.AuthMiddleware(http.HandlerFunc(shareHandler.ShareWithUser)))

	// Admin dashboard
	mux.Handle("/admin/users",
		middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminDashHandler.ListUsers))),
	)
	mux.Handle("/admin/files",
		middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminDashHandler.ListAllFiles))),
	)
	mux.Handle("/admin/stats",
		middleware.AuthMiddleware(middleware.AdminOnly(http.HandlerFunc(adminDashHandler.SystemStats))),
	)

	// Partial Public
	mux.Handle("/partial-public/share",
		middleware.AuthMiddleware(http.HandlerFunc(partialPublicHandler.ShareFile)),
	)
	mux.Handle("/partial-public/unshare",
		middleware.AuthMiddleware(http.HandlerFunc(partialPublicHandler.UnshareFile)),
	)
	mux.Handle("/partial-public/file",
		middleware.AuthMiddleware(http.HandlerFunc(partialPublicHandler.GetFileShares)),
	)
	mux.Handle("/partial-public/user",
		middleware.AuthMiddleware(http.HandlerFunc(partialPublicHandler.GetFilesForUser)),
	)

	// ===== CORS (FINAL & CORRECT) =====
	handler := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",
			"https://bytesafe.vercel.app",
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowedHeaders: []string{
			"Authorization", "Content-Type",
		},
		AllowCredentials: true,
	}).Handler(mux)

	// ===== Start Server =====
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env not found, using system env")
	}
	RunServer()
}