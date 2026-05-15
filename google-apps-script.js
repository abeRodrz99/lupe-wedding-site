// ── Google Apps Script ────────────────────────────────────────────────────────
//
// HOW TO SET UP:
//   1. Open your Google Sheet
//   2. Go to Extensions → Apps Script
//   3. Delete any existing code and paste this entire file
//   4. Click Save (floppy disk icon)
//   5. Click Deploy → New deployment
//        - Type: Web app
//        - Execute as: Me
//        - Who has access: Anyone
//   6. Click Deploy → copy the Web app URL
//   7. Paste that URL into components/rsvp.js as APPS_SCRIPT_URL
//
// SHEET SETUP:
//   Row 1 should have these headers (copy exactly):
//   Timestamp | Name | Email | Attending | Guests | Dietary
//
// RE-DEPLOYING AFTER EDITS:
//   If you change this script, go to Deploy → Manage deployments
//   and create a new version — the URL stays the same.

function doPost(e) {
  try {
    const sheet  = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data   = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                  // Timestamp
      data.name      || '',        // Name
      data.email     || '',        // Email
      data.attending === 'yes'
        ? 'Accepts'
        : 'Declines',              // Attending (human-readable)
      data.guests    || '1',       // Guests
      data.dietary   || 'None',    // Dietary
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET handler so you can test the URL is live in a browser
function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is live ✦')
    .setMimeType(ContentService.MimeType.TEXT);
}
