import { useState, useEffect, useRef } from "react";
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
  onViewSharedUsers: (id: string) => Promise<void>; // ✅ new prop
};

export default function FileList({
  files,
  limit,
  onDelete,
  onSetPrivate,
  onSetPublic,
  onShareWithUser,
  onViewSharedUsers, 
}: Props){
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openVisibility, setOpenVisibility] = useState<string | null>(null);

  // Ref for dropdown wrapper
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setOpenVisibility(null);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

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
            <td className="file-name">{file.filename}</td>
            <td>{file.mime_type}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>{new Date(file.created_at).toLocaleString()}</td>
            <td>{file.visibility || "private"}</td>
            <td className="actions">
              <div className="dropdown">
                <button
                  className="menu-btn"
                  onClick={() => setOpenMenu(openMenu === file.id ? null : file.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="menu-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>

                {openMenu === file.id && (
                  <div className="dropdown-menu" ref={menuRef}>
                    <button onClick={() => onDelete(file.id)}>Delete</button>
                    <button onClick={() => setOpenVisibility(openVisibility === file.id ? null : file.id)}>
                      Change Visibility ▸
                    </button>

                    {openVisibility === file.id && (
                      <div className="submenu">
                        <button onClick={() => onSetPrivate(file.id)}>Private</button>
                        <button onClick={() => onSetPublic(file.id)}>Open to All</button>
                        <button
                          onClick={() => {
                            const userEmail = prompt("Enter email to share with:");
                            if (userEmail) {
                              onShareWithUser(file.id, userEmail);
                            }
                          }}
                        >
                          Share with Specific User
                        </button>
                        <button onClick={() => onViewSharedUsers(file.id)}>View Shared Users</button>
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