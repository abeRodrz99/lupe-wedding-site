const STORAGE_KEY = 'site-lang';

const MX_TIMEZONES = new Set([
  'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey',
  'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Hermosillo',
  'America/Tijuana', 'America/Bahia_Banderas', 'America/Ojinaga'
]);

export function detectLocale() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (saved === 'en' || saved === 'es') return saved;

  const langs = navigator.languages || [navigator.language || ''];
  if (langs.some((l) => l.toLowerCase().startsWith('es'))) return 'es';

  try {
    if (MX_TIMEZONES.has(Intl.DateTimeFormat().resolvedOptions().timeZone)) return 'es';
  } catch (e) {}

  return 'en';
}

export function setLocale(locale) {
  try { localStorage.setItem(STORAGE_KEY, locale); } catch (e) {}
  window.scrollTo(0, 0);
  location.reload();
}