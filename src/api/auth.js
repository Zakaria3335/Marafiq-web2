import { apiFetch } from "./client";

// خطوة 1 من التسجيل: رقم تلفون + رقم البطاقة المدنية -> بيبعت OTP
export function registerAccount({ phone, civilId }) {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: { phone, civilId },
  });
}

// خطوة 2 من التسجيل: تأكيد الكود + باقي بيانات البروفايل -> بينشئ الحساب
export function verifyRegistration(payload) {
  return apiFetch("/api/v1/auth/register/verify", {
    method: "POST",
    body: payload,
  });
}

// تسجيل دخول (حساب موجود مسبقاً): رقم تلفون -> بيبعت OTP
export function requestLoginOtp({ phone }) {
  return apiFetch("/api/v1/auth/login/request-otp", {
    method: "POST",
    body: { phone },
  });
}

// بيتحقق من كود الـ OTP المدخل لرقم التلفون
export function verifyOtp({ phone, code }) {
  return apiFetch("/api/v1/auth/otp/verify", {
    method: "POST",
    body: { phone, code },
  });
}
