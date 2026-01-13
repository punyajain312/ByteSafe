# 📁 ByteSafe

> A secure, modern file storage and sharing platform with fine-grained access control.

ByteSafe is a full-stack web application that allows users to upload, manage, and share files securely.  
It supports private, public, and shared visibility modes with a scalable backend architecture and a clean, modern UI.

---

## Features

- Secure authentication & authorization
- File upload and management
- File sharing with controlled visibility
- Private, Public, and Shared file access
- Admin dashboard
- Modern and responsive UI
- RESTful backend APIs

---

## Tech Stack

### Frontend
- React
- CSS (custom animations & transitions)
- React Router

### Backend
- Go (Golang)
- REST APIs
- Middleware-based authentication

### Database
- PostgreSQL

### Deployment
- Frontend: Vercel
- Backend: Render
- File Storage: Cloud provider (planned)

---

## Screenshots
> _Coming soon_

---

## Project Status

This project is **under active development**.  
Core features are implemented, with several enhancements planned to improve usability, performance, and scalability.

---

## 🧭 Roadmap / TODO

### Authentication & Security
- [ ] Improve **Login & Signup UI/UX** with smooth transitions
- [ ] Add **OAuth authentication** (Google / GitHub)
- [x] Improve session & token handling

---

### File Management
- [ ] Prevent **duplicate file uploads** using file hash comparison
- [ ] Add **Download option** in “My Files”
- [x] Implement **file filtering** (type, size, date, visibility)
- [ ] Upload files to a **cloud storage provider**

---

### File Sharing & Visibility
- [ ] Fix **Shared → Private** visibility transition
- [ ] Treat **Shared** as a first-class visibility state
- [x] Add **share with specific users** functionality
- [ ] Create **“Shared With You”** section
- [ ] Display users with whom a file is shared

---

### Admin Dashboard
- [ ] Enhance Admin panel UI
- [ ] View and manage users
- [ ] Moderate public & shared files
- [ ] View basic analytics (storage usage, file count)

---

### UI / UX Enhancements
- [ ] Redesign Login & Signup hero layout
- [ ] Improve animations and transitions
- [ ] Enhance file list UI
- [x] Create professional **Footer pages**:
  - Privacy Policy
  - Terms & Conditions
  - About
  - Contact

---

### Documentation & Quality
- [ ] API documentation
- [ ] Improved error handling
- [ ] Unit tests for critical services
- [ ] Environment-based configuration
- [ ] Production-ready logging

---

### Optional Add-ons 
- Docker setup section
- Production deployment guide
- `.env.example` file content

## Installation & Setup

### Prerequisites
- Node.js
- Go
- PostgreSQL

---

### Clone the Repository

```bash
git clone https://github.com/your-username/filevault.git
cd filevault
