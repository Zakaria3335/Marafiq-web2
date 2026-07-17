import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { submitComplaint } from "../../api/complaints";
import { ApiError } from "../../api/client";
import "../ServiceDetail/ServiceApplicationForm.css";
import "./WaterLeakageComplaint.css";

// TODO: تأكيد القيم الرقمية الفعلية من فريق الـ backend — الـ Swagger
// بيوصفهن كأرقام بس بدون تعداد أسماء (نفس وضع AccountType بصفحة التسجيل)
const COMPLAINT_CATEGORY_WATER_LEAKAGE = 1; // opsComplaintCategory (1-3)
const CASE_TYPE_CODE = 1;
const CASE_ORIGIN_CODE = 1; // غالباً بيمثل "Web Portal"

// TODO: تأكيد التسميات الحقيقية لأنواع شكاوى تسرب المياه (1-6) من الـ backend
const leakageComplaintTypes = [
  { value: 1, label: "Leak in Water Meter" },
  { value: 2, label: "Leak in Main Pipeline" },
  { value: 3, label: "Leak in House Connection" },
  { value: 4, label: "Leak in Valve" },
  { value: 5, label: "Leak in Manhole" },
  { value: 6, label: "Other" },
];

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
  const [fileName, setFileName] = useState("");

  return (
    <label className="app-field app-file-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <span className="app-file-box">
        <span className="app-file-name">{fileName || "No File Selected"}</span>
        <span className="app-file-choose-btn">Choose File</span>
        <input
          type="file"
          className="app-file-input"
          onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
        />
      </span>
      <span className="app-file-hint">
        <InfoIcon />
        Maximum attachment size: 5 MB
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

  const [accountNo, setAccountNo] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");
  const [anotherReason, setAnotherReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const result = await submitComplaint({
        opsComplaintCategory: COMPLAINT_CATEGORY_WATER_LEAKAGE,
        opsComplaintTypeForWaterLeakageComplaints: Number(complaintType),
        strComplaintDetails: complaintDetails,
        strAnotherReason: anotherReason || null,
        caseTypeCode: CASE_TYPE_CODE,
        caseOriginCode: CASE_ORIGIN_CODE,
      });
      setRefNumber(result?.ticketNumber || "");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
          <BreadcrumbChevron />
          <Link to="/services" className="breadcrumb-link">
            Services
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">Water Leakage Complaints</span>
        </div>
      </div>

      <section className="wlc-body">
        <div className="container">
          <Link to="/" className="app-back-link service-back-link">
            <BackArrowIcon />
          </Link>

          <h1 className="app-form-title">Water Leakage Complaints</h1>
          <p className="app-form-subtitle">
            Complete the form and click &quot;Submit&quot;. Fields marked with asterisks (*) are
            required.
          </p>

          <h2 className="app-form-section-label">Applicant Information</h2>

          <form onSubmit={handleSubmit}>
            <FormSection title="Customer Request Details">
              <div className="app-fields-grid">
                <TextField label="Customer Name" required readOnly value={user?.name || ""} />
                <TextField
                  label="Account No."
                  required
                  placeholder="Account No."
                  value={accountNo}
                  onChange={(event) => setAccountNo(event.target.value)}
                />
                <TextField label="Mobile Number" required readOnly value={user?.mobile || ""} />
                <TextField label="Email" readOnly value={user?.email || ""} />
                <TextField label="Permanent Address" required readOnly value={user?.address || ""} />
              </div>
            </FormSection>

            <FormSection title="Complaint Details">
              <div className="wlc-fields-grid-2">
                <SelectField
                  label="Complaint Type"
                  required
                  placeholder="Complaint Type"
                  options={leakageComplaintTypes}
                  value={complaintType}
                  onChange={(event) => setComplaintType(event.target.value)}
                />
                <TextField
                  label="Security Code"
                  required
                  placeholder="Security Code"
                  value={securityCode}
                  onChange={(event) => setSecurityCode(event.target.value)}
                />
                <TextAreaField
                  label="Complaint Details"
                  required
                  placeholder="Placeholder text"
                  value={complaintDetails}
                  onChange={(event) => setComplaintDetails(event.target.value)}
                  maxLength={4000}
                  helper="Helper or footer text"
                />
                <TextAreaField
                  label="Another Reason"
                  placeholder="Placeholder text"
                  value={anotherReason}
                  onChange={(event) => setAnotherReason(event.target.value)}
                  maxLength={2000}
                  helper="Helper or footer text"
                />
              </div>
            </FormSection>

            <FormSection title="Required Document">
              <div className="app-fields-grid">
                <FileField label="Attachments" required />
              </div>
            </FormSection>

            {submitError && <p className="wlc-form-error">{submitError}</p>}

            <div className="app-form-actions">
              <button type="button" className="app-cancel-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="app-submit-btn" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit"}
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
              aria-label="Close"
              onClick={() => setSubmitted(false)}
            >
              <CloseIcon />
            </button>
            <CheckBadgeIcon />
            <h3 className="wlc-success-title">Request Received!</h3>
            {refNumber && <p className="app-success-ref">REF NO: {refNumber}</p>}
            <p className="app-success-text">Your request has been successfully submitted.</p>
            <button type="button" className="app-submit-btn app-success-done" onClick={() => navigate("/")}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
