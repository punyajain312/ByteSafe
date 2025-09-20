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

// DELETE /share?id=<fileId>
export const unshareFile = (fileId: string, token: string) =>
  axios.delete(`${API_URL}/share?id=${fileId}`, {
    headers: { Authorization: `Bearer ${token}` },
});

  // Share with a particular user
export const shareFileWithUser = (fileId: string, email: string, token: string) =>
  axios.post(`${API_URL}/share-with-user`, { file_id: fileId, email }, {
    headers: { Authorization: `Bearer ${token}` },
});