import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import "./RequestDetails.css";

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

const requestDetailMeta = { refNumber: "NFZ12345677", startDate: "03/02/2027", endDate: "03/02/2027" };

// labelKey/valueKey بيوخدو نص الترجمة تبعن؛ الحقول يلي إلها قيمة حقيقية
// (زي الاسم والإيميل) بتنحط مباشرة بـ literalValue
const customerDetails = [
  { fieldKey: "customerName", literalValue: "Josiane Homsi" },
  { fieldKey: "civilId" },
  { fieldKey: "crNo" },
  { fieldKey: "mobileNumber", literalValue: "+968 9111 1111" },
  { fieldKey: "email", literalValue: "josiane3@gmail.com" },
  { fieldKey: "permanentAddress" },
  { fieldKey: "alWilaya" },
  { fieldKey: "houseFlatNo" },
];

const connectionInfo = [
  { fieldKey: "connectionType" },
  { fieldKey: "premisesType" },
  { fieldKey: "expectedDailyConsumption" },
  { fieldKey: "tankCapacity" },
  { fieldKey: "noOfFloors" },
  { fieldKey: "noOfMeters" },
  { fieldKey: "totalBuildingArea" },
];

const landDetails = [
  { fieldKey: "region" },
  { fieldKey: "serialSketchNumber" },
  { fieldKey: "landNumber" },
  { fieldKey: "landArea" },
];

const requiredDocuments = [
  { fieldKey: "ownershipDeed", file: "Property Ownership Deed.pdf" },
  { fieldKey: "civilIdCr", file: "Civil ID.pdf" },
  { fieldKey: "landSurveySketch", file: "Land Survey Sketch.pdf" },
  { fieldKey: "connectionApplicationForm", file: "Connection Application Form.pdf" },
  { fieldKey: "buildingPermit", file: "Building Permit.pdf" },
  { fieldKey: "usufruct", file: "Usufruct Agreement and Building Completion Certificate.pdf" },
];

export default function RequestDetails() {
  const { t } = useLanguage();
  const fieldLabel = (fieldKey) => t(`requestDetails.fields.${fieldKey}`);
  const fieldsWithValues = (fields) =>
    fields.map((field) => ({
      label: fieldLabel(field.fieldKey),
      value: field.literalValue ?? fieldLabel(field.fieldKey),
    }));

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <Link to="/dashboard" className="breadcrumb-link">
            {t("dashboard.breadcrumbCurrent")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("requestDetails.breadcrumbMyRequests")}</span>
        </div>
      </div>

      <section className="req-body">
        <div className="container">
          <div className="req-title-row">
            <Link to="/dashboard" className="req-back-link" aria-label={t("requestDetails.backLabel")}>
              <BackArrowIcon />
            </Link>
            <div>
              <h1 className="req-title">{t("requestDetails.title")}</h1>
              <p className="req-subtitle">{t("requestDetails.subtitle")}</p>
            </div>
          </div>

          <div className="req-hero">
            <div className="req-hero-text">
              <h2 className="req-hero-title">{t("dashboard.requestRows.waterConnection")}</h2>
              <div className="req-hero-meta">
                <span className="req-hero-ref">#{requestDetailMeta.refNumber}</span>
                <span className="req-hero-status">
                  <CheckCircleIcon />
                  {t("dashboard.statusLabels.Approved")}
                </span>
              </div>
              <div className="req-hero-dates">
                <span className="req-hero-date">
                  <CalendarIcon />
                  {t("requestDetails.startDate")}&nbsp;&nbsp;<strong>{requestDetailMeta.startDate}</strong>
                </span>
                <span className="req-hero-date">
                  <CalendarXIcon />
                  {t("requestDetails.endDate")}&nbsp;&nbsp;<strong>{requestDetailMeta.endDate}</strong>
                </span>
              </div>
            </div>
            <img src="/services/Frame%20(12).svg" alt="" className="req-hero-illustration" />
          </div>

          <h2 className="req-section-label">{t("requestDetails.applicantInformation")}</h2>

          <DetailSection title={t("requestDetails.customerDetailsSection")}>
            <FieldGrid fields={fieldsWithValues(customerDetails)} />
          </DetailSection>

          <DetailSection title={t("requestDetails.connectionInformation")}>
            <FieldGrid fields={fieldsWithValues(connectionInfo)} />
          </DetailSection>

          <DetailSection title={t("requestDetails.landLocationDetails")}>
            <div className="req-fields-list">
              {fieldsWithValues(landDetails).map((field) => (
                <div key={field.label} className="req-field">
                  <span className="req-field-label">{field.label}</span>
                  <span className="req-field-value">{field.value}</span>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title={t("requestDetails.requiredDocument")}>
            <div className="req-documents-list">
              {requiredDocuments.map((doc) => (
                <div key={doc.fieldKey} className="req-document-row">
                  <span className="req-field-label">{fieldLabel(doc.fieldKey)}</span>
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
