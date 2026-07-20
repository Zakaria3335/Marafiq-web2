import { apiFetch } from "./client";

// تسجيل دخول (حساب موجود مسبقاً): رقم تلفون -> بيبعت OTP
export function requestLoginOtp({ phone }) {
  return apiFetch("/api/v1/auth/login/request-otp", {
    method: "POST",
    body: { phone },
  });
}

// بيعيد إرسال كود التحقق لنفس رقم التلفون
export function resendOtp({ phone }) {
  return apiFetch("/api/v1/auth/otp/resend", {
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
