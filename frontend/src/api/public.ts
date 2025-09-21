import axios from "axios";

const API_URL = "http://backend:8080";

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

export const shareWithUser = (token: string, fileId: string, email: string) => {
  return axios.post(
    `${API_URL}/partial-public/share`,
    { file_id: fileId, email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const unshareWithUser = (token: string, fileId: string, email: string) => {
  return axios.delete(
    `${API_URL}/partial-public/unshare`,
    {
      headers: { Authorization: `Bearer ${token}` },
      data: { file_id: fileId, email },
    }
  );
};

export const getFileShares = (token: string, fileId: string) => {
  return axios.get(
    `${API_URL}/partial-public/file?id=${fileId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const getFilesForUser = (token: string, email: string) => {
  return axios.get(`${API_URL}/partial-public/user?email=${email}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};