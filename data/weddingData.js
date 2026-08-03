// ── All wedding content lives here ──────────────────────────────────────────
// Edit this file to update names, dates, venues, and links across the site.

export const couple = {
  partner1: 'Guadalupe',
  partner2: 'Orlando',
  date:     'April  16, 2027',
  location: 'Armadillo de los Infante, San Luis Potosí',
};

export const calendarEvent = {
  title: 'Guadalupe & Orlando\'s Wedding',
  location: 'Church of the Immaculate Conception, Calle Sta. Isabel 100, Armadillo de los Infante, San Luis Potosí, Mexico',
  startUtc: '20270416T220000Z',
  endUtc:   '20270417T050000Z',
  startIso: '2027-04-16T22:00:00Z',
  // Same moment as startUtc, in ISO form — used by the countdown bar.
  // 5:00 PM in Armadillo de los Infante (UTC-5 in April) = 22:00 UTC.
  startIso: '2027-04-16T22:00:00Z',
};

// ── Events shown as cards in the Details section ────────────────────────────
// Add, remove, or reorder entries here — main.js renders whatever is in this
// array, so no code change is needed for a fourth or fifth event.
// Every event needs: title, icon, time, venue, city.
// Optional — omit or set to null and the card leaves the line out:
//   address   street line above the city
//   day       small label under the title
//   mapUrl    "Map" button
//   venueUrl  "Venue Site" button
// With neither mapUrl nor venueUrl, the whole button row is skipped.
export const events = [
  {
    title:  { en: 'Ceremony', es: 'Ceremonia' },
    icon:       '✦',
    time:       '5:00 PM',
    venue:  { en: 'Church of the Immaculate Conception', es: 'Iglesia de la Inmaculada Concepción' },
    address:    'Calle Sta. Isabel 100',
    city:       'Armadillo de los Infante, S.L.P.',
    mapUrl:     'https://share.google/XOYjXNEYD3YMDzYut',
    venueUrl:   null,
  },
  {
    title:  { en: 'Reception', es: 'Recepción' },
    icon:       '✦',
    time:       '6:30 PM',
    venue:      'Armadillo Mágico',
    address:    'Calz. de Guadalupe 100',
    city:       'Armadillo de los Infante, S.L.P.',
    mapUrl:     'https://share.google/7gqOVWk8gIsvEzxKY',
    venueUrl:   'https://www.armadillomagico.com/',
  },
  {
    title:      'Tornaboda',
    day:        'Saturday, April 17',
    icon:       '✦',
    time:       '11:00 AM',
    venue:  { en: 'Garcia Family Home', es: 'Casa de la Familia García' },
    address:    null,          // no street address — card shows the city only
    city:       'Arroyo Hondo, S.L.P.',
    mapUrl:     'https://share.google/7gqOVWk8gIsvEzxKY',
    venueUrl:   null,
  },
];

// Kept so any older imports of `ceremony` / `reception` keep working.
export const [ceremony, reception] = events;

export const hotel = {
  name:       'Armadillo Mágico',
  address:    'Calz. de Guadalupe 100, 78980 Armadillo de los Infante, S.L.P.',
  phone:      '+52 444 106 0503',
  bookUrl:    'https://www.armadillomagico.com/hospedaje',
};

export const directions = {
  body: 'San Luis Potosí International Airport is the closest to the venue, roughly an hour away. It\'s also a convenient place to stay if you\'d prefer a larger city.',
  buttonUrl: 'https://maps.app.goo.gl/fw5m15a5ik2e1WFR8',
};