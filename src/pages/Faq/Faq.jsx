import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import { useLanguage } from "../../context/useLanguage";
import { getHomeFaqs } from "../../api/faqs";
import "./Faq.css";

const PAGE_SIZE = 6;

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

// سهم الرجوع جنب عنوان "QUESTION & CLARIFICATIONS"
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

function PageChevronIcon({ direction = "right" }) {
  const { language } = useLanguage();
  const flipped = (language === "ar") !== (direction === "left");
  return (
    <svg
      width="14"
      height="14"
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

// رسمة "علامة استفهام كبيرة + شخص + تروس + فقاعة كلام"
function QuestionIllustration() {
  return (
    <div className="faq-illustration">
      <img
        src="/services/Group 1597883322.svg"
        alt=""
        className="faq-illustration-img"
      />
    </div>
  );
}

function buildFaqs(t) {
  const base = t("faqPage.items").map((item, index) => ({ ...item, baseId: index }));
  return Array.from({ length: 3 }, (_, round) =>
    base.map((item) => ({ ...item, id: `${item.baseId}-${round}` })),
  ).flat();
}

export default function Faq() {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getHomeFaqs()
      .then((result) => {
        if (!cancelled) setApiData(result);
      })
      .catch(() => {
        // بيضل apiData فاضي، الصفحة بترجع للأسئلة الثابتة (fallback)
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stillHaveQuestion =
    (language === "ar" ? apiData?.faqPageTitleArabic : apiData?.faqPageTitleEng) ||
    t("faqPage.stillHaveQuestion");
  const stillHaveQuestionDesc =
    (language === "ar" ? apiData?.faqPageDescriptionArabic : apiData?.faqPageDescriptionEng) ||
    t("faqPage.stillHaveQuestionDesc");

  const faqs = apiData?.faqs?.length
    ? apiData.faqs.map((item, index) => ({
        id: index,
        question: language === "ar" ? item.questionArabic : item.questionEnglish,
        answer: language === "ar" ? item.answerArabic : item.answerEnglish,
      }))
    : buildFaqs(t);
  const totalPages = Math.max(1, Math.ceil(faqs.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleFaqs = useMemo(
    () => faqs.slice(startIndex, startIndex + PAGE_SIZE),
    [faqs, startIndex],
  );

  useEffect(() => {
    setOpenFaq(0);
  }, [page]);

  return (
    <div className="page-canvas">
      {/* شريط الـ breadcrumb (Home > FAQ's) */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("faqPage.breadcrumbCurrent")}</span>
        </div>
      </div>

      {/* قسم عنوان الصفحة */}
      <section className="faq-page-hero">
        <div className="container">
          <Link to="/" className="faq-page-back-link">
            <BackArrowIcon />
            <h1>{t("faqPage.title")}</h1>
          </Link>
          <p className="faq-page-subtitle">{t("faqPage.subtitle")}</p>
          <p className="faq-page-desc">{t("faqPage.desc")}</p>
        </div>
      </section>

      {/* الجسم: كرت "Still Have a Question" + قائمة الأسئلة */}
      <section className="faq-page-body">
        <div className="faq-page-body-inner container">
          <Reveal className="faq-question-card">
            <div className="faq-question-card-text">
              <h2>{stillHaveQuestion}</h2>
              <p>{stillHaveQuestionDesc}</p>
              <button type="button" className="faq-inquiry-btn">
                {t("faqPage.goToInquiry")}
              </button>
            </div>
            <QuestionIllustration />
          </Reveal>

          <div className="faq-page-list-wrap">
            <div className="faq-page-list">
              {visibleFaqs.map((item, index) => {
                const isOpen = index === openFaq;
                return (
                  <div
                    key={item.id}
                    className={`faq-item${isOpen ? " faq-item-active" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <AccordionChevronIcon open={isOpen} />
                    </button>
                    {isOpen && <p className="faq-answer">{item.answer}</p>}
                  </div>
                );
              })}
            </div>

            {/* الترقيم (Pagination) */}
            {totalPages > 1 && (
              <div className="faq-pagination">
                <button
                  type="button"
                  className="faq-page-arrow"
                  disabled={page === 1}
                  aria-label={t("faqPage.prevPage")}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <PageChevronIcon direction="left" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`faq-page-number${
                        pageNumber === page ? " active" : ""
                      }`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  className="faq-page-arrow"
                  disabled={page === totalPages}
                  aria-label={t("faqPage.nextPage")}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <PageChevronIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
