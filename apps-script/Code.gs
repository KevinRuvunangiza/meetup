/**
 * MEETUP WAITLIST — Google Apps Script
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO DEPLOY (step by step):
 *
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it "MEETUP Waitlist".
 *
 * 2. At the bottom, rename the first sheet tab to "Brands".
 *    Click the + button and name the second tab "Creators".
 *
 * 3. In the spreadsheet, click Extensions → Apps Script.
 *    A new tab opens with a code editor.
 *
 * 4. Delete all existing code and paste the entire contents of this file.
 *
 * 5. At the top of the editor, find the constant SPREADSHEET_ID below.
 *    Replace 'YOUR_SPREADSHEET_ID_HERE' with the ID from your spreadsheet URL.
 *    The URL looks like:
 *      https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXX/edit
 *    Copy the XXXXXXXXXXXXXXXX part.
 *
 * 6. Click File → Save. Name the project "MEETUP Waitlist".
 *
 * 7. Click Deploy → New deployment.
 *    - Type: Web app
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 *    Click Deploy.
 *
 * 8. Google will ask you to authorize the script.
 *    Click "Review permissions" → choose your account → "Advanced" → "Go to MEETUP Waitlist (unsafe)"
 *    → Allow.
 *    (The "unsafe" warning appears because this is a new, unverified script.
 *     It is YOUR script — this is normal for self-deployed scripts.)
 *
 * 9. Copy the Web app URL that appears.
 *    It looks like: https://script.google.com/macros/s/XXXXX/exec
 *
 * 10. In your project, create a file called .env.local (copy from .env.example):
 *     VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
 *
 * 11. On Netlify, go to Site configuration → Environment variables and add:
 *     Key:   VITE_APPS_SCRIPT_URL
 *     Value: https://script.google.com/macros/s/XXXXX/exec
 *
 * 12. To test: submit the form on your site. Check the spreadsheet.
 *     If nothing appears, open the Apps Script editor → Executions tab
 *     to see logs and errors.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * KNOWN WEAKNESSES (documented honestly):
 *
 * • The endpoint URL is public. Anyone who finds it can POST fake data.
 *   Mitigation: honeypot field on the frontend (bots fill it → ignored server-side),
 *   rate limiting is not possible in Apps Script.
 *
 * • No authentication. This is intentional for a waitlist — the bar to sign up
 *   should be low. For sensitive data, use Supabase + Row Level Security.
 *
 * • Apps Script has a 6-minute execution limit and daily quotas
 *   (20,000 reads/day on free tier). For a waitlist this is not a concern.
 *
 * • Each POST triggers a new Apps Script instance. If you get 50 submissions
 *   in one second, they may queue. Again, fine for a waitlist.
 *
 * FUTURE MIGRATION PATH:
 *   Replace this with a Supabase table + Edge Function:
 *   - Better performance, real duplicate checking, rate limiting
 *   - Row Level Security for data privacy
 *   - Supabase dashboard for filtering, exporting
 *   - Migrate by changing siteConfig.appsScriptUrl to point to the new endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 */

// !! CHANGE THIS to your spreadsheet ID !!
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Sheet tab names (must match what you created in step 2)
const BRANDS_SHEET = 'Brands';
const CREATORS_SHEET = 'Creators';

// Column headers for each sheet
const BRAND_HEADERS = [
  'Timestamp', 'Source', 'Full Name', 'WhatsApp', 'Email', 'City',
  'Business Name', 'Sector', 'Creator Need', 'Budget', 'Worked Before',
  'Website/Instagram'
];

const CREATOR_HEADERS = [
  'Timestamp', 'Source', 'Full Name', 'WhatsApp', 'Email', 'City',
  'Creator Name', 'Creator Type', 'Niches', 'Instagram Handle', 'Instagram Followers',
  'TikTok Handle', 'TikTok Followers', 'YouTube Handle', 'YouTube Followers',
  'Portfolio Link', 'Paid Before', 'Rate Range'
];

/**
 * Handle POST requests from the frontend.
 * Apps Script receives all requests via doPost().
 */
function doPost(e) {
  try {
    // Parse body
    const raw = e.postData ? e.postData.contents : '{}';
    const payload = JSON.parse(raw);

    // Server-side validation
    const validation = validatePayload(payload);
    if (!validation.ok) {
      return jsonResponse({ success: false, message: validation.message });
    }

    const data = payload.data;

    // Honeypot check — if 'honeypot' field is not empty, silently accept
    // (don't tell bots we detected them)
    if (data.honeypot && data.honeypot.trim() !== '') {
      return jsonResponse({ success: true, message: 'Registered.' });
    }

    // Open spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.role === 'brand') {
      return handleBrand(ss, data, payload.timestamp);
    } else if (data.role === 'creator') {
      return handleCreator(ss, data, payload.timestamp);
    } else {
      return jsonResponse({ success: false, message: 'Invalid role.' });
    }

  } catch (err) {
    console.error('doPost error:', err);
    return jsonResponse({ success: false, message: 'Server error.' });
  }
}

/**
 * Handle GET requests (useful for testing that the endpoint is reachable).
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'MEETUP Waitlist API is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Brand handler ────────────────────────────────────────────────────────────

function handleBrand(ss, data, timestamp) {
  const sheet = getOrCreateSheet(ss, BRANDS_SHEET, BRAND_HEADERS);

  // Duplicate check by WhatsApp number
  if (isDuplicate(sheet, data.whatsapp, 4)) { // column 4 = WhatsApp (1-indexed)
    return jsonResponse({ success: false, duplicate: true, message: 'Already registered.' });
  }

  const serverTimestamp = new Date().toISOString();
  const row = [
    serverTimestamp,                        // Timestamp (server-generated)
    data.source || 'direct',               // Source/UTM
    sanitize(data.fullName),               // Full Name
    sanitize(data.whatsapp),               // WhatsApp
    sanitize(data.email || ''),            // Email
    sanitize(data.city),                   // City
    sanitize(data.businessName || ''),     // Business Name
    sanitize(data.sector || ''),           // Sector
    sanitize(data.creatorNeed || ''),      // Creator Need
    sanitize(data.budget || ''),           // Budget
    sanitize(data.workedBefore || ''),     // Worked Before
    sanitize(data.websiteOrInsta || ''),   // Website/Instagram
  ];

  sheet.appendRow(row);
  console.log('Brand registered:', data.whatsapp, timestamp);

  return jsonResponse({ success: true, message: 'Brand registered.' });
}

// ─── Creator handler ──────────────────────────────────────────────────────────

function handleCreator(ss, data, timestamp) {
  const sheet = getOrCreateSheet(ss, CREATORS_SHEET, CREATOR_HEADERS);

  // Duplicate check by WhatsApp number
  if (isDuplicate(sheet, data.whatsapp, 4)) {
    return jsonResponse({ success: false, duplicate: true, message: 'Already registered.' });
  }

  const serverTimestamp = new Date().toISOString();
  const niches = Array.isArray(data.niches) ? data.niches.join(', ') : '';

  const row = [
    serverTimestamp,
    data.source || 'direct',
    sanitize(data.fullName),
    sanitize(data.whatsapp),
    sanitize(data.email || ''),
    sanitize(data.city),
    sanitize(data.creatorName || ''),
    sanitize(data.creatorType || ''),
    sanitize(niches),
    sanitize(data.instagramHandle || ''),
    sanitize(data.instagramFollowers || ''),
    sanitize(data.tiktokHandle || ''),
    sanitize(data.tiktokFollowers || ''),
    sanitize(data.youtubeHandle || ''),
    sanitize(data.youtubeFollowers || ''),
    sanitize(data.portfolioLink || ''),
    sanitize(data.paidBefore || ''),
    sanitize(data.rateRange || ''),
  ];

  sheet.appendRow(row);
  console.log('Creator registered:', data.whatsapp, timestamp);

  return jsonResponse({ success: true, message: 'Creator registered.' });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get a sheet by name, or create it with headers if it doesn't exist.
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  // Add headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    // Bold the header row
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

/**
 * Check if a value already exists in a given column (1-indexed).
 * Used for WhatsApp duplicate detection.
 */
function isDuplicate(sheet, value, columnIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false; // Only headers, no data yet

  const range = sheet.getRange(2, columnIndex, lastRow - 1, 1);
  const values = range.getValues();

  const normalised = normalisePhone(value);
  return values.some(([cell]) => normalisePhone(String(cell)) === normalised);
}

/**
 * Normalise a phone number for comparison:
 * strip spaces, dashes, parentheses.
 */
function normalisePhone(phone) {
  return phone.replace(/[\s\-().]/g, '');
}

/**
 * Remove any formula injection attempts (cells starting with = + - @).
 */
function sanitize(value) {
  const str = String(value).trim();
  if (['+', '-', '=', '@', '\t', '\r'].some(ch => str.startsWith(ch))) {
    return "'" + str; // Prefix with apostrophe to treat as text in Sheets
  }
  return str;
}

/**
 * Server-side validation — minimal but explicit.
 */
function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'Invalid payload.' };
  }

  const data = payload.data;
  if (!data) return { ok: false, message: 'Missing data.' };

  if (!['brand', 'creator'].includes(data.role)) {
    return { ok: false, message: 'Invalid role.' };
  }

  if (!data.fullName || !data.whatsapp || !data.city) {
    return { ok: false, message: 'Missing required fields.' };
  }

  // Basic phone format: starts with +, 7–15 digits
  if (!/^\+\d{7,15}$/.test(data.whatsapp.replace(/\s/g, ''))) {
    return { ok: false, message: 'Invalid WhatsApp number.' };
  }

  return { ok: true };
}

/**
 * Return a CORS-safe JSON response.
 * Apps Script web apps need CORS headers for cross-origin fetch().
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
