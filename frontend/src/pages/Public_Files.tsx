// src/pages/PublicFilesPage.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { listPublicFiles } from "../api/public";
import toast from "react-hot-toast";
import PublicFileList, {type PublicFile } from "../components/PublicFileList";

const API_URL = "http://localhost:8080";

export default function PublicFilesPage() {
  const [files, setFiles] = useState<PublicFile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listPublicFiles();
      setFiles(res.data.files || []);
    } catch (err) {
      toast.error("Failed to load public files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDownloadClick = async (shareId: string) => {
    try {
      // Increment download count
      await axios.get(`${API_URL}/public/file?id=${shareId}`);
      await load(); // refresh after download
      // Open in new tab
      window.open(`${API_URL}/public/file?id=${shareId}`, "_blank");
    } catch (err) {
      console.error("error opening public file", err);
      toast.error("Failed to access public file");
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading public files...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">🌍 Publicly Shared Files</h1>
        <PublicFileList files={files} onDownload={handleDownloadClick} />
      </div>
    </div>
  );
}