import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import "../styles/Dashboard.css";
import UsersPage from "./AdminUserPage";
import FilesPage from "./AdminFilesPage";
import StatsPage from "./AdminStatsPage";
import SearchPage from "../SearchPage";
import UploadPage from "../UploadPage";
import PublicPage from "../Public_Files";


interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminFile {
  id: string;
  filename: string;
  uploader_email: string;
  size: number;
  mime_type: string;
  created_at: string;
  download_count: number;
}

interface AdminStats {
  total_files: number;
  total_downloads: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const fetchData = async () => {
    if (!token) return;
    try {
      const [usersRes, filesRes, statsRes] = await Promise.all([
        axios.get("http://localhost:8080/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/admin/files", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8080/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUsers(usersRes.data);
      setFiles(filesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Admin data load failed", err);
      toast.error("Failed to load admin data ❌");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">Admin Panel</div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">System Stats</h4>
          {stats ? (
            <ul className="stats-list">
              <li><strong>{users.length}</strong> Users</li>
              <li><strong>{stats.total_files}</strong> Files</li>
              <li><strong>{stats.total_downloads}</strong> Downloads</li>
            </ul>
          ) : (
            <p className="muted">Loading stats...</p>
          )}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Recent Files</h4>
          <ul className="recent-list">
            {files.slice(0, 6).map((f) => (
              <li key={f.id}>
                <span className="recent-name">{f.filename}</span>
                <span className="recent-meta">{formatBytes(f.size)}</span>
              </li>
            ))}
            {files.length === 0 && <li className="muted">No files yet</li>}
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <div className="dashboard-main">
        <header className="dashboard-topnav">
          <NavLink
            to="/admin-dashboard/users"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin-dashboard/files"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Files
          </NavLink>
          <NavLink
            to="/admin-dashboard/stats"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Stats
          </NavLink>
          <NavLink
            to="/admin-dashboard/search"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Search
          </NavLink>
          <NavLink
            to="/admin-dashboard/upload"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Upload
          </NavLink>
          <NavLink
            to="/admin-dashboard/public"
            className={({ isActive }) => (isActive ? "btn btn-primary" : "btn")}
          >
            Public
          </NavLink>
          <button className="btn logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="dashboard-content">
          <div className="content-card">
            <Routes>
              <Route path="users" element={<UsersPage />} />
              <Route path="files" element={<FilesPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="public" element={<PublicPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}