import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import { useLanguage } from "../../context/useLanguage";
import { getAboutUs } from "../../api/aboutUs";
import "./Aboute.css";

// بيفكك نص قيمة واحد من الـ API "العنوان – الوصف" مفصول أسطر لمصفوفة
// {title, description} حتى تنعرض بنفس شكل values-grid الحالي
function parseValuesList(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split(/\s+–\s+/);
      return { title: title.trim(), description: rest.join(" – ").trim() };
    });
}

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

// سهم الرجوع جنب عنوان "ABOUT US"
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

// أيقونات التابات (Overview / Mission / Vision / Values)
function OverviewIcon() {
  return <img src="/Frame.svg" alt="" width="18" height="18" />;
}

function MissionIcon() {
  return <img src="/Frame (1).svg" alt="" width="18" height="18" />;
}

function VisionIcon() {
  return <img src="/Frame (2).svg" alt="" width="18" height="18" />;
}

function ValuesIcon() {
  return <img src="/Frame (3).svg" alt="" width="18" height="18" />;
}

// أيقونات كروت الإحصائيات
function CustomerIcon() {
  return <img src="/Frame 1597883938.svg" alt="" width="50" height="50" />;
}

function ElectricityIcon() {
  return <img src="/Frame 1597883938 (1).svg" alt="" width="50" height="50" />;
}

function WaterIcon() {
  return <img src="/Frame 1597883938 (2).svg" alt="" width="50" height="50" />;
}

function SustainabilityIcon() {
  return <img src="/Frame 1597883938 (3).svg" alt="" width="50" height="50" />;
}

// بيانات التابات — label بيتحدد بالترجمة الحالية بمكان الاستعمال
const tabs = [
  { id: "overview", labelKey: "aboutPage.tabs.overview", icon: OverviewIcon },
  { id: "mission", labelKey: "aboutPage.tabs.mission", icon: MissionIcon },
  { id: "vision", labelKey: "aboutPage.tabs.vision", icon: VisionIcon },
  { id: "values", labelKey: "aboutPage.tabs.values", icon: ValuesIcon },
];

const statIcons = [
  CustomerIcon,
  ElectricityIcon,
  WaterIcon,
  SustainabilityIcon,
];

// قسم Overview
function OverviewPanel({ data }) {
  const { t, language } = useLanguage();
  const stats = t("aboutPage.stats");

  const overviewDesc =
    (language === "ar"
      ? data?.overview?.descriptionAr
      : data?.overview?.descriptionEn) || "";
  const [overviewP1, overviewP2] = overviewDesc
    ? overviewDesc.split("\n\n")
    : [t("aboutPage.overviewP1"), t("aboutPage.overviewP2")];

  return (
    <div className="about-panel overview-panel">
      <Reveal className="overview-text">
        <h2 className="panel-heading">{t("aboutPage.whoWeAre")}</h2>
        <p>{overviewP1}</p>
        {overviewP2 && <p>{overviewP2}</p>}

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = statIcons[index];
            return (
              <div key={stat.label + index} className="stat-card">
                <span className="stat-icon">
                  <Icon />
                </span>
                <strong className="stat-value">{stat.value}</strong>
                {stat.label && <span className="stat-label">{stat.label}</span>}
                <span className="stat-caption">{stat.caption}</span>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Reveal
        className="overview-image"
        style={{ backgroundImage: `url("/services/Rectangle 40305.png")` }}
        delay={120}
      >
        <div className="overview-image-overlay">
          <h3>{t("aboutPage.overviewImageTitle")}</h3>
          <p>{t("aboutPage.overviewImageDesc")}</p>
        </div>
      </Reveal>
    </div>
  );
}

// قسم Our Mission
function MissionPanel({ data }) {
  const { t, language } = useLanguage();
  const title =
    (language === "ar" ? data?.mission?.titleAr : data?.mission?.titleEn) ||
    t("aboutPage.missionTitle");
  const text =
    (language === "ar"
      ? data?.mission?.descriptionAr
      : data?.mission?.descriptionEn) || t("aboutPage.missionText");
  return (
    <Reveal className="about-panel simple-panel">
      <h2 className="panel-heading">{title}</h2>
      <p>{text}</p>
    </Reveal>
  );
}

// قسم Our Vision
function VisionPanel({ data }) {
  const { t, language } = useLanguage();
  const title =
    (language === "ar" ? data?.vision?.titleAr : data?.vision?.titleEn) ||
    t("aboutPage.visionTitle");
  const text =
    (language === "ar"
      ? data?.vision?.descriptionAr
      : data?.vision?.descriptionEn) || t("aboutPage.visionText");
  return (
    <Reveal className="about-panel simple-panel">
      <h2 className="panel-heading">{title}</h2>
      <p>{text}</p>
    </Reveal>
  );
}

// قسم Our Values
function ValuesPanel({ data }) {
  const { t, language } = useLanguage();
  const valuesEntry = data?.values?.[0];
  const title =
    (language === "ar" ? valuesEntry?.titleAr : valuesEntry?.titleEn) ||
    t("aboutPage.valuesTitle");
  const parsedValues = parseValuesList(
    language === "ar" ? valuesEntry?.descriptionAr : valuesEntry?.descriptionEn,
  );
  const values = parsedValues.length ? parsedValues : t("aboutPage.values");
  return (
    <div className="about-panel values-panel">
      <h2 className="panel-heading">{title}</h2>
      <div className="values-grid">
        {values.map((value, index) => (
          <Reveal key={value.title} className="value-card" delay={index * 80}>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const panels = {
  overview: OverviewPanel,
  mission: MissionPanel,
  vision: VisionPanel,
  values: ValuesPanel,
};

export default function Aboute() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [aboutData, setAboutData] = useState(null);
  const ActivePanel = panels[activeTab];

  useEffect(() => {
    let cancelled = false;
    getAboutUs()
      .then((result) => {
        if (!cancelled) setAboutData(result);
      })
      .catch(() => {
        // بيبقى aboutData فاضي، الصفحة بترجع للنصوص الثابتة (fallback)
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const heroTitle =
    (language === "ar"
      ? aboutData?.aboutUs?.titleAr
      : aboutData?.aboutUs?.titleEn) || t("aboutPage.title");
  const heroSubtitle =
    (language === "ar"
      ? aboutData?.overview?.titleAr
      : aboutData?.overview?.titleEn) || t("aboutPage.subtitle");
  const heroDesc =
    (language === "ar"
      ? aboutData?.aboutUs?.descriptionAr
      : aboutData?.aboutUs?.descriptionEn) || t("aboutPage.desc");

  return (
    <div className="page-canvas">
      {/* شريط الـ breadcrumb (Home > About Us) */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">
            {t("aboutPage.breadcrumbCurrent")}
          </span>
        </div>
      </div>

      {/* قسم عنوان الصفحة */}
      <section className="about-hero">
        <div className="container">
          <Link to="/" className="about-back-link">
            <BackArrowIcon />
            <h1>{heroTitle}</h1>
          </Link>
          <p className="about-hero-subtitle">{heroSubtitle}</p>
          <p className="about-hero-desc">{heroDesc}</p>
        </div>
      </section>

      {/* شريط التابات (Overview / Our Mission / Our Vision / Our Values) */}
      <div className="about-tabs-bar">
        <div className="about-tabs-inner container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`about-tab${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* محتوى التاب الحالي */}
      <section className="about-content">
        <div className="container">
          <ActivePanel data={aboutData} />
        </div>
      </section>
    </div>
  );
}
