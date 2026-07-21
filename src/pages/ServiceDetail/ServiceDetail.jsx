import { useEffect, useState } from "react";
import ServiceApplicationForm from "./ServiceApplicationForm";
import {
  submitNocRequest,
  submitTankerFillingLicenseRequest,
  submitWaterConnectionRequest,
} from "../../api/services";
import { getServiceCard } from "../../api/serviceCard";
import { useLanguage } from "../../context/useLanguage";
import { translations } from "../../i18n/translations";
import "./ServiceApplicationForm.css";

// أنواع الخدمات يلي عندها فورم تقديم فعلي بالباك اند (باقي الخدمات القادمة
// من /home-page/services بترجع محتوى ثابت من الترجمة كـ fallback بدون فورم)
const baseIdByServiceId = {
  "64dd19b8-e36a-f111-a826-7c1e52207175": "water-connection",
  "4c784c48-4d7c-f111-ab0f-000d3ab12cf3": "tanker-license",
  "098157fd-637b-f111-ab0f-000d3ab12cf3": "noc",
};

// بيحول رد الـ API لنفس شكل "content" يلي الصفحة أصلاً عم تستخدمو (من الترجمة)
function mapServiceCard(card, language) {
  if (!card) return null;
  const title = language === "ar" ? card.name : card.serviceCardTitleEnglish;
  const processDesc =
    language === "ar" ? card.processDescriptionArabic : card.processDescriptionEng;
  const steps = [...(card.serviceProcesses || [])]
    .sort((a, b) => Number(a.order) - Number(b.order))
    .map((step) => (language === "ar" ? step.name : step.serviceProcessNameEnglish));
  const category = card.category?.[0];
  const documents = (card.requiredDocument || []).map((doc) =>
    language === "ar" ? doc.requiredDocumentNameArabic : doc.requiredDocumentNameEnglish,
  );

  return {
    title,
    processDesc,
    steps,
    estimatedTime: language === "ar" ? category?.estimatedTimeArabic : category?.estimatedTimeEng,
    fees: language === "ar" ? category?.feesArabic : category?.fees,
    eligibility: language === "ar" ? category?.eligibility : category?.eligibilityEng,
    documents,
  };
}

// سهم الرجوع جنب عنوان الخدمة
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

function ClockIcon() {
  return <img src="/services/clock%202.svg" alt="" width="16" height="16" />;
}

function FeesIcon() {
  return (
    <img
      src="/services/hand-coins%20(6)%201.svg"
      alt=""
      width="16"
      height="16"
    />
  );
}

function EligibilityIcon() {
  return (
    <img
      src="/services/user-round-check%201.svg"
      alt=""
      width="16"
      height="16"
    />
  );
}

function DocumentIcon() {
  return (
    <img
      src="/services/book-text%20(3)%201.svg"
      alt=""
      width="16"
      height="16"
    />
  );
}

// حقول كل فورم لازم تطابق بالضبط أسماء الحقول بالـ API (متل ما هي بالـ curl
// من Swagger) لأنو الإرسال بيصير عن طريق FormData(form) مباشرة. الحقول يلي
// نوعها GUID (زي CompanyNameId) أو enum رقمي (زي ProjectType) ما إلها lookup
// أو قيم مؤكدة من فريق الـ backend لهلق، فعم تنعرض كحقل نص/رقم خام بدل ما
// نخمّن قائمة اختيارات غلط
const submissionConfigByBaseId = {
  "water-connection": {
    submitFn: submitWaterConnectionRequest,
    fields: [
      { name: "SerialSketchNumber", label: "Serial Sketch Number", type: "text" },
      { name: "PlotNumber", label: "Plot Number", type: "text" },
      { name: "LandNumber", label: "Land Number", type: "text" },
      { name: "LandArea", label: "Land Area", type: "number" },
      { name: "NoOfFloors", label: "No. of Floors", type: "number" },
      { name: "NoOfMeters", label: "No. of Meters", type: "number" },
      { name: "PremisesType", label: "Premises Type (code)", type: "number" },
      { name: "Latitude", label: "Latitude", type: "number" },
      { name: "Longitude", label: "Longitude", type: "number" },
      { name: "PlotPremiseId", label: "Plot Premise ID", type: "text" },
      { name: "RegionVillageId", label: "Region/Village ID", type: "text" },
      { name: "AlWilayaId", label: "Al-Wilaya", type: "alwilaya", wide: true },
      { name: "PropertyCertificate", label: "Property Certificate", type: "file" },
      { name: "CommercialRegistration", label: "Commercial Registration", type: "file" },
      { name: "SupportingDocuments", label: "Supporting Documents", type: "file" },
      { name: "ServiceDeliveryRequest", label: "Service Delivery Request", type: "file" },
      {
        name: "ConstructionCompletionCertificate",
        label: "Construction Completion Certificate",
        type: "file",
      },
      { name: "ConstructionPermit", label: "Construction Permit", type: "file" },
      { name: "AreaDrawingKrooki", label: "Area Drawing (Krooki)", type: "file" },
    ],
  },
  "tanker-license": {
    submitFn: submitTankerFillingLicenseRequest,
    fields: [
      { name: "OperatorName", label: "Operator Name", type: "text" },
      { name: "OperatorAddress", label: "Operator Address", type: "text" },
      { name: "Phone", label: "Phone", type: "tel" },
      { name: "VehicleInformation", label: "Vehicle Information", type: "text" },
      { name: "TradeLicenseNumber", label: "Trade License Number", type: "text" },
      { name: "TankCapacity", label: "Tank Capacity", type: "number" },
      { name: "TankerType", label: "Tanker Type (code)", type: "number" },
      { name: "GeographicArea", label: "Geographic Area (code)", type: "number" },
      { name: "OwnerIdFile", label: "Owner ID", type: "file" },
      { name: "TradeLicenseFile", label: "Trade License", type: "file" },
      { name: "VehicleOwnershipFile", label: "Vehicle Ownership", type: "file" },
    ],
  },
  noc: {
    submitFn: submitNocRequest,
    fields: [
      { name: "ProjectName", label: "Project Name", type: "text" },
      { name: "ProjectLocation", label: "Project Location", type: "text" },
      { name: "ProjectType", label: "Project Type (code)", type: "number" },
      { name: "SiteCondition", label: "Site Condition (code)", type: "number" },
      { name: "CompanyNameId", label: "Company Name ID", type: "text" },
      { name: "ApplicantNameId", label: "Applicant Name ID", type: "text" },
      { name: "FunctionalLocationId", label: "Functional Location ID", type: "text" },
      { name: "DrawingKrooki", label: "Drawing (Krooki)", type: "file" },
      { name: "NocLetterToMarafiq", label: "NOC Letter to Marafiq", type: "file" },
    ],
  },
};

// بدل ما ينقل لصفحة جديدة، هيدا المكون بيظهر مكان الشبكة بنفس صفحة Services
export default function ServiceDetail({ service, onBack }) {
  const { language } = useLanguage();
  const serviceDetailDict = translations[language].serviceDetail;
  const baseId = baseIdByServiceId[service.id] || service.id;
  const staticContent = serviceDetailDict[baseId] || serviceDetailDict.fallback;
  const submissionConfig = submissionConfigByBaseId[baseId];
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [apiCard, setApiCard] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getServiceCard(service.id)
      .then((result) => {
        if (!cancelled) setApiCard(result);
      })
      .catch(() => {
        // بيضل apiCard فاضي، الصفحة بترجع للنصوص الثابتة (fallback)
      });
    return () => {
      cancelled = true;
    };
  }, [service.id]);

  const mappedCard = mapServiceCard(apiCard, language);
  const content = {
    ...staticContent,
    title: mappedCard?.title || staticContent.title,
    estimatedTime: mappedCard?.estimatedTime || staticContent.estimatedTime,
    fees: mappedCard?.fees || staticContent.fees,
    eligibility: mappedCard?.eligibility || staticContent.eligibility,
    documents: mappedCard?.documents?.length ? mappedCard.documents : staticContent.documents,
  };
  const processDesc = mappedCard?.processDesc || serviceDetailDict.processDesc;
  const steps = mappedCard?.steps?.length ? mappedCard.steps : serviceDetailDict.steps;

  if (showApplyForm) {
    return (
      <section className="service-detail">
        <div className="service-detail-inner container">
          <ServiceApplicationForm
            title={(content.title || service.title).toUpperCase()}
            fields={submissionConfig?.fields || []}
            submitFn={submissionConfig?.submitFn}
            onBack={() => setShowApplyForm(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="service-detail">
      <div className="service-detail-inner container">
        <button type="button" className="service-back-link" onClick={onBack}>
          <BackArrowIcon />
        </button>
        <h1 className="service-detail-title">
          {content.title || service.title}
        </h1>

        <div
          className="service-detail-description"
          style={{ backgroundImage: `url(${service.image})` }}
        >
          <ul>
            {content.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="service-detail-columns">
          <div className="service-process-card">
            <h2>{serviceDetailDict.process}</h2>
            <p>{processDesc}</p>
            <ol className="service-steps">
              {steps.map((step, index) => (
                <li key={step}>
                  <span className="service-step-number">{index + 1}</span>
                  <span className="service-step-label">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="service-about-card">
            <div className="service-about-header">
              <h2>{serviceDetailDict.aboutService}</h2>
              <button
                type="button"
                className="apply-btn service-apply-btn"
                onClick={() => setShowApplyForm(true)}
              >
                {serviceDetailDict.applyNow}
              </button>
            </div>

            <div className="service-meta-row">
              <span className="service-meta-item">
                <ClockIcon />
                {serviceDetailDict.estimatedTime} <strong>{content.estimatedTime}</strong>
              </span>
              <span className="service-meta-item">
                <FeesIcon />
                {serviceDetailDict.fees} <strong>{content.fees}</strong>
              </span>
              <span className="service-meta-item">
                <EligibilityIcon />
                {serviceDetailDict.eligibility} <strong>{content.eligibility}</strong>
              </span>
            </div>

            <h3 className="service-documents-title">{serviceDetailDict.requiredDocuments}</h3>
            <ul className="service-documents">
              {content.documents.map((doc) => (
                <li key={doc}>
                  <DocumentIcon />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
