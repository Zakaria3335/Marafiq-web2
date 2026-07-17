import { apiFetch } from "./client";

export function getProfile() {
  return apiFetch("/api/v1/profile");
}
