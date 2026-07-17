const RSVP_SHEET_NAME = "RSVPs";
const MASTER_LIST_SHEET_NAME = "Master Guest List";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Could not find a tab named "${RSVP_SHEET_NAME}"`);
    }
    
    // Bulletproof data parsing: Handle both Form URL-Encoded and JSON payloads
    let data = {};
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    sheet.appendRow([
      new Date(),                  // Timestamp (Column A)
      data.name    || '',          // Name (Column B)
      data.email   || '',          // Email (Column C)
      data.attending === 'yes' ? 'Accepts' : 'Declines', // Attending (Column D)
      data.guests  || '1',         // Guests (Column E)
      data.dietary || 'None',      // Dietary (Column F)
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

function doGet(e) {
  if (!e || !e.parameter || !e.parameter.invitee) {
    return ContentService
      .createTextOutput('RSVP endpoint is live and ready for lookups ✦')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    const lookupName = e.parameter.invitee.toString().toLowerCase().trim();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Check if they already RSVP'd (Scan Column B of RSVPs tab)
    const rsvpSheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME);
    if (rsvpSheet) {
      const rsvpData = rsvpSheet.getDataRange().getValues();
      // Start loop at 1 to skip headers
      for (let j = 1; j < rsvpData.length; j++) {
        const submittedName = rsvpData[j][1] ? rsvpData[j][1].toString().toLowerCase().trim() : '';
        if (submittedName === lookupName) {
           return ContentService
             .createTextOutput(JSON.stringify({ status: 'already_submitted' }))
             .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // 2. If not submitted, look them up in the Master Guest List
    const masterSheet = spreadsheet.getSheetByName(MASTER_LIST_SHEET_NAME);
    if (!masterSheet) {
      throw new Error(`Could not find a tab named "${MASTER_LIST_SHEET_NAME}"`);
    }

    const masterData = masterSheet.getDataRange().getValues();
    for (let i = 1; i < masterData.length; i++) {
      const rowInvitee = masterData[i][0] ? masterData[i][0].toString().toLowerCase().trim() : '';
      
      if (rowInvitee === lookupName) {
        return ContentService
          .createTextOutput(JSON.stringify({
            status: 'found',
            maxGuests: parseInt(masterData[i][1], 10) || 1
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'not_found' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}