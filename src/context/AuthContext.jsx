import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { saveTokens, saveActiveAccountId } from "../api/client";
import { getProfile, getMyAccounts } from "../api/profile";

const AUTH_STORAGE_KEY = "marafiq_auth_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore malformed/unavailable storage
  }
  return null;
}

// بيوفر حالة تسجيل الدخول (المستخدم الحالي) لكل الصفحات، وبيحفظها بالـ localStorage
export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // بعد نجاح otp/verify الحقيقي (تسجيل دخول فعلي عن طريق الـ API)، بنجيب
  // بروفايل المستخدم الحقيقي ونخزنه كـ "user". التوكن نفسو مخزّن لحاله
  // بالـ api/client (localStorage) ومنبعتو تلقائياً مع كل طلب لاحق
  const loginWithTokens = async (tokens) => {
    saveTokens(tokens);
    const profile = await getProfile();
    // /api/v1/profile برجع accountId مباشرة (ممكن يكون null إذا المستخدم ما
    // إلو حساب مربوط بعد بالباك اند). لو null، منجرب /profile/accounts
    // كـ fallback (ممكن يكون فيها حساب حتى لو الـ profile نفسو ما بيّنه)
    let accountId = profile.accountId || null;
    if (!accountId) {
      const accounts = await getMyAccounts().catch(() => []);
      const accountsList = Array.isArray(accounts) ? accounts : accounts?.result || [];
      const primaryAccount = accountsList.find((account) => account.isPrimary) || accountsList[0];
      accountId = primaryAccount?.accountId || null;
    }
    const initials =
      `${(profile.firstName || "")[0] || ""}${(profile.lastName || "")[0] || ""}`.toUpperCase() ||
      "GU";
    const nextUser = {
      contactId: tokens.contactId,
      accountType: tokens.accountType === 2 ? "company" : "personal",
      initials,
      name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.mobilePhone,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      mobile: profile.mobilePhone,
      civilId: profile.civilId,
      address: profile.address,
      accountNo: accountId || "",
    };
    // من هلق ورايح، X-Account-Id رح يبعت حساب هالمستخدم الحقيقي بدل القيمة
    // الثابتة بالـ env (شوف الملاحظة بـ api/client.js)
    saveActiveAccountId(accountId);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    saveTokens(null);
    saveActiveAccountId(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
