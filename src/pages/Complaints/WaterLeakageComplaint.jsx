import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import "../ServiceDetail/ServiceApplicationForm.css";
import "./WaterLeakageComplaint.css";

function BreadcrumbChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon() {
  return <img src="/sahem3.svg" alt="" width="20" height="20" />;
}

function ChevronUpIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.15s ease" }}
    >
      <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5.5M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5l2.2 1.27 2.54-.2 1.27 2.2 2.2 1.27-.2 2.54 1.27 2.2-1.27 2.2.2 2.54-2.2 1.27-1.27 2.2-2.54-.2L12 21.5l-2.2-1.27-2.54.2-1.27-2.2-2.2-1.27.2-2.54L2.72 12.4l1.27-2.2-.2-2.54 2.2-1.27 1.27-2.2 2.54.2z"
        fill="#e6f7f5"
        stroke="#0aa6a6"
        strokeWidth="1.4"
      />
      <path d="M8.5 12.3l2.4 2.4 4.6-4.9" stroke="#0aa6a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TextField({ label, required, placeholder, readOnly, value, onChange }) {
  return (
    <label className="app-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <input
        type="text"
        className={`app-field-input${readOnly ? " app-field-input-readonly" : ""}`}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        required={required && !readOnly}
      />
    </label>
  );
}

function SelectField({ label, required, placeholder, options, value, onChange }) {
  return (
    <label className="app-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <select
        className="app-field-input app-field-select"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, required, placeholder, value, onChange, maxLength, helper }) {
  return (
    <label className="app-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <textarea
        className="app-field-input wlc-textarea"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
      />
      <span className="wlc-field-footer">
        <span>
          <InfoIcon /> {helper}
        </span>
        <span>
          {String(value.length).padStart(3, "0")} / {maxLength}
        </span>
      </span>
    </label>
  );
}

// حقل رفع ملف — شكلي بس لهلق، الـ API الحقيقي لهاد النوع من الشكاوى بياخد JSON
// (مش multipart)، فما في مكان يترفع فيه الملف فعلياً
function FileField({ label, required }) {
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
          className="app-file-input"
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

function FormSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="app-section">
      <button
        type="button"
        className="app-section-header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <h3>{title}</h3>
        <ChevronUpIcon open={open} />
      </button>
      {open && <div className="app-section-body">{children}</div>}
    </div>
  );
}

export default function WaterLeakageComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const leakageComplaintTypes = t("complaintForm.leakageTypes").map((label, index) => ({
    value: index + 1,
    label,
  }));

  const [accountNo, setAccountNo] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [anotherReason, setAnotherReason] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setRefNumber(`WLC-${Date.now().toString().slice(-8)}`);
    setSubmitted(true);
  };

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <Link to="/services" className="breadcrumb-link">
            {t("services.breadcrumbServices")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("complaintForm.breadcrumbCurrent")}</span>
        </div>
      </div>

      <section className="wlc-body">
        <div className="container">
          <Link to="/" className="app-back-link service-back-link">
            <BackArrowIcon />
          </Link>

          <h1 className="app-form-title">{t("complaintForm.title")}</h1>
          <p className="app-form-subtitle">{t("serviceForm.instructions")}</p>

          <h2 className="app-form-section-label">{t("complaintForm.applicantInformation")}</h2>

          <form onSubmit={handleSubmit}>
            <FormSection title={t("complaintForm.customerRequestDetails")}>
              <div className="app-fields-grid">
                <TextField label={t("complaintForm.customerName")} required readOnly value={user?.name || ""} />
                <TextField
                  label={t("complaintForm.accountNo")}
                  required
                  placeholder={t("complaintForm.accountNo")}
                  value={accountNo}
                  onChange={(event) => setAccountNo(event.target.value)}
                />
                <TextField label={t("complaintForm.mobileNumber")} required readOnly value={user?.mobile || ""} />
                <TextField label={t("complaintForm.email")} readOnly value={user?.email || ""} />
                <TextField
                  label={t("complaintForm.permanentAddress")}
                  required
                  readOnly
                  value={user?.address || ""}
                />
              </div>
            </FormSection>

            <FormSection title={t("complaintForm.complaintDetailsSection")}>
              <div className="wlc-fields-grid-2">
                <SelectField
                  label={t("complaintForm.complaintType")}
                  required
                  placeholder={t("complaintForm.complaintType")}
                  options={leakageComplaintTypes}
                  value={complaintType}
                  onChange={(event) => setComplaintType(event.target.value)}
                />
                <TextField
                  label={t("complaintForm.securityCode")}
                  required
                  placeholder={t("complaintForm.securityCode")}
                  value={securityCode}
                  onChange={(event) => setSecurityCode(event.target.value)}
                />
                <TextAreaField
                  label={t("complaintForm.complaintDetails")}
                  required
                  placeholder={t("complaintForm.placeholderText")}
                  value={complaintDetails}
                  onChange={(event) => setComplaintDetails(event.target.value)}
                  maxLength={4000}
                  helper={t("complaintForm.helperText")}
                />
                <TextAreaField
                  label={t("complaintForm.anotherReason")}
                  placeholder={t("complaintForm.placeholderText")}
                  value={anotherReason}
                  onChange={(event) => setAnotherReason(event.target.value)}
                  maxLength={2000}
                  helper={t("complaintForm.helperText")}
                />
              </div>
            </FormSection>

            <FormSection title={t("complaintForm.requiredDocument")}>
              <div className="app-fields-grid">
                <FileField label={t("complaintForm.attachments")} required />
              </div>
            </FormSection>

            <div className="app-form-actions">
              <button type="button" className="app-cancel-btn" onClick={() => navigate(-1)}>
                {t("serviceForm.cancel")}
              </button>
              <button type="submit" className="app-submit-btn">
                {t("serviceForm.submit")}
              </button>
            </div>
          </form>
        </div>
      </section>

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
            <h3 className="wlc-success-title">{t("complaintForm.successTitle")}</h3>
            {refNumber && (
              <p className="app-success-ref">
                {t("serviceForm.refNo")} {refNumber}
              </p>
            )}
            <p className="app-success-text">{t("serviceForm.successText")}</p>
            <button type="button" className="app-submit-btn app-success-done" onClick={() => navigate("/")}>
              {t("serviceForm.done")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
