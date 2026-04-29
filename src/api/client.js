import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export async function getCurrentUser() {
  const response = await api.get("/api/v1/auth/me");
  return response.data.data;
}

export async function logoutUser() {
  return api.post("/api/v1/auth/logout");
}

export function githubLogin() {
  window.location.href = `${API_BASE_URL}/api/v1/auth/github?client=web`;
}