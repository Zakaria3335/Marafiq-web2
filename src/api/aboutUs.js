import { apiFetch } from "./client";

// محتوى صفحة "من نحن" (aboutUs, overview, mission, vision, values)
export function getAboutUs() {
  return apiFetch("/api/v1/about-us");
}
