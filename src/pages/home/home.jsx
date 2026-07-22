import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import { useLanguage } from "../../context/useLanguage";
import "./home.css";

// بيانات قسم الشكاوى (Complaints cards) — العنوان/الوصف بيجو من الترجمة
// عن طريق home.complaints.items.<id>
const complaints = [
  { id: "water-quality", theme: "teal" },
  { id: "water-leakage", theme: "peach" },
  { id: "meter-issues", theme: "blue" },
];

// ترجمة احتياطية لعناوين الخدمات لما الـ API يرجّع titleAr فاضي/null (حالياً
// معظم الخدمات ناقصها الترجمة العربية بقاعدة بيانات الباك اند) — لازم تنشال
// لما فريق المحتوى يعبّي titleAr الصحيح من عندهم
const SERVICE_TITLE_AR_FALLBACK = {
  "NOC Request": "طلب شهادة عدم ممانعة",
  "Tanker Filling License Request": "طلب ترخيص تعبئة الصهاريج",
  "Report Of Violation": "الإبلاغ عن مخالفة",
  "VAT Exemption Request": "طلب إعفاء من ضريبة القيمة المضافة",
  "Fire Hydrant Relocation Request": "طلب نقل صنبور إطفاء الحريق",
};

// صور محلية للخدمات (الـ API ما بترجع صور)، بتتكرر بالدور حسب ترتيب الخدمة
const SERVICE_IMAGES = [
  "/services/water-connection.png",
  "/services/tanker.png",
  "/services/water-meter.png",
  "/services/valve-disconnection.png",
  "/picture6.jpeg",
  "/picture5.jpeg",
];

// بيانات قسم الأسئلة الشائعة (FAQ accordion)
const FALLBACK_FAQS = [
  {
    id: "connection",
    question:
      "How can I apply for a new utility service connection with Marafiq?",
    answer:
      "You can apply through the online portal by submitting a service connection request along with the required documents.",
  },
  {
    id: "processing-time",
    question: "How long does it usually take to process a service request?",
    answer:
      "Processing times vary by service type, but most requests are reviewed and completed within a few business days.",
  },
  {
    id: "complaint",
    question:
      "What is the correct way to submit a complaint through the Marafiq website?",
    answer:
      "You can submit a complaint directly from the Complaints section, and our team will track it automatically until it's resolved.",
  },
  {
    id: "disruption",
    question:
      "What should I do if I experience a water supply issue or service disruption?",
    answer:
      "Report the issue immediately through the Complaints section or our hotline so our team can respond as quickly as possible.",
  },
];

// بيانات قسم الأخبار (News cards) — الكتابة بتبين بالـ hover بس
const FALLBACK_NEWS = [
  {
    id: "water-infrastructure",
    image: "/picture5.jpeg",
    date: "Mar 02 2026",
    title: "Marafiq Expands Water Infrastructure Across Muscat",
    description:
      "New projects aim to strengthen water distribution networks and improve service reliability for residential and industrial clients.",
  },
  {
    id: "national-forum",
    image: "/picture.jpeg",
    date: "Mar 05 2026",
    title: "Marafiq Supports National Forum on Child Development and Inclusion",
    description:
      "Marafiq strengthened its commitment to social development by sponsoring and participating in the Oman Childhood Conference & Exhibition 2, a …",
  },
  {
    id: "smart-monitoring",
    image: "/picture6.jpeg",
    date: "Feb 20 2026",
    title: "Marafiq Launches Smart Monitoring Center for Utility Operations",
    description:
      "The new control center enhances real-time monitoring and response across Marafiq's electricity, water, and steam networks.",
  },
];

// بيانات قسم اللوائح والأنظمة (APSR regulations) — العنوان/الفئة بيجو من
// الترجمة عن طريق home.regulations.items.<id>
const regulations = [
  { id: "water-service-policy", published: "May 2020" },
  { id: "customer-charter", published: "May 2020" },
  { id: "meter-installation-guidelines", published: "May 2020" },
];

// أيقونات SVG صغيرة مستخدمة داخل الصفحة
function QuestionMarksGraphic() {
  return (
    <div className="help-card-graphic">
      <img src="/pictuer2.svg" alt="" className="qm qm-small" />
      <img src="/pictuer1.svg" alt="" className="qm qm-large" />
    </div>
  );
}

function ChevronIcon({ direction = "right" }) {
  const { language } = useLanguage();
  const flipped = (language === "ar") !== (direction === "left");
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: flipped ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return <img src="/pdf.svg" alt="" className="file-icon" />;
}

function DownloadIcon() {
  return <img src="/download.svg" alt="" className="download-icon" />;
}

function AccordionChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="faq-chevron"
      style={{ transform: open ? "rotate(180deg)" : undefined }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// بيبرز أول وآخر كلمة بعنوان الهيرو (متل التصميم الأصلي)
function renderHeroTitle(title) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 1) return title;

  const first = words[0];
  const last = words[words.length - 1];
  const middle = words.slice(1, -1).join(" ");

  return (
    <>
      <span className="accent">{first}</span> {middle}{" "}
      <span className="accent">{last}</span>
    </>
  );
}

// الكومبوننت الرئيسي لصفحة الهوم
export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const trackRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const [aboutValues, setAboutvalues] = useState([]);
  const [services, setServices] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [bannerTitles, setBannerTitles] = useState(null);
  const bannerTitle =
    (language === "ar" ? bannerTitles?.ar : bannerTitles?.en) || t("home.bannerFallback");

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".service-card");
    const amount = card ? card.offsetWidth + 25 : 320;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // فتح/قفل فيديو "Watch & Discover": بمنع سكرول الصفحة وبيسكر بزر Escape
  useEffect(() => {
    const getData = async () => {
      try {
        const headers = {
          Accept: "application/json",
          "X-Api-Subscription-Key": "cda930e1-3058-4636-82ea-b5865dba219c",
          "X-Account-Id": "e98c7213-1879-f111-ab0f-7c1e52207175",
        };

        const [aboutRes, servicesRes, newsRes, faqsRes, bannerRes] =
          await Promise.all([
            fetch("/marafiq/api/v1/home-page/about-us", { headers }),
            fetch("/marafiq/api/v1/home-page/services", { headers }),
            fetch("/marafiq/api/v1/home-page/media-center", { headers }),
            fetch("/marafiq/api/v1/home-page/faqs", { headers }),
            fetch("/marafiq/api/v1/home-page/banner", { headers }),
          ]);

        if (
          !aboutRes.ok ||
          !servicesRes.ok ||
          !newsRes.ok ||
          !faqsRes.ok ||
          !bannerRes.ok
        ) {
          throw new Error("API Error");
        }

        const aboutData = await aboutRes.json();
        const servicesData = await servicesRes.json();
        const newsData = await newsRes.json();
        const faqsData = await faqsRes.json();
        const bannerData = await bannerRes.json();

        console.log("ABOUT:", aboutData);
        console.log("SERVICES:", servicesData);
        console.log("MEDIA CENTER:", newsData);
        console.log("FAQS:", faqsData);
        console.log("BANNER:", bannerData);

        // About
        setAboutvalues(aboutData?.result?.values || []);

        // Services
        setServices(servicesData?.result?.services || []);

        // Media Center
        const mediaNews =
          newsData?.result?.[0]?.news ??
          newsData?.result?.news ??
          newsData?.news ??
          [];

        console.log("MEDIA NEWS", mediaNews);

        setNewsItems(Array.isArray(mediaNews) ? mediaNews : []);

        // FAQs — منخزّن النسختين (عربي/إنكليزي) ومنختار الظاهرة وقت العرض
        // حسب اللغة الحالية، حتى ما نحتاج نطلب الـ API من جديد لما المستخدم يبدّل اللغة
        const faqsList =
          faqsData?.result?.faqs ?? faqsData?.result ?? faqsData?.faqs ?? [];

        setFaqs(
          Array.isArray(faqsList)
            ? faqsList.map((item, index) => ({
                id: index,
                questionEn: item.questionEnglish ?? item.question,
                questionAr: item.questionArabic,
                answerEn: item.answerEnglish ?? item.answer,
                answerAr: item.answerArabic,
              }))
            : [],
        );

        // Banner
        const bannerList = bannerData?.result ?? [];
        const bannerItem = Array.isArray(bannerList) ? bannerList[0] : bannerList;

        if (bannerItem?.titleEn || bannerItem?.titleAr) {
          setBannerTitles({ en: bannerItem?.titleEn, ar: bannerItem?.titleAr });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setNewsItems([]);
        setFaqs([]);
      }
    };

    getData();
  }, []);
  return (
    <div className="page-canvas">
      {/* قسم الهيرو (الصورة الكبيرة فوق + العنوان) */}
      <section className="hero">
        <div className="hero-content">
          <Reveal as="h1">{renderHeroTitle(bannerTitle)}</Reveal>
        </div>
      </section>

      {/* قسم "من نحن" (About) */}
      <section className="about">
        <div className="about-inner">
          <Reveal className="about-header">
            <p className="about-eyebrow">{t("home.about.eyebrow")}</p>
            <div className="about-header-row">
              <h2 className="about-title">{t("home.about.title")}</h2>
              <button
                type="button"
                className="view-more-btn"
                onClick={() => navigate("/about")}
              >
                {t("home.viewMore")}
              </button>
            </div>
          </Reveal>

          <div className="about-cards">
            {aboutValues.map((value, index) => (
              <Reveal
                key={value.valueId}
                className={`about-card ${
                  index === 0 ? "about-card-light" : "about-card-dark"
                }`}
                delay={index * 120}
              >
                <h3>{(language === "ar" && value.titleAr) || value.titleEn}</h3>

                <p>{(language === "ar" && value.descriptionAr) || value.descriptionEn}</p>

                {index === 0 && (
                  <img src="/Eaux.svg" alt="" className="about-card-icon" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الخدمات (Services carousel) */}
      <section className="services">
        <div className="services-inner">
          <Reveal className="services-header">
            <div className="services-header-text">
              <p className="services-eyebrow">{t("home.services.eyebrow")}</p>
              <h2 className="services-title">{t("home.services.title")}</h2>
              <p className="services-desc">{t("home.services.desc")}</p>
            </div>
            <button
              type="button"
              className="view-more-btn services-view-more"
              onClick={() => navigate("/services")}
            >
              {t("home.viewMore")}
            </button>
          </Reveal>

          <div className="services-carousel">
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              aria-label={t("home.services.prev")}
              onClick={() => scrollByCard(-1)}
            >
              <img
                src="/sahem2.svg"
                alt=""
                style={{ transform: language === "ar" ? "scaleX(-1)" : undefined }}
              />
            </button>

            <div className="services-track" ref={trackRef}>
              {services.map((service, index) => (
                <Reveal
                  key={service.serviceId}
                  as="article"
                  className="service-card"
                  delay={index * 100}
                  style={{
                    backgroundImage: `url(${
                      SERVICE_IMAGES[index % SERVICE_IMAGES.length]
                    })`,
                  }}
                >
                  <div className="service-card-overlay">
                    <h3>
                      {(language === "ar" &&
                        (service.titleAr || SERVICE_TITLE_AR_FALLBACK[service.titleEn])) ||
                        service.titleEn}
                    </h3>

                    <p>{(language === "ar" && service.descriptionAr) || service.descriptionEn}</p>

                    <button
                      type="button"
                      className="apply-btn"
                      onClick={() =>
                        navigate("/services", {
                          state: { serviceId: service.serviceId },
                        })
                      }
                    >
                      {t("home.services.applyNow")}
                      <ChevronIcon />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>

            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              aria-label={t("home.services.next")}
              onClick={() => scrollByCard(1)}
            >
              <img
                src="/sahem.svg"
                alt=""
                style={{ transform: language === "ar" ? "scaleX(-1)" : undefined }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* قسم "عندك سؤال" + قسم الشكاوى */}
      <section className="help">
        <img src="/grafic.svg" alt="" className="help-bg-graphic" />
        <div className="help-inner">
          <Reveal className="help-card">
            <div className="help-card-content">
              <h2>{t("home.help.title")}</h2>
              <p>{t("home.help.desc")}</p>
              <button
                type="button"
                className="send-inquiry-btn"
                onClick={() => navigate("/inquiry")}
              >
                {t("home.help.sendInquiry")}
              </button>
            </div>
            <QuestionMarksGraphic />
          </Reveal>

          <Reveal className="complaints" delay={120}>
            <div className="complaints-header">
              <p className="complaints-eyebrow">{t("home.complaints.eyebrow")}</p>
              <h2 className="complaints-title">{t("home.complaints.title")}</h2>
              <button
                type="button"
                className="view-more-btn complaints-view-more"
                onClick={() => navigate("/complaints/water-leakage")}
              >
                {t("home.viewMore")}
              </button>
              <p className="complaints-desc">{t("home.complaints.desc")}</p>
            </div>

            <div className="complaint-cards">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`complaint-card complaint-card-${complaint.theme}`}
                >
                  <div className="complaint-card-text">
                    <h3>{t(`home.complaints.items.${complaint.id}.title`)}</h3>
                    <p>{t(`home.complaints.items.${complaint.id}.description`)}</p>
                  </div>
                  <button
                    type="button"
                    className="submit-complaint-btn"
                    onClick={() => navigate("/complaints/water-leakage")}
                  >
                    {t("home.complaints.submit")}
                    <ChevronIcon />
                  </button>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* قسم الأخبار (News) + قسم "شاهد واكتشف" */}
      <section className="news-section">
        {/* الهيدر */}
        <Reveal as="div" className="news-header">
          <div>
            <p className="news-eyebrow">{t("home.news.eyebrow")}</p>
            <h2 className="news-title">{t("home.news.title")}</h2>
          </div>

          <button
            type="button"
            className="view-more-btn"
            onClick={() => navigate("/media")}
          >
            {t("home.viewMore")}
          </button>
        </Reveal>
        <div className="news-grid">
          {newsItems && newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <div
                key={index}
                className="news-card-wrap news-card-wrap-rounded"
              >
                <img
                  src={FALLBACK_NEWS[index % FALLBACK_NEWS.length].image}
                  alt=""
                  className="news-card"
                />
                <div className="news-overlay">
                  <div className="news-overlay-date">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>

                    <span>{item.date || ""}</span>
                  </div>

                  {/* الـ API ما عندو عنوان عربي للأخبار (بس newTitleEng)، فالعنوان بيضل إنكليزي */}
                  <h3 className="news-overlay-title">{item.newTitleEng}</h3>

                  <p className="news-overlay-desc">
                    {(language === "ar" && item.descriptionNewArabic) || item.descriptionNewEng}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>{t("home.news.empty")}</p>
          )}
        </div>

        {/* الصف الثاني: Watch & Discover + الفيديو */}
        <Reveal as="div" className="watch-grid">
          <div className="watch-text">
            <h2 className="watch-title">{t("home.watch.title")}</h2>
            <p className="watch-subtitle">{t("home.watch.subtitle")}</p>
            <p className="watch-desc">{t("home.watch.desc")}</p>
          </div>

          <div
            className="watch-video"
            style={{ backgroundImage: `url("/video.png")` }}
          >
            <button
              type="button"
              className="play-btn"
              aria-label={t("home.watch.playVideo")}
              onClick={() => setVideoOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </Reveal>
      </section>

      {/* قسم الأسئلة الشائعة (FAQ) */}
      <section className="faq">
        <img src="/grafic1.svg" alt="" className="faq-bg-graphic" />
        <div className="faq-inner">
          <Reveal className="faq-text">
            <p className="faq-eyebrow">{t("home.faq.eyebrow")}</p>
            <h2 className="faq-title">{t("home.faq.title")}</h2>
            <p className="faq-desc">{t("home.faq.desc")}</p>
            <button
              type="button"
              className="view-more-btn"
              onClick={() => navigate("/faq")}
            >
              {t("home.viewMore")}
            </button>
          </Reveal>

          <div className="faq-list">
            {faqs.map((item, index) => {
              const isOpen = index === openFaq;
              return (
                <div
                  key={item.id ?? index}
                  className={`faq-item${isOpen ? " faq-item-active" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  >
                    <span>{(language === "ar" && item.questionAr) || item.questionEn}</span>
                    <AccordionChevronIcon open={isOpen} />
                  </button>
                  {isOpen && (
                    <p className="faq-answer">{(language === "ar" && item.answerAr) || item.answerEn}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم اللوائح والأنظمة (APSR regulations) */}
      <section className="regulations">
        <div className="regulations-inner">
          <div className="regulations-header">
            <div>
              <p className="regulations-eyebrow">{t("home.regulations.eyebrow")}</p>
              <h2 className="regulations-title">{t("home.regulations.title")}</h2>
            </div>
            <button
              type="button"
              className="view-more-btn"
              onClick={() => navigate("/about")}
            >
              {t("home.viewMore")}
            </button>
          </div>

          <div className="regulations-grid">
            {regulations.map((item, index) => (
              <Reveal
                key={item.id}
                className="regulation-card"
                delay={index * 100}
              >
                <div className="regulation-header">
                  <FileIcon />
                  <h3 className="regulation-title">
                    {t(`home.regulations.items.${item.id}.title`)}
                  </h3>
                </div>
                <div className="regulation-meta">
                  <div className="regulation-meta-row">
                    <span className="regulation-meta-label">{t("home.regulations.category")}</span>
                    <span className="regulation-meta-value">
                      {t(`home.regulations.items.${item.id}.category`)}
                    </span>
                  </div>
                  <div className="regulation-meta-row">
                    <span className="regulation-meta-label">{t("home.regulations.published")}</span>
                    <span className="regulation-meta-value">
                      {item.published}
                    </span>
                  </div>
                </div>
                <div className="regulation-actions">
                  <button type="button" className="regulation-details-btn">
                    {t("home.regulations.viewDetails")}
                    <ChevronIcon />
                  </button>
                  <button type="button" className="regulation-download-btn">
                    <DownloadIcon />
                    {t("home.regulations.downloadPdf")}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* نافذة الفيديو المنبثقة (popup) — بتفتح لما نضغط زر التشغيل بقسم Watch & Discover */}
      {videoOpen && (
        <div
          className="video-modal-overlay"
          onClick={() => setVideoOpen(false)}
        >
          {/*منع إغلاق نافذة الفيديو عندما تضغط داخل صندوق الفيديو نفسه. */}
          <div
            className="video-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="video-modal-close"
              aria-label={t("home.watch.closeVideo")}
              onClick={() => setVideoOpen(false)}
            >
              &times;
            </button>
            <iframe
              className="video-modal-player"
              src="https://www.youtube.com/embed/gVr8-ZF4G-c?autoplay=1"
              title="Watch & Discover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
