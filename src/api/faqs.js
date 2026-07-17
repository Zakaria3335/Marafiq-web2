import { apiFetch } from "./client";

// الأسئلة الشائعة + عنوان ووصف كرت "لسا عندك سؤال؟"
export function getHomeFaqs() {
  return apiFetch("/api/v1/home-page/faqs");
}
