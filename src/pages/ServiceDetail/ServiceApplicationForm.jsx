import { useEffect, useState } from "react";
import { lookupEntities } from "../../api/lookup";
import { ApiError } from "../../api/client";
import { useLanguage } from "../../context/useLanguage";

// سهم الرجوع (نفس أيقونة صفحة تفاصيل الخدمة)
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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// شارة صح خضراء/تيل بنافذة نجاح الإرسال
function CheckBadgeIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.2 1.27 2.54-.2 1.27 2.2 2.2 1.27-.2 2.54 1.27 2.2-1.27 2.2.2 2.54-2.2 1.27-1.27 2.2-2.54-.2L12 21.5l-2.2-1.27-2.54.2-1.27-2.2-2.2-1.27.2-2.54L2.72 12.4l1.27-2.2-.2-2.54 2.2-1.27 1.27-2.2 2.54.2z"
        fill="#e6f7f5"
        stroke="#0aa6a6"
        strokeWidth="1.4"
      />
      <path
        d="M8.5 12.3l2.4 2.4 4.6-4.9"
        stroke="#0aa6a6"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// أيقونة معلومات صغيرة جنب "الحد الأقصى لحجم الملف"
function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 11v5.5M12 8v.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// حقل نصي/رقمي — الـ name هون لازم يطابق بالضبط اسم الحقل بالـ API
// (متل ما هو بالـ curl) لأنو منستعمل FormData(form) مباشرة عند الإرسال
function TextField({ name, label, required, type = "text", wide }) {
  return (
    <label className={`app-field${wide ? " app-field-wide" : ""}`}>
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <input
        type={type}
        name={name}
        step={type === "number" ? "any" : undefined}
        className="app-field-input"
        placeholder={label}
        required={required}
      />
    </label>
  );
}

// حقل رفع ملف
function FileField({ name, label, required }) {
  const { t } = useLanguage();
  const [fileName, setFileName] = useState("");

  return (
    <label className="app-field app-file-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <span className="app-file-box">
        <span className="app-file-name">{fileName || t("serviceForm.noFileSelected")}</span>
        <span className="app-file-choose-btn">{t("serviceForm.chooseFile")}</span>
        <input
          type="file"
          name={name}
          className="app-file-input"
          required={required}
          onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
        />
      </span>
      <span className="app-file-hint">
        <InfoIcon />
        {t("serviceForm.maxFileSize")}
      </span>
    </label>
  );
}

// حقل Al-Wilaya الحقيقي (نفس المصدر يلي بيتستعمل بصفحة التسجيل) — GUID فعلي
// مش رقم مخمّن، لأنو الـ lookup هاد مجرّب وموجود مسبقاً بـ Auth.jsx
const AL_WILAYA_ID_FIELD = "cr7c8_alwilayaid";
const AL_WILAYA_NAME_FIELD = "cr7c8_name";
const AL_WILAYA_LOOKUP = {
  entityName: "cr7c8_alwilaya",
  columns: `${AL_WILAYA_ID_FIELD},${AL_WILAYA_NAME_FIELD}`,
};

function AlWilayaField({ name, label, required }) {
  const { t } = useLanguage();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    lookupEntities(AL_WILAYA_LOOKUP)
      .then((rows) => {
        if (cancelled) return;
        setOptions(rows || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : t("serviceForm.genericError"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="app-field">
      <label className="app-field">
        <span className="app-field-label">
          {label}
          {required && <span className="app-field-required">*</span>}
        </span>
        <select
          name={name}
          className="app-field-input app-field-select"
          defaultValue=""
          required={required}
          disabled={loading || options.length === 0}
        >
          <option value="" disabled>
            {loading ? t("serviceForm.loadingAlWilaya") : t("serviceForm.alWilaya")}
          </option>
          {options.map((option) => (
            <option key={option[AL_WILAYA_ID_FIELD]} value={option[AL_WILAYA_ID_FIELD]}>
              {option[AL_WILAYA_NAME_FIELD]}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="app-field-error">{error}</p>}
    </div>
  );
}

function renderField(field) {
  if (field.type === "file") {
    return <FileField key={field.name} name={field.name} label={field.label} required={field.required} />;
  }
  if (field.type === "alwilaya") {
    return <AlWilayaField key={field.name} name={field.name} label={field.label} required={field.required} />;
  }
  return (
    <TextField
      key={field.name}
      name={field.name}
      label={field.label}
      required={field.required}
      type={field.type === "number" ? "number" : field.type === "tel" ? "tel" : "text"}
      wide={field.wide}
    />
  );
}

// فورم تقديم طلب خدمة — الحقول (`fields`) ودالة الإرسال (`submitFn`) بيجو من
// صفحة تفاصيل الخدمة (ServiceDetail) وبتختلف حسب الخدمة، بس شكل الفورم موحّد
export default function ServiceApplicationForm({ title, fields, submitFn, onBack, onCancel }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const documentFields = fields.filter((field) => field.type === "file");
  const detailFields = fields.filter((field) => field.type !== "file");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!submitFn) return;
    setSubmitError("");
    setSubmitLoading(true);
    try {
      const formData = new FormData(event.target);
      const result = await submitFn(formData);
      setResultMessage(
        result?.requestNumber || result?.ticketNumber || result?.caseNumber || result?.id || "",
      );
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : t("serviceForm.genericError"));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className="service-application">
      <button type="button" className="service-back-link app-back-link" onClick={onBack}>
        <BackArrowIcon />
      </button>

      <h1 className="app-form-title">{title}</h1>
      <p className="app-form-subtitle">{t("serviceForm.instructions")}</p>

      <h2 className="app-form-section-label">{t("serviceForm.applicationDetails")}</h2>

      <form onSubmit={handleFormSubmit}>
        {detailFields.length > 0 && (
          <div className="app-section">
            <div className="app-fields-grid">{detailFields.map(renderField)}</div>
          </div>
        )}

        {documentFields.length > 0 && (
          <div className="app-section">
            <div className="app-fields-grid">{documentFields.map(renderField)}</div>
          </div>
        )}

        {submitError && <p className="app-form-error">{submitError}</p>}

        <div className="app-form-actions">
          <button type="button" className="app-cancel-btn" onClick={onCancel || onBack}>
            {t("serviceForm.cancel")}
          </button>
          <button type="submit" className="app-submit-btn" disabled={submitLoading}>
            {submitLoading ? t("serviceForm.submitting") : t("serviceForm.submit")}
          </button>
        </div>
      </form>

      {submitted && (
        <div className="app-success-overlay">
          <div className="app-success-modal">
            <button
              type="button"
              className="app-success-close"
              aria-label={t("serviceForm.close")}
              onClick={() => setSubmitted(false)}
            >
              <CloseIcon />
            </button>
            <CheckBadgeIcon />
            {resultMessage && (
              <p className="app-success-ref">
                {t("serviceForm.refNo")} {resultMessage}
              </p>
            )}
            <p className="app-success-text">{t("serviceForm.successText")}</p>
            <button type="button" className="app-submit-btn app-success-done" onClick={onBack}>
              {t("serviceForm.done")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
