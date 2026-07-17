import { apiFetch } from "./client";

// بحث عن سجلات (entity records) من نوع معيّن — مستخدم لقوائم متل Al-Wilaya
// اللي بترجع UUID فعلي (مش رقم/enum بسيط زي optionsets).
// ملاحظة: entityName/columns لسا لازم تتأكد من فريق الـ backend (ما قدرنا
// نجرب Live بسبب الـ 401 لعدم توفر subscription key لسا).
export function lookupEntities({ entityName, columns, filters }) {
  return apiFetch("/api/v1/lookup/lookups", {
    method: "POST",
    body: { entityName, columns, filters },
  });
}
