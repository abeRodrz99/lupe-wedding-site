// ── Scroll-reveal component ──────────────────────────────────────────────────
// Adds .is-visible to .section elements as they enter the viewport,
// triggering the fadeUp animation defined in base.css.

export function initReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  sections.forEach((section) => observer.observe(section));
}
