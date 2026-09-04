// ── Long-form prose, declared first so the object below can reference them ──
const directionsEn = "San Luis Potosí International Airport is the closest to the venue, roughly an hour away. It's also a convenient place to stay if you'd prefer a larger city.";
const directionsEs = 'El Aeropuerto Internacional de San Luis Potosí es el más cercano al lugar, a aproximadamente una hora. También es una buena opción de hospedaje si prefieres una ciudad más grande.';

export const strings = {
  en: {
    // Nav
    'nav.details': 'Details', 'nav.travel': 'Travel', 'nav.rsvp': 'RSVP', 'nav.faq': 'FAQ',

    // Countdown
    'countdown.month': 'Month',  'countdown.months': 'Months',
    'countdown.day':   'Day',    'countdown.days':   'Days',
    'countdown.hour':  'Hour',   'countdown.hours':  'Hours',
    'countdown.label': 'Until we say I do',
    'countdown.today': 'Today is the day',
    'countdown.and': 'and',
    'countdown.ariaTail': 'until the wedding',
    'countdown.arrived': 'The wedding day has arrived',

    // Hero
    'hero.together': 'Together with their families', 'hero.invite': 'invite you to their wedding',
    'hero.calendarBtn': '+ Add to Calendar', 'hero.google': 'Google Calendar', 'hero.apple': 'Apple / Outlook',

    // Details
    'details.label': 'The Wedding', 'details.heading': 'Details',
    'card.map': 'Map', 'card.venueSite': 'Venue Site',

    // Travel
    'travel.label': 'Travel & Stay', 'travel.heading': 'Getting There',
    'travel.reserveRoom': 'Reserve Your Room', 'travel.visitWebsite': 'Visit Website', 'travel.phone': 'Phone', 'travel.bookingCode': 'Booking Code',
    'travel.gettingHere': 'Getting Here', 'travel.getDirections': 'Get Directions',
    'directions.body': directionsEn,

    // RSVP
    'rsvp.heading': 'RSVP', 'rsvp.deadlinePrefix': 'Kindly Reply By',
    'rsvp.nameLabel': 'First & Last Name', 'rsvp.namePlaceholder': 'Emma & James Smith',
    'rsvp.contactLabel': 'Email Address', 'rsvp.contactPlaceholder': 'your@email.com',
    'rsvp.attendingLabel': 'Attending?', 'rsvp.accept': 'Joyfully Accepts', 'rsvp.decline': 'Regretfully Declines',
    'rsvp.guestsLabel':  'Guests', 'rsvp.guestMany': '{n} People', 'rsvp.guestOne': '1 Person', 'rsvp.guestNamesLabel': 'Names of your guests', 'rsvp.guestPlaceholder': 'Guest {n} Name',
    'rsvp.dietaryLabel': 'Dietary Restrictions', 'rsvp.dietaryPlaceholder': 'None, vegetarian, gluten-free…',
    'rsvp.findBtn': 'Find My Invitation', 'rsvp.searching': 'Searching…',
    'rsvp.sendBtn': 'Send RSVP', 'rsvp.sending': 'Sending…',
    'rsvp.errNoName': 'Please enter your name.',
    'rsvp.errNoContact': 'Please enter your email address.',
    'rsvp.errAlready': "It looks like you've already submitted an RSVP!",
    'rsvp.errNotFound': 'Name not found. Please check spelling.',
    'rsvp.errConnection': 'Connection error.',
    'rsvp.successMsg': "We can't wait to celebrate with you.",
    'rsvp.successSub': 'Your RSVP has been received',

    // FAQ
    'faq.label': 'Good to Know', 'faq.heading': 'Frequently Asked Questions',

    // Misc
    'couple.date': 'April 16, 2027',
    'lang.toggle': 'ES', 'lang.toggleAria': 'Cambiar a español',
  },

  es: {
    // Nav
    'nav.details': 'Detalles', 'nav.travel': 'Viaje', 'nav.rsvp': 'Confirmar', 'nav.faq': 'Preguntas',

    // Countdown
    'countdown.month': 'Mes',   'countdown.months': 'Meses',
    'countdown.day':   'Día',   'countdown.days':   'Días',
    'countdown.hour':  'Hora',  'countdown.hours':  'Horas',
    'countdown.label': 'Para el gran día',
    'countdown.today': 'Hoy es el día',
    'countdown.and': 'y',
    'countdown.ariaTail': 'para la boda',
    'countdown.arrived': 'Llegó el día de la boda',

    // Hero
    'hero.together': 'Junto con sus familias', 'hero.invite': 'te invitan a su boda',
    'hero.calendarBtn': '+ Agregar al Calendario', 'hero.google': 'Google Calendar', 'hero.apple': 'Apple / Outlook',

    // Details
    'details.label': 'La Boda', 'details.heading': 'Detalles',
    'card.map': 'Mapa', 'card.venueSite': 'Sitio del Lugar',
    
    // Travel
    'travel.label': 'Viaje y Hospedaje', 'travel.heading': 'Cómo Llegar',
    'travel.reserveRoom': 'Reserva tu Habitación', 'travel.visitWebsite': 'Visitar Sitio Web', 'travel.phone': 'Tel', 'travel.bookingCode': 'Código de Reserva',
    'travel.gettingHere': 'Cómo Llegar', 'travel.getDirections': 'Obtener Direcciones',
    'directions.body': directionsEs,

    // RSVP
    'rsvp.heading': 'Confirmar Asistencia', 'rsvp.deadlinePrefix': 'Por favor confirma antes del',
    'rsvp.nameLabel': 'Nombre y Apellido', 'rsvp.namePlaceholder': 'María y José Hernández',
    'rsvp.contactLabel': 'Correo Electrónico', 'rsvp.contactPlaceholder': 'tu@correo.com',
    'rsvp.attendingLabel': '¿Asistirás?', 'rsvp.accept': 'Con gusto asistiré', 'rsvp.decline': 'No podré asistir',
    'rsvp.guestsLabel': 'Acompañantes', 'rsvp.guestOne': '1 Persona', 'rsvp.guestMany': '{n} Personas', 'rsvp.guestNamesLabel': 'Nombres de tus acompañantes', 'rsvp.guestPlaceholder': 'Acompañante {n}',
    'rsvp.dietaryLabel': 'Restricciones Alimenticias', 'rsvp.dietaryPlaceholder': 'Ninguna, vegetariano, sin gluten…',
    'rsvp.findBtn': 'Buscar mi Invitación', 'rsvp.searching': 'Buscando…',
    'rsvp.sendBtn': 'Enviar Confirmación', 'rsvp.sending': 'Enviando…',
    'rsvp.errNoName': 'Por favor escribe tu nombre.',
    'rsvp.errNoContact': 'Por favor escribe tu correo electrónico.',
    'rsvp.errAlready': 'Parece que ya enviaste tu confirmación.',
    'rsvp.errNotFound': 'No encontramos tu nombre. Verifica la ortografía.',
    'rsvp.errConnection': 'Error de conexión.',
    'rsvp.successMsg': 'No podemos esperar a celebrar contigo.',
    'rsvp.successSub': 'Tu confirmación fue recibida',

    // FAQ
    'faq.label': 'Información Útil', 'faq.heading': 'Preguntas Frecuentes',

    // Misc
    'couple.date': '16 de abril, 2027',
    'lang.toggle': 'EN', 'lang.toggleAria': 'Switch to English',
  }
};

export function t(key, locale) {
  return strings[locale]?.[key] ?? strings.en[key] ?? key;
}