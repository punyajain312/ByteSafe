import { useEffect, useState } from "react";
import { listFiles, deleteFile, generatePublicLink } from "../api/files";
import { useAuth } from "../context/AuthContext";
import { shareFilePublic } from "../api/public";
import toast from "react-hot-toast";
import "./styles/FileList.css";

export interface FileItem {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  created_at: string;
  hash: string;
}

type Props = {
  files?: FileItem[];
  onDelete?: (id: string) => Promise<void>;
  onShare?: (id: string) => Promise<void>;
  refreshSignal?: number;
  limit?: number;
};

export default function FileList({
  files: controlledFiles,
  onDelete,
  onShare,
  refreshSignal = 0,
  limit,
}: Props) {
  const { token } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const isControlled = Array.isArray(controlledFiles);

  const loadFiles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await listFiles(token);
      const fetched = res.data.files || [];
      setFiles(fetched);
    } catch (err) {
      console.error("listFiles error:", err);
      toast.error("Could not fetch files"); // ✅ only error if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isControlled) loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshSignal]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      if (onDelete) {
        await onDelete(id);
      } else {
        await deleteFile(id, token);
        await loadFiles();
      }
      toast.success("File deleted");
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Delete failed");
    }
  };

  const handleShare = async (id: string) => {
    try {
      if (!token) return;
      const res = await shareFilePublic(id, token);
      const link = window.location.origin + res.data.link;
      await navigator.clipboard.writeText(link);
      toast.success("Public link copied to clipboard!");
    } catch (err) {
      console.error("Share public error:", err);
      toast.error("Failed to share publicly");
    }
  }

  const usedFiles = isControlled ? controlledFiles! : files;
  const displayed = typeof limit === "number" ? usedFiles.slice(0, limit) : usedFiles;

  if (loading && !isControlled) {
    return <p className="text-gray-500">Loading files...</p>;
  }

  if (displayed.length === 0) {
    return <p className="text-gray-500">No files uploaded yet.</p>;
  }

  return (
    <table className="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Uploaded At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {displayed.map((file) => (
          <tr key={file.id}>
            <td className="file-name">
              {file.mime_type?.includes("folder") ? "📁" : "📄"} {file.filename}
            </td>
            <td>{file.mime_type}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>{new Date(file.created_at).toLocaleString()}</td>
            <td className="actions">
              <button
                onClick={() => handleShare(file.id)} 
                className="btn-share"
              >
                🔗
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                className="btn-delete"
              >
                🗑
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes || bytes === 0) return "—";
  const kb = bytes / 1024;
  const mb = bytes / (1024 * 1024);
  const gb = bytes / (1024 * 1024 * 1024);

  if (mb < 1) return kb.toFixed(2) + " KB";
  if (mb >= 1000) return gb.toFixed(2) + " GB";
  return mb.toFixed(2) + " MB";
}