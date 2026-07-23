import { apiFetch } from "./client";

export function getProfile() {
  return apiFetch("/api/v1/profile");
}

// حسابات المستخدم المسجّل دخوله (Utility accounts) — لازم نستخدم رقم حساب
// من هون بالشكاوى/الطلبات، مش نص حر، لأنو الـ backend بيتحقق إنو الحساب
// فعلاً تابع للمستخدم (Caller is not a member of the requested account)
export function getMyAccounts() {
  return apiFetch("/api/v1/profile/accounts");
}

// ربط حساب (Utility account) تاني بالبروفايل
export function addAccount({ accountNo }) {
  return apiFetch("/api/v1/profile/accounts", {
    method: "POST",
    body: { accountNo },
  });
}
