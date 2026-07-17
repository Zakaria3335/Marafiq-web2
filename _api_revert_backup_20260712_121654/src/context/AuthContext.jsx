import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { saveTokens } from "../api/client";
import { getProfile } from "../api/profile";

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

  const login = (nextUser) => setUser(nextUser);

  // بعد نجاح otp/verify الحقيقي (تسجيل دخول فعلي عن طريق الـ API)، بنجيب
  // بروفايل المستخدم الحقيقي ونخزنه كـ "user". التوكن نفسو مخزّن لحاله
  // بالـ api/client (localStorage) ومنبعتو تلقائياً مع كل طلب لاحق.
  const loginWithTokens = async (tokens) => {
    saveTokens(tokens);
    const profile = await getProfile();
    const nextUser = {
      contactId: tokens.contactId,
      accountType: tokens.accountType,
      name: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.mobilePhone,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      mobile: profile.mobilePhone,
      civilId: profile.civilId,
      address: profile.address,
    };
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    saveTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
