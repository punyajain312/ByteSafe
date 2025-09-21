import axios from "axios";

const API_URL = "http://localhost:8080";

// Share publicly
export const shareFilePublic = (fileId: string, token: string) =>
  axios.post(`${API_URL}/share?id=${fileId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Unshare (make private)
export const unshareFile = (fileId: string, token: string) =>
  axios.post(`${API_URL}/unshare?id=${fileId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Share with specific user (email)
export const shareFileWithUser = (fileId: string, email: string, token: string) =>
  axios.post(
    `${API_URL}/share/user`,
    { file_id: fileId, email },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// List all public files
export const listPublicFiles = () => axios.get(`${API_URL}/public/list`);