// ── RSVP form component ──────────────────────────────────────────────────────
// Handles validation, submission to Google Sheets, and success state.
//
// SETUP:
//   1. Create a Google Sheet with headers:
//      Timestamp | Name | Email | Attending | Guests | Dietary
//   2. Extensions → Apps Script → paste the code from google-apps-script.js
//   3. Deploy → New deployment → Web app → Anyone can access → Copy the URL
//   4. Paste that URL as APPS_SCRIPT_URL below

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjHTaeLAmgFw61E4r8BQS48A6CshwlcU-q4MNu0kFNM4EEm_7g1FVmFBk2ELN6Cb3A/exec';

// ── Helpers ───────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setFieldError(fieldEl, hasError) {
  fieldEl.classList.toggle('field--error', hasError);
}

function clearErrorOnFocus(inputEl, fieldEl) {
  inputEl.addEventListener('focus', () => setFieldError(fieldEl, false));
}

function setLoading(btn, isLoading) {
  btn.disabled    = isLoading;
  btn.textContent = isLoading ? 'Sending…' : 'Send RSVP';
}

function showSuccess(formWrap, name) {
  formWrap.innerHTML = `
    <p class="rsvp-success">
      Thank you, ${escapeHtml(name)}!<br>
      We can't wait to celebrate with you. ✦
    </p>
  `;
}

function showError(formWrap) {
  const existing = formWrap.querySelector('.rsvp-error');
  if (existing) return;
  const msg = document.createElement('p');
  msg.className   = 'rsvp-error';
  msg.textContent = 'Something went wrong — please try again or email us directly.';
  formWrap.querySelector('.rsvp-form').prepend(msg);
}

// ── Submit to Google Sheets ───────────────────────────────────────────────────
// Uses no-cors because Apps Script redirects don't support CORS headers.
// The request still reaches the sheet — we just can't read the response,
// so we treat every send as a success on the client side.

async function submitToSheet(payload) {
  const params = new URLSearchParams(payload);
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode:   'no-cors',
    body:   params,
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initRSVP() {
  const submitBtn = document.getElementById('rsvp-submit');
  const formWrap  = document.getElementById('rsvp-form-wrap');
  if (!submitBtn || !formWrap) return;

  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const nameField  = nameInput.closest('.field');
  const emailField = emailInput.closest('.field');

  clearErrorOnFocus(nameInput,  nameField);
  clearErrorOnFocus(emailInput, emailField);

  submitBtn.addEventListener('click', async () => {
    const name      = nameInput.value.trim();
    const email     = emailInput.value.trim();
    const attending = document.getElementById('attending').value;
    const guests    = document.getElementById('guests').value;
    const dietary   = document.getElementById('dietary').value.trim();

    // Validate
    let hasError = false;
    if (!name)  { setFieldError(nameField,  true); hasError = true; }
    if (!email) { setFieldError(emailField, true); hasError = true; }
    if (hasError) return;

    setLoading(submitBtn, true);

    try {
      await submitToSheet({ name, email, attending, guests, dietary });
      showSuccess(formWrap, name);
    } catch (err) {
      console.error('RSVP submission failed:', err);
      setLoading(submitBtn, false);
      showError(formWrap);
    }
  });
}
