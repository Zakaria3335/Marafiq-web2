import { apiFetch } from "./client";

// بحث عن سجلات (entity records) من نوع معيّن — مستخدم لقوائم متل Al-Wilaya
// اللي بترجع UUID فعلي (مش رقم/enum بسيط زي optionsets تحت).
// ملاحظة: entityName/columns لسا لازم تتأكد من فريق الـ backend (ما قدرنا
// نجرب Live بسبب الـ 401/CORS)، فهنن كـ TODO محدد بمكان استخدامها.
export function lookupEntities({ entityName, columns, filters }) {
  return apiFetch("/api/v1/lookup/lookups", {
    method: "POST",
    body: { entityName, columns, filters },
  });
}

// قوائم من نوع optionset (قيم رقمية enum-like)، متل PremisesType/ProjectType..
export function getOptionSets({ entityLogicalName, fieldName }) {
  const params = new URLSearchParams({ entityLogicalName, fieldName });
  return apiFetch(`/api/v1/lookup/optionsets?${params.toString()}`);
}
