// src/components/PublicFileList.tsx
import React from "react";

export interface PublicFile {
  id: string;           // share id (public_files.id)
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
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left border">Name</th>
          <th className="p-2 text-left border">Type</th>
          <th className="p-2 text-left border">Size</th>
          <th className="p-2 text-left border">Uploaded At</th>
          <th className="p-2 text-left border">Owner</th>
          <th className="p-2 text-left border">Downloads</th>
          <th className="p-2 text-left border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td className="p-2 border font-medium">{file.filename}</td>
            <td className="p-2 border">{file.mime_type}</td>
            <td className="p-2 border">{formatFileSize(file.size)}</td>
            <td className="p-2 border">
              {new Date(file.created_at).toLocaleString()}
            </td>
            <td className="p-2 border">{file.owner_name || "—"}</td>
            <td className="p-2 border text-center">{file.download_count}</td>
            <td className="p-2 border text-center">
              <button
                onClick={() => onDownload(file.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Open / Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}