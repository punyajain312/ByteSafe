// src/components/FileList.tsx
import { useState } from "react";
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
  files: FileItem[];
  limit?: number;
  onDelete: (id: string) => Promise<void>;
  onSetPrivate: (id: string) => Promise<void>;
  onSetPublic: (id: string) => Promise<void>;
  onShareWithUser: (id: string, email: string) => Promise<void>;
};

export default function FileList({ files, limit, onDelete, onSetPrivate, onSetPublic, onShareWithUser }: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openVisibility, setOpenVisibility] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const displayed = typeof limit === "number" ? files.slice(0, limit) : files;

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
          <th>Visibility</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {displayed.map((file) => (
          <tr key={file.id}>
            <td className="file-name">{file.mime_type?.includes("folder") ? "📁" : "📄"} {file.filename}</td>
            <td>{file.mime_type}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>{new Date(file.created_at).toLocaleString()}</td>
            <td>{file.visibility || "private"}</td>
            <td className="actions">
              <div className="dropdown">
                <button className="menu-btn" onClick={() => setOpenMenu(openMenu === file.id ? null : file.id)}>⋮</button>
                {openMenu === file.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => onDelete(file.id)}>🗑 Delete</button>
                    <button onClick={() => setOpenVisibility(openVisibility === file.id ? null : file.id)}>🔒 Change Visibility ▸</button>
                    {openVisibility === file.id && (
                      <div className="submenu">
                        <button onClick={() => onSetPrivate(file.id)}>🔒 Private</button>
                        <button onClick={() => onSetPublic(file.id)}>🌍 Open to All</button>
                        <div className="share-user">
                          <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                          <button onClick={() => { onShareWithUser(file.id, email); setEmail(""); }}>📧 Share</button>
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