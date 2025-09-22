import axios from "axios";

const API_URL = "http://localhost:8080";

export const getUsers = (token: string) => {
  return axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    });
};

export const getFiles = (token: string) => {
  return axios.get(`${API_URL}/admin/files`, {
    headers: { Authorization: `Bearer ${token}` },
    });
};

export const getStats = (token: string) => {
  return axios.get
    ("/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
    });
};