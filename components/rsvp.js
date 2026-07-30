// ── RSVP form component ─────────────────────────────────────────────
import { t } from '../data/strings.js';

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

      try {
        const res = await fetch(`/api/rsvp?name=${encodeURIComponent(name)}`);
        const data = await res.json();

        if (data.status === 'already_submitted') {
          statusMsg.textContent = t('rsvp.errAlready', locale);
          setLoading(submitBtn, false, t('rsvp.findBtn', locale));
          return;
        }

        if (data.status !== 'found') {
          statusMsg.textContent = t('rsvp.errNotFound', locale);
          setLoading(submitBtn, false, t('rsvp.findBtn', locale));
          return;
        }

        guestsSelect.innerHTML = '<option value="0">0</option>';
        for (let i = 1; i <= data.maxGuests; i++) {
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

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          contact: contactValue,
          attending: document.getElementById('attending')?.value,
          guests: guestsSelect.value,
          guestNames: guestNamesArray.join(', '),
          dietary: document.getElementById('dietary')?.value || ''
        })
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed');

      showSuccess(formWrap, locale);
    } catch (error) {
      console.error('Submission error:', error);
      statusMsg.textContent = t('rsvp.errConnection', locale);
      setLoading(submitBtn, false, t('rsvp.sendBtn', locale));
    }
  });
}