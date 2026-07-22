import { apiFetch, saveTokens } from "./client";

// خطوة 1 من التسجيل: رقم تلفون + رقم البطاقة المدنية -> بيبعت OTP
export function registerAccount({ phone, civilId }) {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    auth: false,
    body: { phone, civilId },
  });
}

// خطوة 2 من التسجيل: تأكيد الكود + باقي بيانات البروفايل -> بينشئ الحساب
// (ما بيرجع تسجيل دخول تلقائي — المستخدم لازم يسجّل دخول من صفحة /login بعدها)
export function verifyRegistration(payload) {
  return apiFetch("/api/v1/auth/register/verify", {
    method: "POST",
    auth: false,
    body: payload,
  });
}

// تسجيل دخول (حساب موجود مسبقاً): رقم تلفون -> بيبعت OTP
export function requestLoginOtp({ phone }) {
  return apiFetch("/api/v1/auth/login/request-otp", {
    method: "POST",
    auth: false,
    body: { phone },
  });
}

// بيتحقق من كود دخول الـ OTP -> بيرجع access/refresh token وبيخزنهن محلياً
// (بعدها كل طلب auth:true عم يبعتهن تلقائياً بـ Authorization header)
export async function verifyLoginOtp({ phone, code }) {
  const tokens = await apiFetch("/api/v1/auth/otp/verify", {
    method: "POST",
    auth: false,
    body: { phone, code },
  });
  saveTokens(tokens);
  return tokens;
}
