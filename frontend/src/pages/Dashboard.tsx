// src/pages/Dashboard.tsx
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import FileUploadForm from "../components/FileUploadForm";
import FileList, { type FileItem } from "../components/FileList";
import SearchFilter from "../components/SearchFilter";
import { useState, useEffect } from "react";
import { listFiles, deleteFile, generatePublicLink } from "../api/files";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./styles/Dashboard.css";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const loadFiles = async () => {
    if (!token) return;
    try {
      const res = await listFiles(token);
      setFiles(res.data.files || res.data);
    } catch (err) {
      toast.error("Failed to load files");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [token, refresh]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteFile(id, token);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast.success("File deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleShare = async (id: string) => {
    if (!token) return;
    try {
      const res = await generatePublicLink(id, token);
      const link = res.data.link;
      navigator.clipboard.writeText(link);
      toast.success("Public link copied!");
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  const onUploadSuccess = () => {
    setRefresh((r) => r + 1);
    navigate("/dashboard");
  };

  // === Storage quota logic ===
  const totalFiles = files.length;
  const totalBytes = files.reduce((acc, f) => acc + (Number((f as any).size) || 0), 0);
  const TOTAL_QUOTA_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB quota
  const usedPercent = Math.min(100, Math.round((totalBytes / TOTAL_QUOTA_BYTES) * 100));

  function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (e) {
      console.error(e);
    }
    navigate("/login");
  };

  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">MyApp</div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Storage</h4>
          <div className="storage-meta">
            <strong>{formatBytes(totalBytes)}</strong>
            <span className="muted"> / 15 GB</span>
          </div>
          <div className="storage-bar">
            <div className="storage-used" style={{ width: `${usedPercent}%` }} />
          </div>
          <div className="storage-percent">{usedPercent}% used</div>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Quick Stats</h4>
          <ul className="stats-list">
            <li><strong>{totalFiles}</strong> Files</li>
            <li><strong>{files.filter(f => (f as any).is_public).length}</strong> Public</li>
            <li><strong>{files.filter(f => (f as any).shared).length}</strong> Shared</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Recent</h4>
          <ul className="recent-list">
            {files.slice(0, 6).map((f) => (
              <li key={f.id} title={(f as any).filename}>
                <span className="recent-name">{(f as any).filename || (f as any).name}</span>
                <span className="recent-meta">{formatBytes(Number((f as any).size) || 0)}</span>
              </li>
            ))}
            {files.length === 0 && <li className="muted">No recent files</li>}
          </ul>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="dashboard-main">
        {/* TOP NAVBAR */}
        <header className="dashboard-topnav">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>
            Home
          </NavLink>
          <NavLink to="/dashboard/upload" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>
            Upload
          </NavLink>
          <NavLink to="/dashboard/search" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>
            Search
          </NavLink>
          <NavLink to="/dashboard/list" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>
            My Files
          </NavLink>
          <NavLink to="/dashboard/public" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>
            Public Files
          </NavLink>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </header>

        {/* CONTENT CARD */}
        <main className="dashboard-content">
          <div className="content-card">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h2 className="section-title">Recent Files</h2>
                    <FileList files={files} limit={10} onDelete={handleDelete} onShare={handleShare} />
                  </div>
                }
              />

              <Route
                path="upload"
                element={
                  <div>
                    <h2 className="section-title">Upload Files</h2>
                    <FileUploadForm
                      onUploadSuccess={onUploadSuccess}
                      disabled={totalBytes >= TOTAL_QUOTA_BYTES} // ✅ quota check
                    />
                    {totalBytes >= TOTAL_QUOTA_BYTES && (
                      <p className="text-red-500 mt-2">
                        You have reached the 15 GB storage limit. Please delete files to free up space.
                      </p>
                    )}
                  </div>
                }
              />

              <Route
                path="search"
                element={
                  <div>
                    <h2 className="section-title">Search Files</h2>
                    <SearchFilter onResults={setSearchResults} />
                    {searchResults.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-bold">Search Results</h3>
                        <ul className="search-results">
                          {searchResults.map((f, i) => (
                            <li key={i} className="search-item">
                              {f.filename} ({f.mime_type}) - {f.size} bytes
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                }
              />

              <Route
                path="list"
                element={
                  <div>
                    <h2 className="section-title">My Files</h2>
                    <FileList files={files} onDelete={handleDelete} onShare={handleShare} />
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}