import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import "./Notifications.css";

const PAGE_SIZE = 5;

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
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon() {
  const { language } = useLanguage();
  return (
    <img
      src="/sahem3.svg"
      alt=""
      width="22"
      height="22"
      style={{ transform: language === "ar" ? "scaleX(-1)" : undefined }}
    />
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronArrowIcon({ direction = "right" }) {
  const { language } = useLanguage();
  const flipped = (language === "ar") !== (direction === "left");
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3.5h9l4 4V20a1 1 0 01-1 1H6a1 1 0 01-1-1V4.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14.5 3.5V8h4.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 13.5l2.3 2.3L16 10.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 10.5a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14.5 6 10.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.3 19.5a1.8 1.8 0 003.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.3l2.6 2.6 5.4-5.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5l9.5 16.5H2.5L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 17v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const NOTIFICATION_TYPES = {
  invoice: { Icon: InvoiceIcon, theme: "notif-blue" },
  reminder: { Icon: BellIcon, theme: "notif-orange" },
  success: { Icon: CheckCircleIcon, theme: "notif-green" },
  warning: { Icon: WarningIcon, theme: "notif-red" },
};

const NOTIFICATION_TYPE_ORDER = ["invoice", "reminder", "success", "warning", "success"];

function buildFallbackNotifications(t) {
  const base = t("notifications.items").map((item, index) => ({
    ...item,
    type: NOTIFICATION_TYPE_ORDER[index],
  }));
  return Array.from({ length: 3 }, (_, page) =>
    base.map((item, index) => ({ ...item, id: `${page}-${index}` })),
  ).flat();
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = ["2024", "2025", "2026"];

export default function Notifications() {
  const { t } = useLanguage();
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2026");
  const [page, setPage] = useState(1);

  const notifications = buildFallbackNotifications(t);
  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const pageItems = notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("notifications.breadcrumbCurrent")}</span>
        </div>
      </div>

      <section className="notif-body">
        <div className="container">
          <div className="notif-title-row">
            <Link to="/" className="notif-back-link" aria-label={t("common.back")}>
              <BackArrowIcon />
            </Link>
            <h1 className="notif-title">{t("notifications.title")}</h1>
          </div>

          <p className="notif-subtitle">{t("notifications.subtitle")}</p>

          <p className="notif-desc">{t("notifications.desc")}</p>

          <div className="notif-list-header">
            <h2 className="notif-section-label">{t("notifications.sectionLabel")}</h2>
            <div className="notif-filters">
              <div className="notif-select-pill">
                <select value={month} onChange={(event) => setMonth(event.target.value)}>
                  {months.map((m, index) => (
                    <option key={m} value={m}>
                      {t("common.months")[index]}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>
              <div className="notif-select-pill">
                <select value={year} onChange={(event) => setYear(event.target.value)}>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          <div className="notif-list">
            {pageItems.map((item) => {
              const { Icon, theme } = NOTIFICATION_TYPES[item.type];
              return (
                <div key={item.id} className={`notif-card ${theme}`}>
                  <span className="notif-card-icon">
                    <Icon />
                  </span>
                  <div className="notif-card-body">
                    <h3 className="notif-card-title">{item.title}</h3>
                    <p className="notif-card-desc">{item.description}</p>
                  </div>
                  <span className="notif-card-time">{item.time}</span>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="notif-pagination">
              <button
                type="button"
                className="notif-page-arrow"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={t("notifications.prevPage")}
              >
                <ChevronArrowIcon direction="left" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`notif-page-number${pageNumber === page ? " active" : ""}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="notif-page-arrow"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t("notifications.nextPage")}
              >
                <ChevronArrowIcon direction="right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
