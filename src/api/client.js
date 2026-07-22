const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBSCRIPTION_KEY = import.meta.env.VITE_API_SUBSCRIPTION_KEY;
const ACCOUNT_ID = import.meta.env.VITE_API_ACCOUNT_ID;

const TOKEN_STORAGE_KEY = "marafiq_auth_tokens";
const ACTIVE_ACCOUNT_STORAGE_KEY = "marafiq_active_account_id";

// توكنات الدخول (access/refresh) — مخزّنة لحالها بالـ localStorage وبتنبعت
// تلقائياً كـ Authorization header مع كل طلب auth:true (الافتراضي)
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

// حساب المستخدم المسجّل دخوله فعلياً (accountId من /profile) — هاد هو يلي
// المفروض ينبعت بـ X-Account-Id، مش قيمة VITE_API_ACCOUNT_ID الثابتة يلي
// كانت بتنبعت لكل الطلبات بغض النظر مين مسجّل دخول (وهيك أي مستخدم حقيقي
// كان رح يفشل بفحص "Caller is not a member of the requested account")
export function loadActiveAccountId() {
  return localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY) || null;
}

export function saveActiveAccountId(accountId) {
  if (accountId) {
    localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, accountId);
  } else {
    localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
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
// auth:false لازم تنحط بس على endpoints ما قبل تسجيل الدخول (زي register/login)
export async function apiFetch(
  path,
  { method = "GET", body, isFormData = false, auth = true } = {},
) {
  const tokens = auth ? loadTokens() : null;
  const headers = {};
  // FormData بتحط الـ Content-Type (مع الـ boundary) لحالها لما تنبعت — إذا حطيناها
  // يدوياً رح يخرب الـ boundary وما يقدر السيرفر يحلل الـ multipart
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (SUBSCRIPTION_KEY) headers["X-Api-Subscription-Key"] = SUBSCRIPTION_KEY;
  // حساب المستخدم الحقيقي المسجّل دخوله لو موجود، وإلا نرجع للقيمة الثابتة
  // بالـ env (لازمة لطلبات ما قبل تسجيل الدخول اللي بعدها بتحتاج حساب، إذا وجدت)
  const activeAccountId = loadActiveAccountId();
  if (activeAccountId) headers["X-Account-Id"] = activeAccountId;
  else if (ACCOUNT_ID) headers["X-Account-Id"] = ACCOUNT_ID;
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
