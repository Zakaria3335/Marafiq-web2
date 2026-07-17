import { useLanguage } from "../../context/useLanguage";
import "./Footer.css";

// روابط قائمة الفوتر
const menuLinks = [
  { id: "about", labelKey: "footer.about", href: "#" },
  { id: "services", labelKey: "footer.services", href: "#" },
  { id: "complaints", labelKey: "footer.complaints", href: "#" },
  { id: "inquiry", labelKey: "footer.inquiry", href: "#" },
  { id: "media", labelKey: "footer.media", href: "#" },
  { id: "faq", labelKey: "footer.faq", href: "#" },
];

// روابط الشريط السفلي (الحقوق القانونية)
const legalLinks = [
  { id: "privacy", labelKey: "footer.privacy", href: "#" },
  { id: "terms", labelKey: "footer.terms", href: "#" },
  { id: "accessibility", labelKey: "footer.accessibility", href: "#" },
];

// الكومبوننت الرئيسي للفوتر
// wide=true (صفحة الهوم): نفس عرض أقسام الهوم (1800px). غير هيك: نفس عرض
// حاوية الصفحات التانية (.container, 1360px) مشان الفوتر يحاذي محتوى الصفحة فوقه
export default function Footer({ wide = false }) {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <img src="/picture4.svg" alt="" className="footer-decor" />
      <div className={`footer-inner${wide ? "" : " footer-inner-narrow"}`}>
        <div className="footer-brand">
          <a className="footer-logo" href="#" aria-label={t("footer.home")}>
            <img src="/logo.svg" alt="Marafiq" className="footer-logo-img" />
          </a>
          <div className="footer-social">
            <a href="#" className="footer-social-btn" aria-label={t("footer.facebook")}>
              <img src="/facbook.svg" alt="" />
            </a>
            <a href="#" className="footer-social-btn" aria-label={t("footer.twitter")}>
              <img src="/x.svg" alt="" />
            </a>
            <a href="#" className="footer-social-btn" aria-label={t("footer.linkedin")}>
              <img src="/linkedin.svg" alt="" />
            </a>
          </div>
        </div>

        <div className="footer-col-1">
          <h3 className="footer-heading">{t("footer.ourMenu")}</h3>
          <ul className="footer-links">
            {menuLinks.map((link) => (
              <li key={link.id}>
                <a href={link.href}>{t(link.labelKey)}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col-2">
          <h3 className="footer-heading">{t("footer.contactInfo")}</h3>
          <ul className="footer-contact">
            <li>
              <span className="footer-icon-circle">
                <img src="/call.svg" alt="" />
              </span>
              <span>+968 22143933</span>
            </li>
            <li>
              <span className="footer-icon-circle">
                <img src="/mail.svg" alt="" />
              </span>
              <span>recods@marafiq.om</span>
            </li>
            <li>
              <span className="footer-icon-circle">
                <img src="/location.svg" alt="" />
              </span>
              <span>{t("footer.address")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={`footer-bottom${wide ? "" : " footer-bottom-narrow"}`}>
        <p className="footer-copy">{t("footer.copyright")}</p>
        <nav className="footer-legal">
          {legalLinks.map((link) => (
            <a key={link.id} href={link.href}>
              {t(link.labelKey)}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
