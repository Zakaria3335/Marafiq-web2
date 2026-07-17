import { apiFetch } from "./client";

export function getMyInquiries({ month, year } = {}) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  const query = params.toString();
  return apiFetch(`/api/v1/cases/inquiries${query ? `?${query}` : ""}`);
}

// ملاحظة: الـ API الحقيقي بيقبل بس نص السؤال (inquiry) — ما في حقل مرفق ملف
// بالـ request schema، فخيار "Attach File" بالتصميم شكلي بس لهلق
export function submitInquiry({ inquiry }) {
  return apiFetch("/api/v1/cases/inquiries", {
    method: "POST",
    body: { inquiry },
  });
}
