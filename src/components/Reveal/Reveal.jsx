import { useLayoutEffect, useRef, useState } from "react";
import "./Reveal.css";

// بيتحكم بأنيميشن الظهور (fade + slide up) لما العنصر يوصل لمجال الشاشة أثناء السكرول
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] =
    useState(false); /*هل العنصر لازم يكون ظاهر (بالأنيميشن) أو لا */
  const [instant, setInstant] =
    useState(false); /*هل لازم نلغي الأنيميشن مؤقتاً (فريم واحد بس) */

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // منستخدمها كمان أول تحميل وكمان كـ fallback: العنصر "لازم يبين" إذا وصلنا
    // لمجاله (طالع بالشاشة) أو حتى تخطيناه سكرول (طلع فوق الشاشة).
    const shouldBeVisible = () => node.getBoundingClientRect().top < window.innerHeight;

    // إذا العنصر أصلاً باين عالشاشة أول ما الصفحة تفتح (قبل ما المستخدم يعمل سكرول)،
    // منظهرو فورًا بلا أنيميشن (مرة وحدة بس، أول تحميل). بعدها بيرجع الأنيميشن
    // يشتغل عادي — منطفّي transition-duration لفريم واحد بس وبعدين منرجّعه.
    if (shouldBeVisible()) {
      setInstant(true);
      setVisible(true);
      requestAnimationFrame(() => setInstant(false));
      return undefined;
    }

    // منراقب العنصر لحد ما يفوت لمجال الشاشة أول مرة ومنظهرو — وبعدها منوقف
    // المراقبة، هيك العنصر بيضل ظاهر حتى لو المستخدم كمل سكرول وطلع العنصر
    // برا الشاشة (بدل ما يختفي من جديد ويبين الصفحة ناقصة/مش مظبوطة)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          cleanup();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);

    // fallback: بسكرول سريع جداً (flick بالتراك باد أو قفزة scrollbar)، الـ
    // IntersectionObserver ممكن ما يعاود يطلق أبداً للعناصر البعيدة عن موقع
    // السكرول الجديد (Chromium ممكن يتجاهل إعادة الحساب إلها)، فبيضل العنصر
    // مخفي للأبد رغم إنو المستخدم فوته. هيك بنتأكد بحدث scroll مباشرة كمان.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (shouldBeVisible()) {
          setVisible(true);
          cleanup();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    function cleanup() {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    return cleanup;
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? " reveal-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{
        ...style,
        ...(delay ? { transitionDelay: `${delay}ms` } : null),
        ...(instant ? { transitionDuration: "0s" } : null),
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
