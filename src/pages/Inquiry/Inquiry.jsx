import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInquiries, submitInquiry } from "../../api/inquiries";
import { ApiError } from "../../api/client";
import { useLanguage } from "../../context/useLanguage";
import "./Inquiry.css";

const PAGE_SIZE = 4;

function BreadcrumbChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon() {
  return <img src="/sahem3.svg" alt="" width="22" height="22" />;
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke="#0076bf" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="#0076bf" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4" stroke="#0076bf" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 12.5l6.5-6.5a3 3 0 114.24 4.24L11 18a5 5 0 11-7.07-7.07l7.07-7.07"
        stroke="#f5a623"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AwaitingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#a3a8b0" strokeWidth="1.6" />
      <path d="M12 8v5M12 15.5v.01" stroke="#a3a8b0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ChevronArrowIcon({ direction = "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
    >
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

const statusClassMap = {
  Approved: "inq-status-green",
  Pending: "inq-status-orange",
  Rejected: "inq-status-red",
};

function buildFallbackInquiries(t) {
  const base = t("inquiry.fallbackItems").map((item) => ({ ...item, date: "Jan 05 2026" }));
  return Array.from({ length: 3 }, (_, page) =>
    base.map((item, index) => ({ ...item, id: `${page}-${index}` })),
  ).flat();
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = ["2024", "2025", "2026"];

export default function Inquiry() {
  const { t } = useLanguage();
  const [question, setQuestion] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [inquiries, setInquiries] = useState(() => buildFallbackInquiries(t));
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2026");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyInquiries({ month: months.indexOf(month) + 1, year })
      .then((data) => {
        if (data?.inquiries?.length) {
          setInquiries(
            data.inquiries.map((item) => ({
              id: item.inquiryId,
              date: formatDate(item.createdOn),
              status: item.status?.descriptionEn || "Pending",
              question: item.inquiry,
              answer: item.response,
            })),
          );
          setPage(1);
        }
      })
      .catch(() => {
        // بيضل الـ fallback ظاهر
      });
  }, [month, year]);

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
  const pageItems = inquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await submitInquiry({ inquiry: question.trim() });
      setQuestion("");
      setFileName("");
      // منحاول نحدّث القائمة فوراً حتى يبين السؤال الجديد
      getMyInquiries({ month: months.indexOf(month) + 1, year })
        .then((data) => {
          if (data?.inquiries?.length) {
            setInquiries(
              data.inquiries.map((item) => ({
                id: item.inquiryId,
                date: formatDate(item.createdOn),
                status: item.status?.descriptionEn || "Pending",
                question: item.inquiry,
                answer: item.response,
              })),
            );
          }
        })
        .catch(() => {});
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : t("inquiry.genericError"),
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("inquiry.breadcrumbCurrent")}</span>
        </div>
      </div>

      <section className="inq-body">
        <div className="container">
          <div className="inq-title-row">
            <Link to="/" className="inq-back-link" aria-label={t("common.back")}>
              <BackArrowIcon />
            </Link>
            <div>
              <h1 className="inq-title">{t("inquiry.title")}</h1>
              <p className="inq-subtitle">{t("inquiry.subtitle")}</p>
            </div>
          </div>

          <p className="inq-desc">{t("inquiry.desc")}</p>

          <form className="inq-form-card" onSubmit={handleSubmit}>
            <textarea
              className="inq-textarea"
              placeholder={t("inquiry.questionPlaceholder")}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              required
            />

            <label className="inq-attach-row">
              <PaperclipIcon />
              <span>{fileName || t("inquiry.attachFile")}</span>
              <input
                type="file"
                className="inq-attach-input"
                onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
              />
            </label>

            {submitError && <p className="inq-form-error">{submitError}</p>}

            <div className="inq-form-actions">
              <button type="submit" className="inq-submit-btn" disabled={submitLoading}>
                {submitLoading ? t("inquiry.submitting") : t("inquiry.submitInquiry")}
              </button>
            </div>
          </form>

          <div className="inq-list-header">
            <h2 className="inq-section-label">{t("inquiry.myInquiries")}</h2>
            <div className="inq-filters">
              <div className="inq-select-pill">
                <select value={month} onChange={(event) => setMonth(event.target.value)}>
                  {months.map((m, index) => (
                    <option key={m} value={m}>
                      {t("common.months")[index]}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>
              <div className="inq-select-pill">
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

          <div className="inq-grid">
            {pageItems.map((item) => (
              <div key={item.id} className="inq-card">
                <div className="inq-card-top">
                  <span className="inq-card-date">
                    <CalendarIcon />
                    {item.date}
                  </span>
                  <span className={`inq-status-pill ${statusClassMap[item.status] || "inq-status-orange"}`}>
                    {statusClassMap[item.status] ? t(`inquiry.status.${item.status}`) : item.status}
                  </span>
                </div>
                <p className="inq-card-question">{item.question}</p>
                {item.answer ? (
                  <p className="inq-card-answer">{item.answer}</p>
                ) : (
                  <div className="inq-card-awaiting">
                    <AwaitingIcon />
                    <span>{t("inquiry.awaitingResponse")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="inq-pagination">
              <button
                type="button"
                className="inq-page-arrow"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label={t("inquiry.prevPage")}
              >
                <ChevronArrowIcon direction="left" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`inq-page-number${pageNumber === page ? " active" : ""}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                className="inq-page-arrow"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label={t("inquiry.nextPage")}
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
