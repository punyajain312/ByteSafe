import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

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

const startOfDayIST = (date: string) =>
  date ? `${date}T00:00:00+05:30` : null;

const endOfDayIST = (date: string) =>
  date ? `${date}T23:59:59+05:30` : null;

export async function searchFiles(filters: any, token: string) {
  const payload = {
    filename: filters.filename || null,
    mime: filters.mime || null,
    min_size: filters.min_size ? Number(filters.min_size) : null,
    max_size: filters.max_size ? Number(filters.max_size) : null,
    date_from: startOfDayIST(filters.date_from),
    date_to: endOfDayIST(filters.date_to),
    uploader: filters.uploader || null,
  };

  console.log("Search payload:", payload); // 👈 debug once

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

export async function bulkFileAction(
  token: string,
  fileIds: string[],
  action: "delete" | "public" | "private"
) {
  const res = await fetch(`${API_URL}/files/bulk`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      file_ids: fileIds,
      action,
    }),
  });

  if (!res.ok) {
    throw new Error("Bulk action failed");
  }

  return res.json();
}

export const suggestFilenames = (query: string, token: string) =>
  axios.get(`${API_URL}/suggest/files`, {
    params: { query },
    headers: { Authorization: `Bearer ${token}` },
  });

export const suggestUploaders = (query: string, token: string) =>
  axios.get(`${API_URL}/suggest/uploaders`, {
    params: { query },
    headers: { Authorization: `Bearer ${token}` },
  });