import { useEffect, useState } from "react";
import { LanguageContext } from "./language-context";
import { translations } from "../i18n/translations";

const LANGUAGE_STORAGE_KEY = "marafiq_language";

function loadStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    // ignore malformed/unavailable storage
  }
  return "en";
}

function resolve(dict, key) {
  return key
    .split(".")
    .reduce((acc, part) => (acc && typeof acc === "object" ? acc[part] : undefined), dict);
}

// بيوفر اللغة الحالية + دالة الترجمة t() لكل الصفحات، وبيبدّل dir/lang
// على <html> مباشرة حتى الـ RTL ينطبق تلقائياً بدون ما نلمس كل صفحة
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(loadStoredLanguage);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const toggleLanguage = () => setLanguage((current) => (current === "en" ? "ar" : "en"));

  // بيرجع الترجمة العربي/انكليزي حسب اللغة الحالية، وإذا مفقودة بيرجع النص
  // الإنكليزي كـ fallback بدل ما يبين المفتاح الخام (مثلاً "nav.home")
  const t = (key) => {
    const value = resolve(translations[language], key);
    if (value !== undefined) return value;
    const fallback = resolve(translations.en, key);
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
