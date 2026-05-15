// ── Entry point ──────────────────────────────────────────────────────────────
// Imports data, renders dynamic content, and initialises components.

import { couple, ceremony, reception, hotel, directions } from './data/weddingData.js';
import { initRSVP }   from './components/rsvp.js';
import { initReveal } from './components/reveal.js';

// ── Render hero ───────────────────────────────────────────────────────────────
document.getElementById('hero-names').innerHTML =
  `${couple.partner1} <span class="hero__amp">&amp;</span> ${couple.partner2}`;

document.getElementById('hero-date').textContent =
  `${couple.date} · ${couple.location}`;

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
  <a href="${hotel.bookUrl}" class="btn btn--solid">Book Your Room</a>
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
  `${couple.date} · Charleston, SC`;

// ── Render RSVP deadline ──────────────────────────────────────────────────────
document.getElementById('rsvp-deadline').textContent =
  `Kindly Reply By ${couple.rsvpDeadline}`;

// ── Init components ───────────────────────────────────────────────────────────
initReveal();
initRSVP();
