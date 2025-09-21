// src/pages/Dashboard.tsx
import { Routes, Route, useNavigate, NavLink } from "react-router-dom";
import FileUploadForm from "../components/FileUploadForm";
import FileList, { type FileItem } from "../components/FileList";
import PublicFilesPage from "./Public_Files";
import SearchPage from "./SearchPage"; 
import { useState, useEffect } from "react";
import { listFiles, deleteFile } from "../api/files";
import { shareFilePublic, unshareFile, shareFileWithUser } from "../api/public";
import { listPublicFiles } from "../api/public"; 
import { shareWithUser, getFileShares } from "../api/public";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./styles/Dashboard.css";

export default function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [publicFiles, setPublicFiles] = useState<any[]>([]); 
  const [refresh, setRefresh] = useState(0);

  // === Load user files ===
  const loadFiles = async () => {
    if (!token) return;
    try {
      const res = await listFiles(token);
      setFiles(res.data.files || res.data);
    } catch (err) {
      toast.error("Failed to load files");
    }
  };

  // === Load public files ===
  const loadPublicFiles = async () => {
    try {
      const res = await listPublicFiles();
      setPublicFiles(res.data.files || res.data);
    } catch (err) {
      toast.error("Failed to load public files");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [token, refresh]);

  useEffect(() => {
    loadPublicFiles();
  }, [refresh]);

  // === Actions ===
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

  const handleSetPrivate = async (id: string) => {
    if (!token) return;
    try {
      await unshareFile(id, token);
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, visibility: "private" } : f))
      );
      toast.success("File set to private");
      loadPublicFiles(); 
    } catch {
      toast.error("Failed to make private");
    }
  };

  const handleViewSharedUsers = async (id: string) => {
  if (!token) return;
  try {
    const res = await getFileShares(token, id);
    const users = res.data.map((u: any) => u.shared_with_email);

    if (users.length === 0) {
      toast("No users shared for this file");
    } else {
      // simple alert for now
      alert("Shared with:\n" + users.join("\n"));
    }
  } catch (err) {
    toast.error("Failed to load shared users");
  }
};


  const handleSetPublic = async (id: string) => {
    if (!token) return;
    try {
      const res = await shareFilePublic(id, token); 
      const link = res.data.link;

      await navigator.clipboard.writeText(link);

      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, visibility: "public" } : f))
      );

      toast.success("File shared publicly. Link copied!");
      loadPublicFiles(); 
    } catch (err) {
      toast.error("Failed to make public");
    }
  };

  // const handleShareWithUser = async (id: string, email: string) => {
  //   if (!token) return;
  //   try {
  //     await shareFileWithUser(id, email, token);
  //     setFiles((prev) =>
  //       prev.map((f) => (f.id === id ? { ...f, visibility: "shared" } : f))
  //     );
  //     toast.success(`Shared with ${email}`);
  //   } catch {
  //     toast.error("Failed to share with user");
  //   }
  // };

  const handleShareWithUser = async (id: string, email: string) => {
  if (!token) return;
  try {
    await shareWithUser(token, id, email);
    toast.success(`File shared with ${email}`);
  } catch (err) {
    toast.error("Failed to share with user");
  }
};

  const onUploadSuccess = () => {
    setRefresh((r) => r + 1);
    navigate("/dashboard");
  };

  // === Storage quota logic ===
  const totalFiles = files.length;
  const totalBytes = files.reduce((acc, f) => acc + (Number((f as any).size) || 0), 0);
  const TOTAL_QUOTA_BYTES = 15 * 1024 * 1024 * 1024;
  const usedPercent = Math.min(100, Math.round((totalBytes / TOTAL_QUOTA_BYTES) * 100));

  function formatBytes(bytes: number) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-root">
      {/* SIDEBAR */}
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
            <li><strong>{totalFiles}</strong> My Files</li>
            <li><strong>{publicFiles.length}</strong> Public</li>
            <li><strong>{files.filter(f => f.visibility === "shared").length}</strong> Shared</li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading">Recent</h4>
          <ul className="recent-list">
            {files.slice(0, 6).map((f) => (
              <li key={f.id} title={f.filename}>
                <span className="recent-name">{f.filename}</span>
                <span className="recent-meta">{formatBytes(Number(f.size) || 0)}</span>
              </li>
            ))}
            {files.length === 0 && <li className="muted">No recent files</li>}
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <div className="dashboard-main">
        <header className="dashboard-topnav">
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>Home</NavLink>
          <NavLink to="/dashboard/upload" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>Upload</NavLink>
          <NavLink to="/dashboard/search" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>Search</NavLink>
          <NavLink to="/dashboard/list" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>My Files</NavLink>
          <NavLink to="/dashboard/public" className={({ isActive }) => isActive ? "btn btn-primary" : "btn"}>Public Files</NavLink>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </header>

        <main className="dashboard-content">
          <div className="content-card">
            <Routes>
              <Route path="/" element={<FileList files={files} limit={10} onDelete={handleDelete} onSetPrivate={handleSetPrivate} onSetPublic={handleSetPublic} onShareWithUser={handleShareWithUser} onViewSharedUsers={handleViewSharedUsers}/>} />
              <Route path="upload" element={<FileUploadForm onUploadSuccess={onUploadSuccess} disabled={totalBytes >= TOTAL_QUOTA_BYTES} />} />
              <Route path="search" element={<SearchPage />} />
              <Route
                path="list"
                element={
                  <FileList
                    files={files}
                    onDelete={handleDelete}
                    onSetPrivate={handleSetPrivate}
                    onSetPublic={handleSetPublic}
                    onShareWithUser={handleShareWithUser}
                    onViewSharedUsers={handleViewSharedUsers}
                  />
                }
              />
              <Route path="public" element={<PublicFilesPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}