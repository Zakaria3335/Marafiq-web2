import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../../components/Reveal/Reveal";
import NewsDetail from "../NewsDetail/NewsDetail";
import { useLanguage } from "../../context/useLanguage";
import "./Media.css";
import "../NewsDetail/NewsDetail.css";

const PAGE_SIZE = 9;
const REPEAT_COUNT = 9;

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

// سهم الرجوع جنب عنوان "MEDIA CENTER"
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

function ChevronRightIcon({ direction = "right" }) {
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

function DropdownChevron() {
  return <img src="/services/Vector.svg" alt="" width="14" height="7" />;
}

function AllIcon() {
  return (
    <img
      src="/services/layout-dashboard (1) 1.svg"
      alt=""
      width="16"
      height="16"
    />
  );
}

function NewsIcon() {
  return <img src="/services/newspaper 1.svg" alt="" width="16" height="16" />;
}

function VideosIcon() {
  return (
    <img src="/services/square-play 1.svg" alt="" width="16" height="16" />
  );
}

function AnnouncementsIcon() {
  return <img src="/services/Frame.svg" alt="" width="16" height="16" />;
}

function GalleryIcon() {
  return <img src="/services/Frame (1).svg" alt="" width="16" height="16" />;
}

function GridViewIcon() {
  return (
    <img
      src="/services/layout-dashboard (1) 2.svg"
      alt=""
      width="16"
      height="16"
    />
  );
}

function ListViewIcon() {
  return <img src="/services/Frame (2).svg" alt="" width="16" height="16" />;
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// أنواع المحتوى (تابات الفلترة) — label بيتحدد بالترجمة الحالية بمكان الاستعمال
const categories = [
  { id: "All", icon: AllIcon },
  { id: "News", icon: NewsIcon },
  { id: "Videos", icon: VideosIcon },
  { id: "Announcements", icon: AnnouncementsIcon },
  { id: "Gallery", icon: GalleryIcon },
];

// عناصر المحتوى الأساسية (4 عناصر بتتكرر مشان تعبي الشبكة متل الفيغما) —
// العنوان بيجي من الترجمة عن طريق mediaPage.items.<baseId>.title
const baseItems = [
  { baseId: "pipeline-maintenance", category: "News", date: "Mar 05 2026", image: "/picture6.jpeg" },
  { baseId: "duqm-forum", category: "Gallery", date: "Mar 05 2026", image: "/picture.jpeg" },
  { baseId: "child-forum", category: "Announcements", date: "Mar 05 2026", image: "/picture5.jpeg" },
  {
    baseId: "ieee-forum",
    category: "Videos",
    date: "Mar 05 2026",
    image: "/video.png",
    videoId: "gVr8-ZF4G-c",
  },
];

function buildMediaItems(t) {
  return Array.from({ length: REPEAT_COUNT }, (_, round) =>
    baseItems.map((item) => ({
      ...item,
      title: t(`mediaPage.items.${item.baseId}.title`),
      id: `${item.baseId}-${round}`,
    })),
  ).flat();
}

const categoryBadgeClass = {
  News: "media-badge-news",
  Videos: "media-badge-videos",
  Announcements: "media-badge-announcements",
  Gallery: "media-badge-gallery",
};

export default function Media() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const mediaItems = useMemo(() => buildMediaItems(t), [t]);

  const filteredItems = useMemo(() => {
    const items =
      activeCategory === "All"
        ? mediaItems
        : mediaItems.filter((item) => item.category === activeCategory);
    return sortOrder === "Latest" ? items : [...items].reverse();
  }, [mediaItems, activeCategory, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, sortOrder]);

  // فتح/قفل فيديو التشغيل: بمنع سكرول الصفحة وبيسكر بزر Escape
  useEffect(() => {
    if (!activeVideo) return undefined;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  const rangeStart = filteredItems.length === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + PAGE_SIZE, filteredItems.length);

  return (
    <div className="page-canvas">
      {/* شريط الـ breadcrumb (Home > Media Center) أو (Home > Media Center > News > عنوان الخبر) */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          {selectedItem ? (
            <>
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => setSelectedItem(null)}
              >
                {t("mediaPage.breadcrumbCurrent")}
              </button>
              <BreadcrumbChevron />
              <button
                type="button"
                className="breadcrumb-link"
                onClick={() => setSelectedItem(null)}
              >
                {t(`mediaPage.categories.${selectedItem.category}`)}
              </button>
              <BreadcrumbChevron />
              <span className="breadcrumb-current">{selectedItem.title}</span>
            </>
          ) : (
            <span className="breadcrumb-current">{t("mediaPage.breadcrumbCurrent")}</span>
          )}
        </div>
      </div>

      {selectedItem ? (
        <NewsDetail
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
        />
      ) : (
        <>
      {/* قسم عنوان الصفحة */}
      <section className="media-hero">
        <div className="container">
          <Link to="/" className="media-back-link">
            <BackArrowIcon />
            <h1>{t("mediaPage.title")}</h1>
          </Link>
          <p className="media-hero-subtitle">{t("mediaPage.subtitle")}</p>
          <p className="media-hero-desc">{t("mediaPage.desc")}</p>
        </div>
      </section>

      {/* شريط التابات (All / News / Videos / Announcements / Gallery) */}
      <div className="media-tabs-bar">
        <div className="media-tabs-inner container">
          {categories.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`media-tab${activeCategory === tab.id ? " active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              <tab.icon />
              {t(`mediaPage.categories.${tab.id}`)}
            </button>
          ))}
        </div>
      </div>

      {/* شريط الأدوات: عدد النتائج + الفلاتر + تبديل العرض */}
      <section className="media-content">
        <div className="container">
          <div className="media-toolbar">
            <span className="media-results-count">
              {t("mediaPage.showingResults")
                .replace("{start}", rangeStart)
                .replace("{end}", rangeEnd)
                .replace("{total}", filteredItems.length)}
            </span>

            <div className="media-toolbar-controls">
              <label className="media-select">
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                >
                  {categories.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.id === "All" ? t("mediaPage.allCategories") : t(`mediaPage.categories.${tab.id}`)}
                    </option>
                  ))}
                </select>
                <DropdownChevron />
              </label>

              <label className="media-select">
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="Latest">{t("mediaPage.latest")}</option>
                  <option value="Oldest">{t("mediaPage.oldest")}</option>
                </select>
                <DropdownChevron />
              </label>

              <div className="media-view-toggle">
                <button
                  type="button"
                  className={viewMode === "grid" ? "active" : ""}
                  aria-label={t("mediaPage.gridView")}
                  onClick={() => setViewMode("grid")}
                >
                  <GridViewIcon />
                </button>
                <button
                  type="button"
                  className={viewMode === "list" ? "active" : ""}
                  aria-label={t("mediaPage.listView")}
                  onClick={() => setViewMode("list")}
                >
                  <ListViewIcon />
                </button>
              </div>
            </div>
          </div>

          {/* شبكة/لائحة عناصر المحتوى */}
          {visibleItems.length === 0 ? (
            <p className="media-empty">{t("mediaPage.noResults")}</p>
          ) : (
            <div
              className={`media-grid${viewMode === "list" ? " media-grid-list" : ""}`}
            >
              {visibleItems.map((item, index) => {
                const isVideo = item.category === "Videos";
                return (
                  <Reveal
                    key={item.id}
                    as="article"
                    className="media-card"
                    delay={(index % PAGE_SIZE) * 60}
                  >
                    <button
                      type="button"
                      className="media-card-media"
                      style={{ backgroundImage: `url(${item.image})` }}
                      onClick={() =>
                        isVideo ? setActiveVideo(item) : setSelectedItem(item)
                      }
                      aria-label={isVideo ? `${t("mediaPage.play")} ${item.title}` : item.title}
                    >
                      <span
                        className={`media-badge ${categoryBadgeClass[item.category]}`}
                      >
                        {t(`mediaPage.categories.${item.category}`)}
                      </span>
                      {isVideo && (
                        <span className="media-play-btn">
                          <PlayIcon />
                        </span>
                      )}
                    </button>

                    <div className="media-card-body">
                      <h3 className="media-card-title">{item.title}</h3>
                      <div className="media-card-footer">
                        <span className="media-card-date">
                          <CalendarIcon />
                          {item.date}
                        </span>
                        <button
                          type="button"
                          className="media-card-arrow"
                          aria-label={isVideo ? t("mediaPage.playVideo") : t("mediaPage.readMore")}
                          onClick={() =>
                            isVideo ? setActiveVideo(item) : setSelectedItem(item)
                          }
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* الترقيم (Pagination) */}
          {totalPages > 1 && (
            <div className="media-pagination">
              <button
                type="button"
                className="media-page-arrow"
                disabled={currentPage === 1}
                aria-label={t("mediaPage.prevPage")}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronRightIcon direction="left" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`media-page-number${
                      pageNumber === currentPage ? " active" : ""
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ),
              )}

              <button
                type="button"
                className="media-page-arrow"
                disabled={currentPage === totalPages}
                aria-label={t("mediaPage.nextPage")}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </div>
      </section>
        </>
      )}

      {/* نافذة الفيديو المنبثقة — تشغيل حقيقي لليوتيوب */}
      {activeVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="video-modal-close"
              aria-label={t("mediaPage.closeVideo")}
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
            <iframe
              className="video-modal-player"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1`}
              title={activeVideo.title}
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
