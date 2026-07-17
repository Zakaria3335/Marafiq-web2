import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

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

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
