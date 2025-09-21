import axios from "axios";

const API_URL = "http://backend:8080";

export const uploadFiles = (files: File[], token: string) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return axios.post(`${API_URL}/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listFiles = (token: string) =>
  axios.get(`${API_URL}/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export async function searchFiles(filters: any, token: string) {

  const payload = {
    filename: filters.filename || "",
    mime: filters.mime || "",
    min_size: Number(filters.min_size) || 0,
    max_size: Number(filters.max_size) || 0,
    date_from: filters.date_from || "",
    date_to: filters.date_to || "",
    uploader: filters.uploader || "",
  };

  return axios.post(`${API_URL}/search`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}


export const deleteFile = (id: string, token: string) =>
  axios.delete(`${API_URL}/delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const generatePublicLink = (id: string, token: string) =>
  axios.post(`${API_URL}/share`, { id }, {
    headers: { Authorization: `Bearer ${token}` },
  });