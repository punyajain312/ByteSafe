import axios from "axios";
const API_URL = "http://localhost:8080";

// ✅ Share a file publicly
export const shareFilePublic = (fileId: string, token: string) =>
  axios.post(`${API_URL}/share?id=${fileId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ List all public files
export const listPublicFiles = () =>
  axios.get(`${API_URL}/public/list`);

// ✅ Download/access public file by share ID
export const downloadPublicFile = (shareId: string) =>
  window.open(`${API_URL}/public/file?id=${shareId}`, "_blank"); // ✅ use id not token