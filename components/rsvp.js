// ── RSVP form component ──────────────────────────────────────────────────────
// Handles validation, lookups, dynamic guest limits, and final submission.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypux0vzuXAtBv3MHl9rQO_qG_DmAeMh7o730jI-H-WeAAb5yBmjV7gEfOZqpuh02kc/exec';
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

function setLoading(btn, isLoading, loadingText = 'Sending…', normalText = 'Send RSVP') {
  btn.disabled    = isLoading;
  btn.textContent = isLoading ? loadingText : normalText;
}

function showSuccess(formWrap, name) {
  formWrap.innerHTML = `
    <div class="rsvp-confirmation">
      <p class="rsvp-confirm-message">We can't wait to celebrate with you.</p>
      <p class="rsvp-confirm-sub">Your RSVP has been received</p>
      <div class="rsvp-logo-reveal">
        <img src="./assets/garcia-logo.png" alt="${escapeHtml(name)}" />
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    formWrap.querySelector('.rsvp-confirm-message').classList.add('animate');
    formWrap.querySelector('.rsvp-confirm-sub').classList.add('animate');
    formWrap.querySelector('.rsvp-logo-reveal').classList.add('animate');
  });
}

function showError(formWrap, alternativeMessage) {
  const existing = formWrap.querySelector('.rsvp-error');
  if (existing) existing.remove();
  const msg = document.createElement('p');
  msg.className   = 'rsvp-error';
  msg.textContent = alternativeMessage || 'Something went wrong — please try again or email us directly.';
  formWrap.querySelector('.rsvp-form').prepend(msg);
}

// ── Submit to Google Sheets ───────────────────────────────────────────────────
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

  const nameInput   = document.getElementById('name');
  const emailInput  = document.getElementById('email');
  const guestsSelect = document.getElementById('guests');
  
  const nameField   = nameInput.closest('.field');
  const emailField  = emailInput.closest('.field');

  clearErrorOnFocus(nameInput,  nameField);
  clearErrorOnFocus(emailInput, emailField);

  // Track the unique guest limit allowed for the verified person
  let maxGuestsAllowed = 1;
  let isVerified = false;

  // Change initial button appearance to guide them to check their name first
  submitBtn.textContent = 'Find My Invitation';

  submitBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();

    // ── STEP 1: VERIFY GUEST & GET LIMIT ─────────────────────────────────────
    if (!isVerified) {
      if (!name) { 
        setFieldError(nameField, true); 
        return; 
      }

      setLoading(submitBtn, true, 'Searching List…', 'Find My Invitation');

      try {
        // Adds a unique timestamp to the end so the browser thinks it's a brand new request every time
        const response = await fetch(`${APPS_SCRIPT_URL}?invitee=${encodeURIComponent(name)}&nocache=${new Date().getTime()}`);
        const data = await response.json();

        // Remove any previous error message if present
        const existingError = formWrap.querySelector('.rsvp-error');
        if (existingError) existingError.remove();

        // ── NEW LOGIC: Block double submissions ──
        if (data.status === 'already_submitted') {
          setLoading(submitBtn, false, 'Searching List…', 'Find My Invitation');
          showError(formWrap, "It looks like you have already submitted your RSVP! Please contact us directly if you need to update your response.");
          return;
        }

        if (data.status === 'found') {
          maxGuestsAllowed = data.maxGuests;
          isVerified = true;

          // Dynamically rewrite the dropdown selections based on their strict limit
          guestsSelect.innerHTML = '';
          for (let i = 1; i <= maxGuestsAllowed; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i === 1 ? '1 Person' : `${i} People`;
            guestsSelect.appendChild(opt);
          }

          // Un-hide the rest of the form fields
          const hiddenFields = document.getElementById('hidden-rsvp-fields');
          if (hiddenFields) {
            hiddenFields.style.display = 'block';
          }

          setLoading(submitBtn, false, 'Searching List…', 'Send RSVP');
          nameInput.disabled = true; // lock name choice once validated
          
        } else {
          setLoading(submitBtn, false, 'Searching List…', 'Find My Invitation');
          showError(formWrap, "We couldn't find that name on our guest list. Please check your spelling.");
        }
      } catch (err) {
        console.error('Lookup failed:', err);
        setLoading(submitBtn, false, 'Searching List…', 'Find My Invitation');
        showError(formWrap, 'Could not connect to guest database. Please try again.');
      }
      return;
    }

    // ── STEP 2: STANDARD RSVP SUBMISSION ─────────────────────────────────────
    const email     = emailInput.value.trim();
    const attending = document.getElementById('attending').value;
    const guests    = guestsSelect.value;
    const dietary   = document.getElementById('dietary').value.trim();

    // Validate email before sending
    if (!email) { 
      setFieldError(emailField, true); 
      return; 
    }

    setLoading(submitBtn, true, 'Sending…', 'Send RSVP');

    try {
      await submitToSheet({ name, email, attending, guests, dietary });
      showSuccess(formWrap, name);
    } catch (err) {
      console.error('RSVP submission failed:', err);
      setLoading(submitBtn, false, 'Sending…', 'Send RSVP');
      showError(formWrap);
    }
  });
}