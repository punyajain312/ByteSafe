import axios from "axios";

const API_URL = "http://localhost:8080";

export const signup = (name: string, email: string, password: string) =>
  axios.post(`${API_URL}/signup`, { name, email, password });

export const login = (email: string, password: string) =>
  axios.post(`${API_URL}/login`, { email, password });

export const fetchFiles = (token: string) =>
  axios.get(`${API_URL}/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export async function adminLogin(email: string, password: string) {
  const response = await axios.post(`${API_URL}/admin/login`, { email, password });
  return response.data;
}

export async function fetchAdminUsers(token: string) {
  return axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAdminFiles(token: string) {
  return axios.get(`${API_URL}/admin/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAdminStats(token: string) {
  return axios.get(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}