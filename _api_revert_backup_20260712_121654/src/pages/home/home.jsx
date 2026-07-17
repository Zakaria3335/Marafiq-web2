import { useEffect, useRef, useState } from "react";
import Reveal from "../../components/Reveal/Reveal";
import {
  getAboutUs,
  getBanner,
  getHomeServices,
  getHomepageFaqs,
  getMediaCenter,
} from "../../api/home";
import "./home.css";

// كل البيانات تحت (services/aboutValues/faqs/newsItems) هي fallback ثابت —
// بتظهر فوراً لحد ما يوصل رد حقيقي من الـ API (أو تضل ظاهرة إذا الطلب فشل)،
// عشان الصفحة ما تطلع فاضية أبداً حتى لو الـ API واقف مؤقتاً

// بيانات قسم الخدمات (Services carousel)
const FALLBACK_SERVICES = [
  {
    id: "water-connection",
    title: "Water Service Connection Request",
    description:
      "Request a new water connection for residential, commercial, or industrial properties.",
    image: "/services/water-connection.png",
  },
  {
    id: "tanker-license",
    title: "Tanker filling license request",
    description:
      "Apply for a license to operate and fill water tankers at approved facilities.",
    image: "/services/tanker.png",
  },
  {
    id: "water-meter",
    title: "Additional Water Meter",
    description:
      "Request additional utility meters based on increased demand or site requirements.",
    image: "/services/water-meter.png",
  },
  {
    id: "water-disconnection",
    title: "Permanent water disconnection",
    description:
      "Apply for permanent utility services for completed developments. Provides long-term, stable supply.",
    image: "/services/valve-disconnection.png",
  },
  {
    id: "electricity-connection",
    title: "Electricity Connection Request",
    description:
      "Request a new electricity connection for residential, commercial, or industrial properties.",
    image: "/picture6.jpeg",
  },
  {
    id: "steam-supply",
    title: "Steam Supply Agreement",
    description:
      "Apply for a steam supply agreement to support your industrial or commercial operations.",
    image: "/picture5.jpeg",
  },
];

// بيانات قسم "من نحن" (About) — كرت أول "فاتح" والباقي "غامق"
const FALLBACK_ABOUT = [
  {
    id: "powering",
    title: "POWERING WHAT MATTERS MOST",
    description:
      "At Marafiq, we are more than a utility provider, we are a partner in progress, committed to enabling growth, resilience, and sustainable value for Oman and beyond. We serve a diverse base of strategic clients, ensuring uninterrupted access to electricity, water, steam, and industrial gases, while supporting their focus on innovation and core business priorities.",
  },
  {
    id: "redefining",
    title: "REDEFINING",
    description:
      "Our mission goes beyond operations. We are working to redefine what a modern utility provider can be adaptive, purpose-driven…",
  },
  {
    id: "efficiency",
    title: "EFFICIENCY",
    description:
      "Since our founding in 2013, Marafiq has become a key contributor to national development by delivering integrated utility …",
  },
];

// بيانات قسم الشكاوى (Complaints cards)
const complaints = [
  {
    id: "water-quality",
    theme: "teal",
    title: "Water Quality",
    description: "Submit concerns about water taste, color, or smell.",
  },
  {
    id: "water-leakage",
    theme: "peach",
    title: "Water Leakage",
    description: "Report any leaks for quick repair.",
  },
  {
    id: "meter-issues",
    theme: "blue",
    title: "General Complaints & Meter Issues",
    description: "Any other issues related to services.",
  },
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

// بيانات قسم اللوائح والأنظمة (APSR regulations)
const regulations = [
  {
    id: "water-service-policy",
    title: "Water Service Policy",
    category: "Policy",
    published: "May 2020",
  },
  {
    id: "customer-charter",
    title: "Customer Charter",
    category: "Guideline",
    published: "May 2020",
  },
  {
    id: "meter-installation-guidelines",
    title: "Meter Installation\nGuidelines",
    category: "Regulation",
    published: "May 2020",
  },
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
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }}
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

// الكومبوننت الرئيسي لصفحة الهوم
export default function Home() {
  const trackRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const [bannerTitle, setBannerTitle] = useState(null);
  const [aboutValues, setAboutValues] = useState(FALLBACK_ABOUT);
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [newsItems, setNewsItems] = useState(FALLBACK_NEWS);
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);

  // بنجيب محتوى الصفحة الرئيسية من الـ API الحقيقي. لو الطلب فشل (مثلاً
  // السيرفر لسا مقفول)، بيضل الـ fallback الثابت ظاهر بدل ما تطلع الصفحة فاضية.
  useEffect(() => {
    getBanner()
      .then((rows) => {
        const title = rows?.[0]?.titleEn;
        if (title) setBannerTitle(title);
      })
      .catch(() => {});

    getAboutUs()
      .then((data) => {
        if (data?.values?.length) {
          setAboutValues(
            data.values.map((value) => ({
              id: value.valueId,
              title: value.titleEn,
              description: value.descriptionEn,
            })),
          );
        }
      })
      .catch(() => {});

    getHomeServices()
      .then((data) => {
        if (data?.services?.length) {
          setServices(
            data.services.map((service, index) => ({
              id: service.serviceId,
              title: service.titleEn,
              description: service.descriptionEn,
              image: FALLBACK_SERVICES[index % FALLBACK_SERVICES.length].image,
            })),
          );
        }
      })
      .catch(() => {});

    getMediaCenter()
      .then((data) => {
        const news = data?.[0]?.news;
        if (news?.length) {
          setNewsItems(
            news.map((item, index) => ({
              id: `news-${index}`,
              image: FALLBACK_NEWS[index % FALLBACK_NEWS.length].image,
              date: item.date
                ? new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "",
              title: item.newTitleEng || item.name,
              description: item.descriptionNewEng,
            })),
          );
        }
      })
      .catch(() => {});

    getHomepageFaqs()
      .then((data) => {
        if (data?.faqs?.length) {
          setFaqs(
            data.faqs.map((item, index) => ({
              id: `faq-${index}`,
              question: item.questionEnglish,
              answer: item.answerEnglish,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".service-card");
    const amount = card ? card.offsetWidth + 25 : 320;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // فتح/قفل فيديو "Watch & Discover": بمنع سكرول الصفحة وبيسكر بزر Escape
  useEffect(() => {
    if (!videoOpen) return undefined;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [videoOpen]);

  return (
    <div className="page-canvas">
      {/* قسم الهيرو (الصورة الكبيرة فوق + العنوان) */}
      <section className="hero">
        <div className="hero-content">
          {bannerTitle ? (
            <Reveal as="h1">{bannerTitle}</Reveal>
          ) : (
            <Reveal as="h1">
              <span className="accent">Engineering</span> the Foundations of
              <br />
              Sustainable <span className="accent">Growth</span>
            </Reveal>
          )}
        </div>
      </section>

      {/* قسم "من نحن" (About) */}
      <section className="about">
        <div className="about-inner">
          <Reveal className="about-header">
            <p className="about-eyebrow">about us</p>
            <div className="about-header-row">
              <h2 className="about-title">WHO WE ARE ?</h2>
              <button type="button" className="view-more-btn">
                View More
              </button>
            </div>
          </Reveal>

          <div className="about-cards">
            {aboutValues.map((value, index) => (
              <Reveal
                key={value.id}
                className={`about-card ${index === 0 ? "about-card-light" : "about-card-dark"}`}
                delay={index * 120}
              >
                <h3>{value.title}</h3>
                <p>{value.description}</p>
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
              <p className="services-eyebrow">services</p>
              <h2 className="services-title">POWERING YOUR NEEDS</h2>
              <p className="services-desc">
                Explore our range of utility services designed to ensure
                reliable, efficient, and compliant
                <br />
                solutions for every need.
              </p>
            </div>
            <button type="button" className="view-more-btn services-view-more">
              View More
            </button>
          </Reveal>

          <div className="services-carousel">
            <button
              type="button"
              className="carousel-arrow carousel-arrow-prev"
              aria-label="Previous services"
              onClick={() => scrollByCard(-1)}
            >
              <img src="/sahem2.svg" alt="" />
            </button>

            <div className="services-track" ref={trackRef}>
              {services.map((service, index) => (
                <Reveal
                  key={service.id}
                  as="article"
                  className="service-card"
                  delay={index * 100}
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className="service-card-overlay">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <button type="button" className="apply-btn">
                      Apply Now
                      <ChevronIcon />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>

            <button
              type="button"
              className="carousel-arrow carousel-arrow-next"
              aria-label="Next services"
              onClick={() => scrollByCard(1)}
            >
              <img src="/sahem.svg" alt="" />
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
              <h2>
                HAVE A
                <br />
                QUESTION?
                <br />
                WE&rsquo;RE HERE
                <br />
                TO HELP
              </h2>
              <p>
                Submit your inquiries easily and get quick, reliable responses
                from Marafiq. Whether it&rsquo;s about services, billing, or
                general information, we&rsquo;re committed to assisting you
                promptly.
              </p>
              <button type="button" className="send-inquiry-btn">
                Send Inquiry
              </button>
            </div>
            <QuestionMarksGraphic />
          </Reveal>

          <Reveal className="complaints" delay={120}>
            <div className="complaints-header">
              <p className="complaints-eyebrow">complaints</p>
              <h2 className="complaints-title">REPORT NOW</h2>
              <button
                type="button"
                className="view-more-btn complaints-view-more"
              >
                View More
              </button>
              <p className="complaints-desc">
                Submit your complaint quickly and easily, each issue is tracked
                automatically until it&rsquo;s resolved. We&rsquo;re committed
                to handling your concerns promptly.
              </p>
            </div>

            <div className="complaint-cards">
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={`complaint-card complaint-card-${complaint.theme}`}
                >
                  <div className="complaint-card-text">
                    <h3>{complaint.title}</h3>
                    <p>{complaint.description}</p>
                  </div>
                  <button type="button" className="submit-complaint-btn">
                    Submit Complaint
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
            <p className="news-eyebrow">media center</p>
            <h2 className="news-title">NEWS THAT MATTERS</h2>
          </div>
          <button type="button" className="view-more-btn">
            View More
          </button>
        </Reveal>

        {/* الصف الأول: 3 كروت */}
        <div className="news-grid">
          {newsItems.map((item, index) => (
            <Reveal
              key={item.id}
              className="news-card-wrap news-card-wrap-rounded"
              delay={index * 100}
            >
              <img src={item.image} alt="" className="news-card" />
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
                  <span>{item.date}</span>
                </div>
                <h3 className="news-overlay-title">{item.title}</h3>
                <p className="news-overlay-desc">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* الصف الثاني: Watch & Discover + الفيديو */}
        <Reveal as="div" className="watch-grid">
          <div className="watch-text">
            <h2 className="watch-title">WATCH &amp; DISCOVER</h2>
            <p className="watch-subtitle">Our Lares Videos in one place</p>
            <p className="watch-desc">
              Discover a wide collection of videos that showcase our latest
              updates, featured products, and special moments from our brand. In
              this section, you can watch engaging content that highlights our
              work, our vision, and everything happening behind the scenes.
            </p>
          </div>

          <div
            className="watch-video"
            style={{ backgroundImage: `url("/video.png")` }}
          >
            <button
              type="button"
              className="play-btn"
              aria-label="Play video"
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
            <p className="faq-eyebrow">faq&rsquo;s</p>
            <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
            <p className="faq-desc">
              Find quick answers to the most common questions about our
              services,
              <br />
              billing, and processes all in one place.
            </p>
            <button type="button" className="view-more-btn">
              View More
            </button>
          </Reveal>

          <div className="faq-list">
            {faqs.map((item, index) => {
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
        </div>
      </section>

      {/* قسم اللوائح والأنظمة (APSR regulations) */}
      <section className="regulations">
        <div className="regulations-inner">
          <div className="regulations-header">
            <div>
              <p className="regulations-eyebrow">APSR regulations</p>
              <h2 className="regulations-title">
                TRANSPARENT. RELIABLE. REGULATED.
              </h2>
            </div>
            <button type="button" className="view-more-btn">
              View More
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
                  <h3 className="regulation-title">{item.title}</h3>
                </div>
                <div className="regulation-meta">
                  <div className="regulation-meta-row">
                    <span className="regulation-meta-label">Category</span>
                    <span className="regulation-meta-value">
                      {item.category}
                    </span>
                  </div>
                  <div className="regulation-meta-row">
                    <span className="regulation-meta-label">Published</span>
                    <span className="regulation-meta-value">
                      {item.published}
                    </span>
                  </div>
                </div>
                <div className="regulation-actions">
                  <button type="button" className="regulation-details-btn">
                    View Details
                    <ChevronIcon />
                  </button>
                  <button type="button" className="regulation-download-btn">
                    <DownloadIcon />
                    Download PDF
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
              aria-label="Close video"
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
