// ── Countdown bar + scroll-swap nav ─────────────────────────────────────────
// Shows a live months / days / hours countdown to the ceremony in the fixed top
// slot. Once the visitor scrolls past the hero the countdown slides out and the
// site nav slides in to replace it; scrolling back up restores the countdown.
// Styles live in ../styles/countdown.css

/* ── Calendar math ─────────────────────────────────────────────────────────
   Months are calendar months, not fixed 30-day blocks, so "3 months" always
   lands on the same day-of-month. Day-of-month overflow is clamped
   (Jan 31 + 1 month → Feb 28).

   All arithmetic is done in UTC on purpose: doing it in the visitor's local
   calendar makes the split drift by an hour across a DST boundary, so two
   guests in different time zones would see different numbers for the same
   moment. In UTC everyone sees the same countdown.                        */

function addMonths(date, months) {
  const d = new Date(date.getTime());
  const targetDay = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const daysInTargetMonth = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  ).getUTCDate();
  d.setUTCDate(Math.min(targetDay, daysInTargetMonth));
  return d;
}

export function timeUntil(target, now = new Date()) {
  if (target <= now) return { past: true, months: 0, days: 0, hours: 0 };

  // Largest whole number of calendar months that doesn't overshoot the target.
  let months =
    (target.getUTCFullYear() - now.getUTCFullYear()) * 12 +
    (target.getUTCMonth() - now.getUTCMonth());
  if (months < 0) months = 0;
  while (months > 0 && addMonths(now, months) > target) months--;
  while (addMonths(now, months + 1) <= target) months++;

  const remainder = target - addMonths(now, months);
  const days  = Math.floor(remainder / 86400000);
  const hours = Math.floor((remainder % 86400000) / 3600000);

  return { past: false, months, days, hours };
}

const plural = (n, word) => `${word}${n === 1 ? '' : 's'}`;

// ── Init ────────────────────────────────────────────────────────────────────

export function initCountdown({
  targetIso,
  countdownSelector = '#countdown-bar',
  navSelector       = '#site-nav',
  heroSelector      = '.hero',
} = {}) {
  const bar = document.querySelector(countdownSelector);
  const nav = document.querySelector(navSelector);
  if (!bar || !nav || !targetIso) return;

  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) return;

  const inner    = bar.querySelector('.countdown');
  const valueEls = {
    months: bar.querySelector('[data-unit="months"] .countdown__value'),
    days:   bar.querySelector('[data-unit="days"]   .countdown__value'),
    hours:  bar.querySelector('[data-unit="hours"]  .countdown__value'),
  };
  const labelEls = {
    months: bar.querySelector('[data-unit="months"] .countdown__unit-label'),
    days:   bar.querySelector('[data-unit="days"]   .countdown__unit-label'),
    hours:  bar.querySelector('[data-unit="hours"]  .countdown__unit-label'),
  };

  // ── Tick ────────────────────────────────────────────────────────────────
  let timerId = null;

  function tick() {
    const t = timeUntil(target);

    if (t.past) {
      inner.classList.add('countdown--today');
      bar.setAttribute('aria-label', 'The wedding day has arrived');
      if (timerId) clearInterval(timerId);
      timerId = null;
      return;
    }

    valueEls.months.textContent = t.months;
    valueEls.days.textContent   = t.days;
    valueEls.hours.textContent  = t.hours;

    labelEls.months.textContent = plural(t.months, 'Month');
    labelEls.days.textContent   = plural(t.days, 'Day');
    labelEls.hours.textContent  = plural(t.hours, 'Hour');

    bar.setAttribute(
      'aria-label',
      `${t.months} ${plural(t.months, 'month')}, ${t.days} ${plural(t.days, 'day')} ` +
      `and ${t.hours} ${plural(t.hours, 'hour')} until the wedding`
    );
  }

  tick();
  // Hours are the smallest unit shown, so a once-a-minute tick is plenty.
  timerId = setInterval(tick, 60000);

  // Pause while the tab is hidden, resync on return.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timerId);
      timerId = null;
    } else if (!timerId) {
      tick();
      timerId = setInterval(tick, 60000);
    }
  });

  // ── Scroll swap ─────────────────────────────────────────────────────────
  const HYSTERESIS = 80;   // px of slack so the bars don't flicker at the seam
  let navShown = null;

  function threshold() {
    const hero = document.querySelector(heroSelector);
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    // Swap once the hero is essentially off screen, with a sane fallback.
    return Math.max(heroBottom - bar.offsetHeight, window.innerHeight * 0.6);
  }

  let limit = threshold();

  const show = (el) => { el.dataset.state = 'shown';  };
  const hide = (el) => { el.dataset.state = 'hidden'; };

  function apply(showNav) {
    if (showNav === navShown) return;
    navShown = showNav;
    if (showNav) { hide(bar); show(nav); }
    else         { hide(nav); show(bar); }
  }

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (!navShown && y > limit)                  apply(true);
    else if (navShown && y < limit - HYSTERESIS) apply(false);

    const scrolled = y > 8;
    bar.classList.toggle('scrolled', scrolled);
    nav.classList.toggle('scrolled', scrolled);
  }

  apply(false);           // countdown visible, nav parked above the fold

  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        onScroll();
      });
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    limit = threshold();
    onScroll();
  }, { passive: true });

  onScroll();             // handle a restored scroll position on reload

  // ── Active section highlighting in the nav ──────────────────────────────
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${entry.target.id}`
            )
          );
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
  }
}