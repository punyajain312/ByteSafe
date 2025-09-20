import { useEffect, useState, useRef } from "react";
import { listFiles, deleteFile } from "../api/files";
import { useAuth } from "../context/AuthContext";
import { shareFilePublic, unshareFile, shareFileWithUser } from "../api/public";
import toast from "react-hot-toast";
import "./styles/FileList.css";

export interface FileItem {
  id: string;
  filename: string;
  mime_type: string;
  size: number;
  created_at: string;
  hash: string;
  visibility?: "private" | "public" | "shared";
}

type Props = {
  files?: FileItem[];
  refreshSignal?: number;
  limit?: number;
};

export default function FileList({
  files: controlledFiles,
  refreshSignal = 0,
  limit,
}: Props) {
  const { token } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openVisibility, setOpenVisibility] = useState<string | null>(null);
  const [email, setEmail] = useState("");

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
      toast.error("Could not fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isControlled) loadFiles();
  }, [token, refreshSignal]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteFile(id, token);
      toast.success("File deleted");
      await loadFiles();
    } catch (err) {
      console.error("delete error:", err);
      toast.error("Delete failed");
    }
  };

  const handleSetPrivate = async (id: string) => {
    if (!token) return;
    try {
      await unshareFile(id, token);
      toast.success("File set to private");
      await loadFiles();
    } catch (err) {
      console.error("unshare error:", err);
      toast.error("Failed to make private");
    }
  };

  const handleSetPublic = async (id: string) => {
    if (!token) return;
    try {
      const res = await shareFilePublic(id, token);
      const link = res.data.link;
      await navigator.clipboard.writeText(link);
      toast.success("File shared publicly. Link copied!");
      await loadFiles();
    } catch (err) {
      console.error("share error:", err);
      toast.error("Failed to make public");
    }
  };

  const handleShareWithUser = async (id: string) => {
    if (!token || !email) return toast.error("Enter an email");
    try {
      await shareFileWithUser(id, email, token);
      toast.success(`Shared with ${email}`);
      setEmail("");
      await loadFiles();
    } catch (err) {
      console.error("share with user error:", err);
      toast.error("Failed to share with user");
    }
  };

  const usedFiles = isControlled ? controlledFiles! : files;
  const displayed =
    typeof limit === "number" ? usedFiles.slice(0, limit) : usedFiles;

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
          <th></th>
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
              <div className="dropdown">
                <button
                  className="menu-btn"
                  onClick={() =>
                    setOpenMenu(openMenu === file.id ? null : file.id)
                  }
                >
                  ⋮
                </button>
                {openMenu === file.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleDelete(file.id)}>
                      🗑 Delete
                    </button>
                    <button
                      onClick={() =>
                        setOpenVisibility(
                          openVisibility === file.id ? null : file.id
                        )
                      }
                    >
                      🔒 Change Visibility ▸
                    </button>
                    {openVisibility === file.id && (
                      <div className="submenu">
                        <button onClick={() => handleSetPrivate(file.id)}>
                          🔒 Private
                        </button>
                        <button onClick={() => handleSetPublic(file.id)}>
                          🌍 Open to All
                        </button>
                        <div className="share-user">
                          <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <button onClick={() => handleShareWithUser(file.id)}>
                            📧 Share
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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