import React from "react";
import "./styles/PublicFileList.css"; 

export interface PublicFile {
  id: string;           
  file_id: string;
  owner_id: string;
  filename: string;
  owner_name: string;
  mime_type: string;
  size: number;
  download_count: number;
  created_at: string;
}

type Props = {
  files: PublicFile[];
  onDownload: (id: string) => void;
};

function formatFileSize(bytes: number) {
  if (!bytes) return "0 B";
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  if (mb < 1) return kb.toFixed(2) + " KB";
  if (mb >= 1000) return gb.toFixed(2) + " GB";
  return mb.toFixed(2) + " MB";
}

export default function PublicFileList({ files, onDownload }: Props) {
  if (files.length === 0) {
    return <p className="text-gray-500">No public files available.</p>;
  }

  return (
    <table className="file-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th>Uploaded At</th>
          <th>Owner</th>
          <th>Downloads</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td className="file-name">{file.filename}</td>
            <td>{file.mime_type}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>{new Date(file.created_at).toLocaleString()}</td>
            <td>{file.owner_name || "—"}</td>
            <td className="text-center">{file.download_count}</td>
            <td>
              <div className="actions">
                <button
                  onClick={() => onDownload(file.id)}
                  className="btn-share"
                >
                  Open / Download
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}