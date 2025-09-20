import FileUploadForm from "../components/FileUploadForm";
import "./styles/UploadPage.css";

export default function UploadPage() {
  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1 className="upload-title">Upload Files</h1>
        <FileUploadForm onUploadSuccess={() => {}} />
        <h2 className="recent-title">My Files</h2>
      </div>
    </div>
  );
}