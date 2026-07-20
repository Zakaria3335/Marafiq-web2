import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import ServiceDetail from "../ServiceDetail/ServiceDetail";
import { useLanguage } from "../../context/useLanguage";
import "./Services.css";
import "../ServiceDetail/ServiceDetail.css";

// أيقونة السهم الصغيرة بين أجزاء الـ breadcrumb (بتتقلب لما اللغة عربي)
function BreadcrumbChevron() {
  const { language } = useLanguage();
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: language === "ar" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// سهم الرجوع جنب عنوان "POWERING YOUR NEEDS"
function BackArrowIcon() {
  const { language } = useLanguage();
  return (
    <img
      src="/sahem3.svg"
      alt=""
      width="20"
      height="20"
      style={{ transform: language === "ar" ? "scaleX(-1)" : undefined }}
    />
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.2-3.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  const { language } = useLanguage();
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: language === "ar" ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// بيانات كل الخدمات المتاحة (نفس ترتيب الفيغما — 8 كروت). العنوان/الوصف
// بيجو من الترجمة عن طريق services.items.<baseId>
const services = [
  { id: "water-connection-1", baseId: "water-connection", image: "/services/water-connection.png" },
  { id: "tanker-license-1", baseId: "tanker-license", image: "/services/tanker.png" },
  { id: "water-meter-1", baseId: "water-meter", image: "/services/water-meter.png" },
  { id: "water-disconnection-1", baseId: "water-disconnection", image: "/services/valve-disconnection.png" },
  { id: "water-meter-2", baseId: "water-meter", image: "/services/water-meter.png" },
  { id: "water-disconnection-2", baseId: "water-disconnection", image: "/services/valve-disconnection.png" },
  { id: "tanker-license-2", baseId: "tanker-license", image: "/services/tanker.png" },
  { id: "water-connection-2", baseId: "water-connection", image: "/services/water-connection.png" },
  { id: "noc-1", baseId: "noc", image: "/services/valve-disconnection.png" },
];

export default function Services() {
  const location = useLocation();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const translatedServices = useMemo(
    () =>
      services.map((service) => ({
        ...service,
        title: t(`services.items.${service.baseId}.title`),
        description: t(`services.items.${service.baseId}.description`),
      })),
    [t],
  );

  useEffect(() => {
    const requestedId = location.state?.serviceId;
    if (!requestedId) return;
    const match = translatedServices.find((service) =>
      service.id.startsWith(requestedId),
    );
    if (match) setSelectedService(match);
  }, [location.state, translatedServices]);

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return translatedServices;
    return translatedServices.filter((service) =>
      service.title.toLowerCase().includes(term),
    );
  }, [query, translatedServices]);

  return (
    <div className="page-canvas">
      {/* شريط الـ breadcrumb (Home > Services) أو (Home > Services > اسم الخدمة) */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("services.breadcrumbHome")}
          </Link>
          <BreadcrumbChevron />
          {selectedService ? (
            <>
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => setSelectedService(null)}
              >
                {t("services.breadcrumbServices")}
              </button>
              <BreadcrumbChevron />
              <span className="breadcrumb-current">
                {selectedService.title}
              </span>
            </>
          ) : (
            <span className="breadcrumb-current">{t("services.breadcrumbServices")}</span>
          )}
        </div>
      </div>

      {selectedService ? (
        <ServiceDetail
          service={selectedService}
          onBack={() => setSelectedService(null)}
        />
      ) : (
        <>
          {/* قسم عنوان الصفحة + البحث */}
          <section className="services-hero">
            <div className="container">
              <Link to="/" className="services-back-link">
                <BackArrowIcon />
                <h1>{t("services.heroTitle")}</h1>
              </Link>
              <Link to="/services" className="services-hero-subtitle">
                {t("services.allServices")}
              </Link>

              <label className="services-search">
                <SearchIcon />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("services.searchPlaceholder")}
                  aria-label={t("services.searchLabel")}
                />
              </label>
            </div>
          </section>

          {/* شبكة كل الخدمات */}
          <section className="services-grid-section">
            <div className="container">
              {filteredServices.length === 0 ? (
                <p className="services-empty">{t("services.noResults")}</p>
              ) : (
                <div className="services-grid">
                  {filteredServices.map((service, index) => (
                    <Reveal
                      key={service.id}
                      as="article"
                      className="services-card"
                      delay={(index % 4) * 80}
                      style={{ backgroundImage: `url(${service.image})` }}
                    >
                      <div className="services-card-overlay">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                        <button
                          type="button"
                          className="apply-btn"
                          onClick={() => setSelectedService(service)}
                        >
                          {t("services.applyNow")}
                          <ChevronIcon />
                        </button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
