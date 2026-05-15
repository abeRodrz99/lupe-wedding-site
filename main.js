// ── Entry point ──────────────────────────────────────────────────────────────
import { couple, ceremony, reception, hotel, directions, calendarEvent } from './data/weddingData.js';
import { initRSVP }   from './components/rsvp.js';
import { initReveal } from './components/reveal.js';

// ── Render hero ───────────────────────────────────────────────────────────────
document.getElementById('hero-names').innerHTML =
  `${couple.partner1} <span class="hero__amp">&amp;</span> ${couple.partner2}`;

document.getElementById('hero-date').textContent =
  `${couple.date} · ${couple.location}`;

// ── Render calendar button ────────────────────────────────────────────────────
function renderCalendarButton(event) {
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent(event.title)}`
    + `&dates=${event.startUtc}/${event.endUtc}`
    + `&location=${encodeURIComponent(event.location)}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DTSTART:${event.startUtc}`,
    `DTEND:${event.endUtc}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const icsBlob = new Blob([icsContent], { type: 'text/calendar' });
  const icsUrl  = URL.createObjectURL(icsBlob);

  document.getElementById('calendar-button').innerHTML = `
    <div class="cal-wrap">
      <button class="cal-trigger" id="calBtn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        + Add to Calendar
        <svg class="cal-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div class="cal-dropdown" id="calDropdown">
        <a href="${googleUrl}" class="cal-option" target="_blank" rel="noopener">
          <div class="cal-icon cal-icon--google">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <div class="cal-label">
            <span class="cal-label-main">Google Calendar</span>
            <span class="cal-label-sub">Opens in browser</span>
          </div>
        </a>
        <a href="${icsUrl}" class="cal-option" download="wedding.ics">
          <div class="cal-icon cal-icon--apple">
            <svg width="14" height="16" viewBox="0 0 814 1000" fill="white">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 69.4 0 126.9 45.6 170.3 45.6 41.3 0 106.3-48.1 183.7-48.1 14.1 0 130.9 1.3 195.1 98.4zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
          </div>
          <div class="cal-label">
            <span class="cal-label-main">Apple / Outlook</span>
            <span class="cal-label-sub">Downloads .ics file</span>
          </div>
        </a>
      </div>
    </div>
  `;

  const btn  = document.getElementById('calBtn');
  const drop = document.getElementById('calDropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('open');
    drop.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    btn.classList.remove('open');
    drop.classList.remove('open');
  });
}

renderCalendarButton(calendarEvent);

// ── Render event cards ────────────────────────────────────────────────────────
function renderCard(event) {
  return `
    <div class="card">
      <div class="card__icon">${event.icon}</div>
      <p class="card__tag">${event.title}</p>
      <p class="card__time">${event.time}</p>
      <p class="card__venue">${event.venue}</p>
      <p class="card__address">${event.address}<br>${event.city}</p>
      <div class="card__actions">
        <a href="${event.mapUrl}" class="btn btn--outline" target="_blank" rel="noopener">Map</a>
        ${event.venueUrl ? `<a href="${event.venueUrl}" class="btn btn--outline">Venue Site</a>` : ''}
      </div>
    </div>
  `;
}

document.getElementById('cards').innerHTML =
  renderCard(ceremony) + renderCard(reception);

// ── Render hotel ──────────────────────────────────────────────────────────────
document.getElementById('hotel-block').innerHTML = `
  <p class="hotel__tag">Reserve Your Room</p>
  <h3 class="hotel__name">${hotel.name}</h3>
  <p class="hotel__address">${hotel.address}</p>
  <dl class="hotel__meta">
    <div class="hotel__meta-row"><dt>Block Code</dt><dd>${hotel.blockCode}</dd></div>
    <div class="hotel__meta-row"><dt>Book By</dt><dd>${hotel.bookBy}</dd></div>
    <div class="hotel__meta-row"><dt>Phone</dt><dd>${hotel.phone}</dd></div>
  </dl>
  <a href="${hotel.bookUrl}" class="btn btn--gold">Book Your Room</a>
`;

// ── Render directions ─────────────────────────────────────────────────────────
const dir = document.getElementById('directions-body');
dir.innerHTML = `
  <p>${directions.body}</p>
  ${directions.buttonUrl ? `<a href="${directions.buttonUrl}" class="btn btn--outline" target="_blank" rel="noopener">Get Directions</a>` : ''}
`;

// ── Render footer ─────────────────────────────────────────────────────────────
document.getElementById('footer-names').textContent =
  `${couple.partner1} & ${couple.partner2}`;

document.getElementById('footer-sub').textContent =
  `${couple.date} · Armadillo de los Infante, San Luis Potosí`;

// ── Render RSVP deadline ──────────────────────────────────────────────────────
document.getElementById('rsvp-deadline').textContent =
  `Kindly Reply By ${couple.rsvpDeadline}`;

// ── Init components ───────────────────────────────────────────────────────────
initReveal();
initRSVP();