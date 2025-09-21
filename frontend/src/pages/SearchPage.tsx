import { useEffect, useState } from "react";
import SearchFilter from "../components/SearchFilter";
import "./styles/SearchPage.css";

function formatFileSize(bytes?: number) {
  if (!bytes || bytes === 0) return "—";
  const kb = bytes / 1024;
  const mb = bytes / (1024 * 1024);
  const gb = bytes / (1024 * 1024 * 1024);

  if (mb < 1) return kb.toFixed(2) + " KB";
  if (mb >= 1000) return gb.toFixed(2) + " GB";
  return mb.toFixed(2) + " MB";
}

export default function SearchPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    console.log("🔍 Files state updated:", files);
  }, [files]);

  return (
    <div className="search-container">
      <div className="search-card">
        <h1 className="search-title">Search Files</h1>

        <SearchFilter onResults={setFiles} setLoading={setLoading} />
        <div className="results-section">
          <h2 className="results-title">Results</h2>

          {loading ? (
            <p className="text-blue-400">Searching...</p>
          ) : files.length === 0 ? (
            <p className="text-gray-400">No files found</p>
          ) : (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f, i) => (
                  <tr key={i}>
                    <td>{f.filename}</td>
                    <td>{f.mime_type}</td>
                    <td>{formatFileSize(f.size)}</td>
                    <td>{new Date(f.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}