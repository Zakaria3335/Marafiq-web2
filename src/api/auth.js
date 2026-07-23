import { apiFetch, loadTokens, saveTokens } from "./client";

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

// إعادة إرسال كود الـ OTP لتسجيل الدخول (نفس الرقم يلي انطلب لأول مرة)
export function resendLoginOtp({ phone }) {
  return apiFetch("/api/v1/auth/otp/resend", {
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

// بيلغي التوكن من طرف السيرفر (refresh token) قبل ما نمسحه محلياً — لو فشل
// الطلب (مثلاً السيرفر مش راجع) منكمل ننضّف الجلسة محلياً برضو
export async function logoutRequest() {
  const current = loadTokens();
  try {
    await apiFetch("/api/v1/auth/logout", {
      method: "POST",
      body: { refreshToken: current?.refreshToken },
    });
  } catch {
    // نتجاهل الخطأ — الأهم إنو الجلسة تتمسح محلياً بأي الحالتين
  }
}
