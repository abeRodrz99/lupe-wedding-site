// api/rsvp.js — runs on Vercel's server, never in the browser
const BASE_ID = 'appImJDIkK2RBr07x';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}`;

function nameFormula(name) {
  const safe = String(name).toLowerCase().trim().replace(/'/g, "\\'");
  return encodeURIComponent(`LOWER({Name})='${safe}'`);
}

async function airtableGet(table, formula, token) {
  const res = await fetch(`${AIRTABLE_URL}/${table}?filterByFormula=${formula}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    // ── Look up an invitation ──────────────────────────────
    if (req.method === 'GET') {
      const name = (req.query.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Missing name' });

      const formula = nameFormula(name);

      const master = await airtableGet('Master%20Guest%20List', formula, token);
      if (!master.records || master.records.length === 0) {
        return res.status(200).json({ status: 'not_found' });
      }

      const existing = await airtableGet('RSVPs', formula, token);
      if (existing.records && existing.records.length > 0) {
        return res.status(200).json({ status: 'already_submitted' });
      }

      return res.status(200).json({
        status: 'found',
        maxGuests: master.records[0].fields['Max Guests Allowed'] || 1
      });
    }

    // ── Submit an RSVP ─────────────────────────────────────
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const name = (body.name || '').trim();
      if (!name) return res.status(400).json({ error: 'Missing name' });

      const formula = nameFormula(name);

      // Re-check the guest list here so nobody can add themselves
      const master = await airtableGet('Master%20Guest%20List', formula, token);
      if (!master.records || master.records.length === 0) {
        return res.status(403).json({ error: 'Not on the guest list' });
      }

      const existing = await airtableGet('RSVPs', formula, token);
      if (existing.records && existing.records.length > 0) {
        return res.status(409).json({ error: 'Already submitted' });
      }

      const maxGuests = master.records[0].fields['Max Guests Allowed'] || 1;
      const guests = Math.min(parseInt(body.guests, 10) || 0, maxGuests);

      const fields = {
        'Name': name,
        'Contact Info': String(body.contact || '').slice(0, 200),
        'Attending': body.attending === 'yes' ? 'Joyfully Accepts' : 'Regretfully Declines',
        'Guests': guests,
        'Guest Names': String(body.guestNames || '').slice(0, 500),
        'Dietary': String(body.dietary || '').slice(0, 500)
      };

      const post = await fetch(`${AIRTABLE_URL}/RSVPs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      });

      if (!post.ok) throw new Error(`Airtable ${post.status}`);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}