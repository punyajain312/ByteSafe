import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

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
    (`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    });
};