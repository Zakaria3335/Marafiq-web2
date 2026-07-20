import { useLanguage } from "../../context/useLanguage";

// سهم الرجوع جنب عنوان الخبر
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

function CalendarIcon() {
  return (
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
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 32 24" fill="currentColor">
      <path d="M0 24V14.4C0 6.4 4.8 1.2 12.8 0l1.6 3.2C9.6 4.8 7.2 8 7.2 11.2h6.4V24H0Zm17.6 0V14.4c0-8 4.8-13.2 12.8-14.4l1.6 3.2c-4.8 1.6-7.2 4.8-7.2 8h6.4V24H17.6Z" />
    </svg>
  );
}

const categoryBadgeClass = {
  News: "media-badge-news",
  Videos: "media-badge-videos",
  Announcements: "media-badge-announcements",
  Gallery: "media-badge-gallery",
};

// بدل ما ينقل لصفحة جديدة، هيدا المكون بيظهر مكان الشبكة بنفس صفحة Media
export default function NewsDetail({ item, onBack }) {
  const { t } = useLanguage();
  const baseId = item.id.replace(/-\d+$/, "");
  const content = t(baseId === "pipeline-maintenance" ? "newsDetail.featured" : "newsDetail.fallback");

  return (
    <section className="news-detail">
      <div className="news-detail-inner">
        <button type="button" className="news-back-link" onClick={onBack}>
          <BackArrowIcon />
        </button>
        <h1 className="news-detail-title">{item.title}</h1>

        <div
          className="news-detail-media"
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <span
            className={`media-badge ${categoryBadgeClass[item.category]}`}
          >
            {t(`mediaPage.categories.${item.category}`)}
          </span>
        </div>

        <div className="news-detail-meta">
          <span className="news-detail-meta-item">
            <CalendarIcon />
            {item.date}
          </span>
          <span className="news-detail-meta-divider" />
          <span className="news-detail-meta-item">
            <ClockIcon />
            {content.readTime}
          </span>
        </div>

        <div className="news-detail-body">
          <p className="news-detail-lead">{content.paragraphs[0]}</p>
          {content.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <blockquote className="news-detail-quote">
            <QuoteIcon />
            <p>{content.quote}</p>
            <footer>
              <span className="news-detail-quote-author">
                {content.author}
              </span>
              <span className="news-detail-quote-role">{content.role}</span>
            </footer>
          </blockquote>

          <p>{content.closing}</p>
        </div>
      </div>
    </section>
  );
}
