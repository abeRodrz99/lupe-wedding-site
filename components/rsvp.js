// ── RSVP form component (Airtable Version) ──────────────────────────
const AIRTABLE_BASE_ID = 'appImJDIkK2RBr07x';
const AIRTABLE_TOKEN = 'patWLRjGEZ16v8aaZ.b24bf6de0de1d655fa48e7a98a6b87300103497f74dc851e5b873c39e25e25ed';
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

// ── Helpers ──────────────────────────────────────────────────────────
function setLoading(btn, isLoading, text) { 
  btn.disabled = isLoading; 
  btn.textContent = isLoading ? 'Loading…' : text; 
}

function showSuccess(formWrap) {
  formWrap.innerHTML = `
    <div class="rsvp-success-container" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px;">
      <div class="rsvp-confirm-message">We can't wait to celebrate with you.</div>
      <p class="rsvp-confirm-sub">Your RSVP has been received</p>
      <img src="./assets/garcia-logo.png" alt="Success" class="rsvp-logo-reveal" style="max-width: 200px; margin-top: 1rem;">
    </div>
  `;
  // Trigger animations
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
export function initRSVP() {
  const submitBtn = document.getElementById('rsvp-submit');
  const nameInput = document.getElementById('name');
  const hiddenFields = document.getElementById('hidden-rsvp-fields');
  const guestsSelect = document.getElementById('guests');
  const formWrap = document.getElementById('rsvp-form-wrap');
  const statusMsg = document.getElementById('rsvp-status-msg');
  const guestNamesContainer = document.getElementById('guest-names-container');
  const dynamicInputs = document.getElementById('dynamic-guest-inputs');

  guestsSelect.addEventListener('change', (e) => {
    const numGuests = parseInt(e.target.value, 10);
    dynamicInputs.innerHTML = ''; 
    if (numGuests > 0) {
      guestNamesContainer.classList.remove('hidden');
      for (let i = 1; i <= numGuests; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Guest ${i} Name`;
        input.className = 'guest-name-field';
        dynamicInputs.appendChild(input);
      }
    } else {
      guestNamesContainer.classList.add('hidden');
    }
  });

  submitBtn.addEventListener('click', async () => {
    if (submitBtn.disabled) return; 

    statusMsg.textContent = "";
    const name = nameInput.value.trim();

    // STEP 1: Lookup and Reveal
    if (!hiddenFields.style.display || hiddenFields.style.display === 'none') {
      if (!name) { 
        statusMsg.textContent = "Please enter your name.";
        return; 
      }
      
      setLoading(submitBtn, true, 'Searching…');
      const query = encodeURIComponent(`{Name}='${name}'`);
      
      const response = await fetch(`${AIRTABLE_URL}/Master%20Guest%20List?filterByFormula=${query}`, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
      });
      const data = await response.json();

      if (data.records && data.records.length > 0) {
        const record = data.records[0];
        const maxGuests = record.fields['Max Guests Allowed'] || 1;

        guestsSelect.innerHTML = '<option value="0">0</option>'; 
        for (let i = 1; i <= maxGuests; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i === 1 ? '1 Person' : `${i} People`;
          guestsSelect.appendChild(opt);
        }

        hiddenFields.style.display = 'block';
        submitBtn.textContent = 'Submit RSVP'; // Switch button text
        nameInput.disabled = true;
      } else {
        statusMsg.textContent = "Name not found. Please check spelling.";
      }
      setLoading(submitBtn, false, 'Find My Invitation');
      return;
    }

    // STEP 2: Final Submit
    setLoading(submitBtn, true, 'Sending…');
    submitBtn.disabled = true; 

    const guestNameFields = document.querySelectorAll('.guest-name-field');
    const guestNamesArray = Array.from(guestNameFields).map(input => input.value);

    const payload = {
      "Name": name,
      "Contact Info": document.getElementById('contact').value,
      "Attending": document.getElementById('attending').value === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines',
      "Guests": parseInt(guestsSelect.value, 10),
      "Guest Names": guestNamesArray.join(', '),
      "Dietary": document.getElementById('dietary').value
    };
    
    await submitToAirtable(payload);
    showSuccess(formWrap);
  });
}