import { useState } from "react";
import { Link } from "react-router-dom";
import "./RequestDetails.css";

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke="#0a3854" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="#0a3854" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4" stroke="#0a3854" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" stroke="#0a3854" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="#0a3854" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4" stroke="#0a3854" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.8 14.3l4.4 4.4M14.2 14.3l-4.4 4.4" stroke="#0a3854" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

function PdfIcon() {
  return <img src="/pdf.svg" alt="" width="18" height="18" />;
}

// قسم قابل للطي (Customer Details / Connection Information / ...)
function DetailSection({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="req-section">
      <button
        type="button"
        className="req-section-header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <h3>{title}</h3>
        <ChevronUpIcon open={open} />
      </button>
      {open && <div className="req-section-body">{children}</div>}
    </div>
  );
}

function FieldGrid({ fields }) {
  return (
    <div className="req-fields-grid">
      {fields.map((field) => (
        <div key={field.label} className="req-field">
          <span className="req-field-label">{field.label}</span>
          <span className="req-field-value">{field.value}</span>
        </div>
      ))}
    </div>
  );
}

const requestDetail = {
  title: "Water Service Connection",
  refNumber: "NFZ12345677",
  status: "Approved",
  startDate: "03/02/2027",
  endDate: "03/02/2027",
};

const customerDetails = [
  { label: "Customer Name", value: "Josiane Homsi" },
  { label: "Civil ID No.", value: "Civil ID No." },
  { label: "CR No.", value: "CR No." },
  { label: "Mobile Number", value: "+968 9111 1111" },
  { label: "Email", value: "josiane3@gmail.com" },
  { label: "Permanent Address", value: "Permanent Address" },
  { label: "Al-Wilaya", value: "Al-Wilaya" },
  { label: "House Flat No.", value: "House Flat No." },
];

const connectionInfo = [
  { label: "Connection Type", value: "Connection Type" },
  { label: "Premises Type", value: "Premises Type" },
  { label: "Expected Daily Consumption", value: "Expected Daily Consumption" },
  { label: "Tank Capacity", value: "Tank Capacity" },
  { label: "No. of Floors", value: "No. of Floors" },
  { label: "No. of Meters", value: "No. of Meters" },
  { label: "Total Building Area", value: "Total Building Area" },
];

const landDetails = [
  { label: "Region", value: "Region" },
  { label: "Serial Sketch Number", value: "Serial Sketch Number" },
  { label: "Land Number", value: "Land Number" },
  { label: "Land Area", value: "Land Area" },
];

const requiredDocuments = [
  { label: "Copy of Property Ownership Deed", file: "Property Ownership Deed.pdf" },
  { label: "Copy of Civil ID / Commercial Registration (CR)", file: "Civil ID.pdf" },
  { label: "Copy of Land Survey Sketch", file: "Land Survey Sketch.pdf" },
  { label: "Service Connection Application Form (Duqm Municipality)", file: "Connection Application Form.pdf" },
  { label: "Building Permit", file: "Building Permit.pdf" },
  {
    label: "Usufruct Agreement and Building Completion Certificate (if the land is within SEZAD – Duqm)",
    file: "Usufruct Agreement and Building Completion Certificate.pdf",
  },
];

export default function RequestDetails() {
  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
          <BreadcrumbChevron />
          <Link to="/dashboard" className="breadcrumb-link">
            My Dashboard
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">My Requests</span>
        </div>
      </div>

      <section className="req-body">
        <div className="container">
          <div className="req-title-row">
            <Link to="/dashboard" className="req-back-link" aria-label="Back to My Requests">
              <BackArrowIcon />
            </Link>
            <div>
              <h1 className="req-title">My Requests</h1>
              <p className="req-subtitle">Service Details</p>
            </div>
          </div>

          <div className="req-hero">
            <div className="req-hero-text">
              <h2 className="req-hero-title">{requestDetail.title}</h2>
              <div className="req-hero-meta">
                <span className="req-hero-ref">#{requestDetail.refNumber}</span>
                <span className="req-hero-status">
                  <CheckCircleIcon />
                  {requestDetail.status}
                </span>
              </div>
              <div className="req-hero-dates">
                <span className="req-hero-date">
                  <CalendarIcon />
                  Start Date&nbsp;&nbsp;<strong>{requestDetail.startDate}</strong>
                </span>
                <span className="req-hero-date">
                  <CalendarXIcon />
                  End Date&nbsp;&nbsp;<strong>{requestDetail.endDate}</strong>
                </span>
              </div>
            </div>
            <img src="/services/Frame%20(12).svg" alt="" className="req-hero-illustration" />
          </div>

          <h2 className="req-section-label">Applicant Information</h2>

          <DetailSection title="Customer Details">
            <FieldGrid fields={customerDetails} />
          </DetailSection>

          <DetailSection title="Connection Information">
            <FieldGrid fields={connectionInfo} />
          </DetailSection>

          <DetailSection title="Land / Location Details">
            <div className="req-fields-list">
              {landDetails.map((field) => (
                <div key={field.label} className="req-field">
                  <span className="req-field-label">{field.label}</span>
                  <span className="req-field-value">{field.value}</span>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Required Document">
            <div className="req-documents-list">
              {requiredDocuments.map((doc) => (
                <div key={doc.label} className="req-document-row">
                  <span className="req-field-label">{doc.label}</span>
                  <span className="req-document-file">
                    <PdfIcon />
                    {doc.file}
                  </span>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>
      </section>
    </div>
  );
}
