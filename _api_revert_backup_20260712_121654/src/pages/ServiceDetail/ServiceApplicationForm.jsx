import { useState } from "react";
import { useAuth } from "../../context/useAuth";

// سهم الرجوع (نفس أيقونة صفحة تفاصيل الخدمة)
function BackArrowIcon() {
  return <img src="/sahem3.svg" alt="" width="20" height="20" />;
}

// سهم للأعلى (لفتح/طي كل قسم بالفورم)
function ChevronUpIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: open ? "rotate(0deg)" : "rotate(180deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M6 15l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
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

// حقل نصي عادي (label فوق + input تحت)
function TextField({ label, required, placeholder, readOnly, defaultValue, type = "text" }) {
  return (
    <label className="app-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <input
        type={type}
        className={`app-field-input${readOnly ? " app-field-input-readonly" : ""}`}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
        required={required && !readOnly}
      />
    </label>
  );
}

// حقل قائمة منسدلة (Connection Type / Premises Type)
function SelectField({ label, required, placeholder, options }) {
  return (
    <label className="app-field">
      <span className="app-field-label">
        {label}
        {required && <span className="app-field-required">*</span>}
      </span>
      <select className="app-field-input app-field-select" defaultValue="" required={required}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

// حقل رفع ملف (label فوق + صندوق فيه "No File Selected" وزر Choose File)
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
          required={required}
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

// قسم قابل للطي (Customer Details / Connection Information / ...)
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

const connectionTypes = ["Residential", "Commercial", "Industrial"];
const premisesTypes = ["Villa", "Apartment", "Building", "Land"];

const documentFields = [
  { id: "ownership-deed", label: "Copy of Property Ownership Deed", required: true },
  { id: "civil-id", label: "Copy of Civil ID / Commercial Registration (CR)", required: true },
  { id: "land-survey", label: "Copy of Land Survey Sketch", required: true },
  { id: "connection-form", label: "Service Connection Application Form (Duqm Municipality)", required: true },
  { id: "completion-cert", label: "Building Completion Certificate (Duqm Municipality)", required: true },
  { id: "building-permit", label: "Building Permit", required: true },
  {
    id: "usufruct",
    label: "Usufruct Agreement and Building Completion Certificate (if the land is within SEZAD – Duqm)",
    required: true,
    wide: true,
  },
];

// بيولّد رقم مرجع عشوائي بشكل "PF-000540" لنافذة نجاح الإرسال
function generateRefNumber() {
  const digits = Math.floor(Math.random() * 900000 + 100000);
  return `PF-${digits}`;
}

// فورم "طلب توصيل خدمة المياه" اللي بيبين بعد الضغط على Apply Now بصفحة تفاصيل الخدمة
export default function ServiceApplicationForm({ title, onBack, onCancel }) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setRefNumber(generateRefNumber());
    setSubmitted(true);
  };

  return (
    <section className="service-application">
      <button type="button" className="service-back-link app-back-link" onClick={onBack}>
        <BackArrowIcon />
      </button>

      <h1 className="app-form-title">{title}</h1>
      <p className="app-form-subtitle">
        Complete the form and click &quot;Submit&quot;. Fields marked with asterisks (*) are
        required.
      </p>

      <h2 className="app-form-section-label">Applicant Information</h2>

      <form onSubmit={handleFormSubmit}>
        <FormSection title="Customer Details">
          <div className="app-fields-grid">
            <TextField
              label="Customer Name"
              required
              defaultValue={user?.name}
              placeholder="Customer Name"
            />
            <TextField label="Civil ID No." required placeholder="Civil ID No." />
            <TextField label="CR No." placeholder="CR No." />
            <TextField
              label="Mobile Number"
              required
              defaultValue={user?.mobile}
              placeholder="Mobile Number"
            />
            <TextField label="Email" placeholder="Email" />
            <TextField label="Permanent Address" placeholder="Permanent Address" />
            <TextField label="Al-Wilaya" required placeholder="Al-Wilaya" />
            <TextField label="House Flat No." required placeholder="House Flat No." />
          </div>
        </FormSection>

        <FormSection title="Connection Information">
          <div className="app-fields-grid">
            <SelectField label="Connection Type" required placeholder="Connection Type" options={connectionTypes} />
            <SelectField label="Premises Type" required placeholder="Premises Type" options={premisesTypes} />
            <TextField label="Expected Daily Consumption" placeholder="Expected Daily Consumption" />
            <TextField label="Tank Capacity" placeholder="Tank Capacity" />
            <TextField label="No. of Floors" placeholder="No. of Floors" />
            <TextField label="No. of Meters" placeholder="No. of Meters" />
            <TextField label="Total Building Area" placeholder="Total Building Area" />
          </div>
        </FormSection>

        <FormSection title="Land / Location Details">
          <div className="app-fields-grid">
            <TextField label="Region" required placeholder="Region" />
            <TextField label="Serial Sketch Number" required placeholder="Serial Sketch Number" />
            <TextField label="Land Number" required placeholder="Land Number" />
            <TextField label="Land Area" placeholder="Land Area" />
          </div>
        </FormSection>

        <FormSection title="Required Document">
          <div className="app-fields-grid">
            {documentFields.map((doc) => (
              <div key={doc.id} className={doc.wide ? "app-field-wide" : undefined}>
                <FileField label={doc.label} required={doc.required} />
              </div>
            ))}
          </div>
        </FormSection>

        <div className="app-form-actions">
          <button type="button" className="app-cancel-btn" onClick={onCancel || onBack}>
            Cancel
          </button>
          <button type="submit" className="app-submit-btn">
            Submit
          </button>
        </div>
      </form>

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
            <p className="app-success-ref">REF NO: {refNumber}</p>
            <p className="app-success-text">Your request has been successfully submitted.</p>
            <button type="button" className="app-submit-btn app-success-done" onClick={onBack}>
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
