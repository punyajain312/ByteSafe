import { useEffect, useState } from "react";
import { fetchAdminFiles } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface AdminFile {
  id: string;
  filename: string;
  uploader_email: string;
  size: number;
  mime_type: string;
  created_at: string;
  download_count: number;
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FilesPage() {
  const { token } = useAuth();
  const [files, setFiles] = useState<AdminFile[]>([]);

  useEffect(() => {
    if (!token) return;
    fetchAdminFiles(token)
      .then((res) => setFiles(res.data))
      .catch(() => toast.error("Failed to load files"));
  }, [token]);

  return (
    <div>
      <h2>All Files</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Filename</th><th>Uploader</th><th>Size</th><th>Downloads</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.filename}</td>
              <td>{f.uploader_email}</td>
              <td>{formatBytes(f.size)}</td>
              <td>{f.download_count}</td>
              <td>{new Date(f.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}