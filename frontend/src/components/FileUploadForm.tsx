import { useState, useRef, type DragEvent } from "react";
import { uploadFiles } from "../api/files";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../pages/styles/UploadPage.css";

export default function FileUploadForm({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
  disabled?: boolean;
}) {
  const { token } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedFiles(Array.from(e.dataTransfer.files));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!token || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      await uploadFiles(selectedFiles, token);
      toast.success("Upload successful ✅");
      setSelectedFiles([]);
      onUploadSuccess();
    } catch (err: any) {
      console.error("Upload error:", err.response || err.message);
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  // trigger input click when dropzone is clicked
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-form">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleDropzoneClick}
        className="dropzone"
        style={{ cursor: "pointer" }}
      >
        Drag & Drop files here 
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="file-input-hidden"
      />

      {/* Buttons */}
      <div className="buttons">
        <label htmlFor="file-upload" className="file-upload-btn">
          Select Files
        </label>
        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className={`upload-btn ${uploading || selectedFiles.length === 0 ? "disabled" : ""}`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="buttons">
          <ul className="file-list">
            {selectedFiles.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}