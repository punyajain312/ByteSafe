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
  onViewSharedUsers: (id: string) => Promise<void>;
  onBulkAction?: (
    ids: string[],
    action: "delete" | "public" | "private"
  ) => Promise<void>;
};

export default function FileList({
  files,
  limit,
  onDelete,
  onSetPrivate,
  onSetPublic,
  onShareWithUser,
  onViewSharedUsers,
  onBulkAction,
}: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openVisibility, setOpenVisibility] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const displayed = typeof limit === "number" ? files.slice(0, limit) : files;

  /* -------------------- Outside click -------------------- */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setOpenVisibility(null);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  /* -------------------- Selection helpers -------------------- */
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    displayed.length > 0 && displayed.every((f) => selectedIds.includes(f.id));

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : displayed.map((f) => f.id));
  };

  /* -------------------- Bulk or single target -------------------- */
  const getTargetIds = (clickedId: string) => {
    return selectedIds.includes(clickedId) ? selectedIds : [clickedId];
  };

  if (displayed.length === 0) {
    return <p className="text-gray-500">No files uploaded yet.</p>;
  }

  return (
    <table className="file-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
            />
          </th>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Uploaded At</th>
          <th>Visibility</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {displayed.map((file) => {
          const isSelected = selectedIds.includes(file.id);

          return (
            <tr
              key={file.id}
              className={isSelected ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(file.id)}
                />
              </td>

              <td className="file-name">{file.filename}</td>
              <td>{file.mime_type}</td>
              <td>{formatFileSize(file.size)}</td>
              <td>{new Date(file.created_at).toLocaleString()}</td>
              <td>{file.visibility || "private"}</td>

              <td className="actions">
                <div className="dropdown">
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenu(openMenu === file.id ? null : file.id)
                    }
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
                      {isSelected && selectedIds.length > 1 && (
                        <div className="menu-hint">
                          Applying to {selectedIds.length} selected files
                        </div>
                      )}

                      <button
                        onClick={() =>
                          setOpenVisibility(
                            openVisibility === file.id ? null : file.id
                          )
                        }
                      >
                        Change Visibility ▸
                      </button>

                      {openVisibility === file.id && (
                        <div className="submenu">
                          <button
                            onClick={async () => {
                              const ids = getTargetIds(file.id);
                              if (ids.length === 1) {
                                await onSetPrivate(ids[0]);
                              } else if (onBulkAction) {
                                await onBulkAction(ids, "private");
                              }
                              setSelectedIds([]);
                              setOpenMenu(null);
                            }}
                          >
                            Private
                          </button>

                          <button
                            onClick={async () => {
                              const ids = getTargetIds(file.id);
                              if (ids.length === 1) {
                                await onSetPublic(ids[0]);
                              } else if (onBulkAction) {
                                await onBulkAction(ids, "public");
                              }
                              setSelectedIds([]);
                              setOpenMenu(null);
                            }}
                          >
                            Open to All
                          </button>

                          <button
                            onClick={async () => {
                              const email = prompt("Enter email to share with:");
                              if (!email) return;

                              const ids = getTargetIds(file.id);
                              for (const id of ids) {
                                await onShareWithUser(id, email);
                              }

                              setSelectedIds([]);
                              setOpenMenu(null);
                            }}
                          >
                            Share with Specific User
                          </button>

                          <button
                            onClick={() => onViewSharedUsers(file.id)}
                          >
                            View Shared Users
                          </button>
                        </div>
                      )}

                      <button
                        className="danger"
                        onClick={async () => {
                          const ids = getTargetIds(file.id);

                          if (ids.length === 1) {
                            await onDelete(ids[0]);
                          } else if (onBulkAction) {
                            await onBulkAction(ids, "delete");
                          }

                          setSelectedIds([]);
                          setOpenMenu(null);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
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