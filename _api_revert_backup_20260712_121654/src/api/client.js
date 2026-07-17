const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBSCRIPTION_KEY = import.meta.env.VITE_API_SUBSCRIPTION_KEY;

const TOKEN_STORAGE_KEY = "marafiq_auth_tokens";

export function loadTokens() {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore malformed/unavailable storage
  }
  return null;
}

export function saveTokens(tokens) {
  if (tokens) {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

// خطأ مخصص لفشل طلبات الـ API، بيحمل الرسالة العربي/الإنجليزي وكود الحالة
export class ApiError extends Error {
  constructor(message, { status, code, errorMessageAr } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errorMessageAr = errorMessageAr;
  }
}

// بيبعت طلب للـ API الحقيقي وبيرجع "result" مباشرة (فاكّ الغلاف الموحّد
// {result, isSuccess, isSystemError, errorMessageEn, errorMessageAr, code})
export async function apiFetch(
  path,
  { method = "GET", body, isFormData = false, auth = true, language } = {},
) {
  const tokens = auth ? loadTokens() : null;
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (SUBSCRIPTION_KEY) headers["X-Api-Subscription-Key"] = SUBSCRIPTION_KEY;
  if (language) headers.Language = language;
  if (auth && tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // ما في body أو مش JSON (مثلاً 204 No Content)
  }

  if (!response.ok) {
    // إما شكل الأخطاء العامة من ASP.NET (ProblemDetails: title/status) أو من DefaultResponse تبعنا
    const message =
      payload?.errorMessageEn || payload?.title || `Request failed (${response.status})`;
    throw new ApiError(message, {
      status: response.status,
      code: payload?.code,
      errorMessageAr: payload?.errorMessageAr,
    });
  }

  if (payload && typeof payload === "object" && "isSuccess" in payload) {
    if (!payload.isSuccess) {
      throw new ApiError(payload.errorMessageEn || "Request failed", {
        code: payload.code,
        errorMessageAr: payload.errorMessageAr,
      });
    }
    return payload.result;
  }

  return payload;
}
