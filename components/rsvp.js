// ── RSVP form component (Airtable Version) ──────────────────────────
import { t } from '../data/strings.js';

const AIRTABLE_BASE_ID = 'appImJDIkK2RBr07x';
const AIRTABLE_TOKEN = 'patWLRjGEZ16v8aaZ.b24bf6de0de1d655fa48e7a98a6b87300103497f74dc851e5b873c39e25e25ed';
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// ── Helpers ─────────────────────────────────────────────────────────
function setLoading(btn, isLoading, text) {
  btn.disabled = isLoading;
  btn.textContent = text;
}

function showSuccess(formWrap, locale) {
  formWrap.innerHTML = `
    <div class="rsvp-success-container" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
      <div class="rsvp-confirm-message">${t('rsvp.successMsg', locale)}</div>
      <p class="rsvp-confirm-sub">${t('rsvp.successSub', locale)}</p>
      <img src="./assets/garcia-logo.png" alt="" class="rsvp-logo-reveal" style="max-width: 200px; margin-top: 1rem;">
    </div>
  `;
  requestAnimationFrame(() => {
    formWrap.querySelector('.rsvp-confirm-message').classList.add('animate');
    formWrap.querySelector('.rsvp-confirm-sub').classList.add('animate');
    formWrap.querySelector('.rsvp-logo-reveal').classList.add('animate');
  });
}

async function submitToAirtable(payload) {
  const response = await fetch(`${AIRTABLE_URL}/RSVPs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: payload })
  });
  return response.json();
}

// ── Init ─────────────────────────────────────────────────────────────
export function initRSVP(locale = 'en') {
  const submitBtn = document.getElementById('rsvp-submit');
  const nameInput = document.getElementById('name');
  const hiddenFields = document.getElementById('hidden-rsvp-fields');
  const guestsSelect = document.getElementById('guests');
  const formWrap = document.getElementById('rsvp-form-wrap');
  const statusMsg = document.getElementById('rsvp-status-msg');
  const guestNamesContainer = document.getElementById('guest-names-container');
  const dynamicInputs = document.getElementById('dynamic-guest-inputs');

  if (!submitBtn) return;

  guestsSelect.addEventListener('change', (e) => {
    const numGuests = parseInt(e.target.value, 10);
    dynamicInputs.innerHTML = '';
    if (numGuests > 0) {
      guestNamesContainer.classList.remove('hidden');
      for (let i = 1; i <= numGuests; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = t('rsvp.guestPlaceholder', locale).replace('{n}', i);
        input.className = 'guest-name-field';
        dynamicInputs.appendChild(input);
      }
    } else {
      guestNamesContainer.classList.add('hidden');
    }
  });

  submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) return;

    // ── STEP 1: Find Invitation ──────────────────────────────────
    if (!hiddenFields.style.display || hiddenFields.style.display === 'none') {
      const name = nameInput.value.trim();
      if (!name) {
        statusMsg.textContent = t('rsvp.errNoName', locale);
        return;
      }

      setLoading(submitBtn, true, t('rsvp.searching', locale));
      statusMsg.textContent = '';

      // Case-insensitive, and escapes apostrophes so names like O'Brien work.
      const safeName = name.toLowerCase().replace(/'/g, "\\'");
      const query = encodeURIComponent(`LOWER({Name})='${safeName}'`);

      try {
        const masterRes = await fetch(`${AIRTABLE_URL}/Master%20Guest%20List?filterByFormula=${query}`, {
          headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
        });
        const masterData = await masterRes.json();

        if (masterData.records && masterData.records.length > 0) {
          const rsvpRes = await fetch(`${AIRTABLE_URL}/RSVPs?filterByFormula=${query}`, {
            headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
          });
          const rsvpData = await rsvpRes.json();

          if (rsvpData.records && rsvpData.records.length > 0) {
            statusMsg.textContent = t('rsvp.errAlready', locale);
            setLoading(submitBtn, false, t('rsvp.findBtn', locale));
            return;
          }

          const record = masterData.records[0];
          const maxGuests = record.fields['Max Guests Allowed'] || 1;

          guestsSelect.innerHTML = '<option value="0">0</option>';
          for (let i = 1; i <= maxGuests; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i === 1
              ? t('rsvp.guestOne', locale)
              : t('rsvp.guestMany', locale).replace('{n}', i);
            guestsSelect.appendChild(opt);
          }

          hiddenFields.style.display = 'block';
          nameInput.disabled = true;
          setLoading(submitBtn, false, t('rsvp.sendBtn', locale));
        } else {
          statusMsg.textContent = t('rsvp.errNotFound', locale);
          setLoading(submitBtn, false, t('rsvp.findBtn', locale));
        }
      } catch (err) {
        console.error('Lookup error:', err);
        statusMsg.textContent = t('rsvp.errConnection', locale);
        setLoading(submitBtn, false, t('rsvp.findBtn', locale));
      }
      return;
    }

    // ── STEP 2: Final Submit ─────────────────────────────────────
    const contactInput = document.getElementById('contact');
    const contactValue = contactInput ? contactInput.value.trim() : '';

    if (!contactValue || !contactValue.includes('@')) {
      statusMsg.textContent = t('rsvp.errNoContact', locale);
      return;
    }

    statusMsg.textContent = '';
    setLoading(submitBtn, true, t('rsvp.sending', locale));

    const guestNameFields = document.querySelectorAll('.guest-name-field');
    const guestNamesArray = Array.from(guestNameFields).map((i) => i.value.trim()).filter(Boolean);

    const payload = {
      'Name': nameInput.value.trim(),
      'Contact Info': contactValue,
      'Attending': document.getElementById('attending')?.value === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines',
      'Guests': parseInt(guestsSelect.value || '0', 10),
      'Guest Names': guestNamesArray.join(', '),
      'Dietary': document.getElementById('dietary')?.value || ''
    };

    try {
      await submitToAirtable(payload);
      showSuccess(formWrap, locale);
    } catch (error) {
      console.error('Submission error:', error);
      statusMsg.textContent = t('rsvp.errConnection', locale);
      setLoading(submitBtn, false, t('rsvp.sendBtn', locale));
    }
  });
}