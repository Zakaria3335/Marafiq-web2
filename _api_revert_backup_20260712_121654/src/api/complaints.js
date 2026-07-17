import { apiFetch } from "./client";

export function getMyComplaints({ month, year } = {}) {
  const params = new URLSearchParams();
  if (month) params.set("month", month);
  if (year) params.set("year", year);
  const query = params.toString();
  return apiFetch(`/api/v1/cases/complaints${query ? `?${query}` : ""}`);
}

export function getComplaintByTicket(ticketNumber) {
  return apiFetch(`/api/v1/cases/complaints/${encodeURIComponent(ticketNumber)}`);
}

// ملاحظة: الجسم هون JSON (مش multipart) — يعني الـ API الحقيقي ما بيقبل رفع
// ملف مرفق مع الشكوى بهاد الـ endpoint، فحقل "Attachments" بالتصميم شكلي بس لهلق
export function submitComplaint(payload) {
  return apiFetch("/api/v1/cases/complaints", {
    method: "POST",
    body: payload,
  });
}
