/**
 * MOSALA WAITLIST — Google Apps Script (Production Ready)
 * ─────────────────────────────────────────────────────────────────────────────
 * CRITICAL DEPLOYMENT SETTINGS (To prevent CORS / 401 errors):
 *
 * 1. Open this script in https://script.google.com or via Google Sheets (Extensions > Apps Script).
 * 2. Click Deploy (Déployer) at top right → Manage deployments (Gérer les déploiements).
 * 3. Click the Pencil icon (Edit / Modifier):
 *    • Version: Select "New version" (Nouvelle version) — ALWAYS create a new version when updating!
 *    • Execute as (Exécuter en tant que): Select "Me" (Moi - your email).
 *    • Who has access (Qui a accès): MUST BE "Anyone" (Tout le monde / Même anonyme).
 *      ⚠️ IF THIS IS "Only myself" OR "Anyone with Google account", GOOGLE REDIRECTS TO SIGN-IN
 *      WHICH CAUSES THE BROWSER CORS ERROR!
 * 4. Click Deploy (Déployer) and authorize permissions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SPREADSHEET_ID = '1_ptRYh9P7VtsFYjijv2YgwT8xxXN-qtit6FNuhvAiaQ';

// Sheet tab names (automatically created if they don't exist)
const BRANDS_SHEET = 'Brands';
const CREATORS_SHEET = 'Creators';

// Column headers for each sheet
const BRAND_HEADERS = [
  'Timestamp', 'Source', 'Full Name', 'WhatsApp', 'Email', 'City',
  'Business Name', 'Sector', 'Budget', 'Website', 'Instagram', 'Facebook'
];

const CREATOR_HEADERS = [
  'Timestamp', 'Source', 'Full Name', 'WhatsApp', 'Email', 'City',
  'Creator Name', 'Niches', 'Instagram', 'TikTok', 'YouTube', 'Facebook',
  'Portfolio Link'
];

/**
 * Handle POST requests from the frontend.
 */
function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : '{}';
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (parseErr) {
      return jsonResponse({ success: false, message: 'Invalid JSON payload.' });
    }

    // Server-side validation
    const validation = validatePayload(payload);
    if (!validation.ok) {
      return jsonResponse({ success: false, message: validation.message });
    }

    const data = payload.data;

    // Honeypot anti-bot check
    if (data.honeypot && String(data.honeypot).trim() !== '') {
      return jsonResponse({ success: true, message: 'Registered.' });
    }

    // Open spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.role === 'brand') {
      return handleBrand(ss, data, payload.timestamp);
    } else if (data.role === 'creator') {
      return handleCreator(ss, data, payload.timestamp);
    } else {
      return jsonResponse({ success: false, message: 'Invalid role specified.' });
    }

  } catch (err) {
    console.error('doPost error:', err);
    return jsonResponse({ success: false, message: 'Server error: ' + err.toString() });
  }
}

/**
 * Handle GET requests for testing connectivity.
 */
function doGet() {
  return jsonResponse({
    status: 'ok',
    platform: 'MOSALA',
    message: 'Waitlist API is live and accepting submissions.',
    timestamp: new Date().toISOString()
  });
}

/**
 * Handle preflight OPTIONS requests if triggered by any client.
 */
function doOptions() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ─── Brand handler ────────────────────────────────────────────────────────────

function handleBrand(ss, data, timestamp) {
  const sheet = getOrCreateSheet(ss, BRANDS_SHEET, BRAND_HEADERS);
  const serverTimestamp = new Date().toISOString();

  const newRow = [
    serverTimestamp,
    data.source || 'direct',
    sanitize(data.fullName),
    sanitize(data.whatsapp),
    sanitize(data.email || ''),
    sanitize(data.city || 'Kinshasa'),
    sanitize(data.businessName || data.fullName || ''),
    sanitize(data.sector || ''),
    sanitize(data.budget || ''),
    sanitize(data.website || data.websiteOrInsta || ''),
    sanitize(data.instagram || ''),
    sanitize(data.facebook || ''),
  ];

  // If already registered by WhatsApp number, update existing row while preserving earlier values
  const existingRowIdx = findRowByPhone(sheet, data.whatsapp, 4);
  if (existingRowIdx > 0) {
    const existingRange = sheet.getRange(existingRowIdx, 1, 1, newRow.length);
    const existingValues = existingRange.getValues()[0];

    // Merge: keep new non-empty values, fallback to existing values
    const mergedRow = newRow.map((val, idx) => {
      if (idx === 0) return serverTimestamp; // update timestamp
      return val !== '' ? val : (existingValues[idx] || '');
    });

    existingRange.setValues([mergedRow]);
    console.log('Brand updated:', data.whatsapp, timestamp);
    return jsonResponse({ success: true, updated: true, message: 'Profil mis à jour.' });
  }

  sheet.appendRow(newRow);
  console.log('Brand registered:', data.whatsapp, timestamp);
  return jsonResponse({ success: true, message: 'Brand registered successfully.' });
}

// ─── Creator handler ──────────────────────────────────────────────────────────

function handleCreator(ss, data, timestamp) {
  const sheet = getOrCreateSheet(ss, CREATORS_SHEET, CREATOR_HEADERS);
  const serverTimestamp = new Date().toISOString();
  const niches = Array.isArray(data.niches) ? data.niches.join(', ') : (data.niches || '');

  const newRow = [
    serverTimestamp,
    data.source || 'direct',
    sanitize(data.fullName),
    sanitize(data.whatsapp),
    sanitize(data.email || ''),
    sanitize(data.city || 'Kinshasa'),
    sanitize(data.creatorName || data.fullName || ''),
    sanitize(niches),
    sanitize(data.instagram || data.instagramHandle || ''),
    sanitize(data.tiktok || data.tiktokHandle || ''),
    sanitize(data.youtube || data.youtubeHandle || ''),
    sanitize(data.facebook || ''),
    sanitize(data.portfolioLink || ''),
  ];

  // If already registered by WhatsApp number, update existing row while preserving earlier values
  const existingRowIdx = findRowByPhone(sheet, data.whatsapp, 4);
  if (existingRowIdx > 0) {
    const existingRange = sheet.getRange(existingRowIdx, 1, 1, newRow.length);
    const existingValues = existingRange.getValues()[0];

    const mergedRow = newRow.map((val, idx) => {
      if (idx === 0) return serverTimestamp;
      return val !== '' ? val : (existingValues[idx] || '');
    });

    existingRange.setValues([mergedRow]);
    console.log('Creator updated:', data.whatsapp, timestamp);
    return jsonResponse({ success: true, updated: true, message: 'Profil mis à jour.' });
  }

  sheet.appendRow(newRow);
  console.log('Creator registered:', data.whatsapp, timestamp);
  return jsonResponse({ success: true, message: 'Creator registered successfully.' });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function findRowByPhone(sheet, value, columnIndex) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  const range = sheet.getRange(2, columnIndex, lastRow - 1, 1);
  const values = range.getValues();
  const normalised = normalisePhone(value);

  for (let i = 0; i < values.length; i++) {
    if (normalisePhone(String(values[i][0])) === normalised) {
      return i + 2; // 1-indexed, skipping header
    }
  }
  return -1;
}

function normalisePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[\s\-().]/g, '');
}

function sanitize(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (['+', '-', '=', '@', '\t', '\r'].some(function(ch) { return str.startsWith(ch); })) {
    return "'" + str; // Treat as text in Sheets
  }
  return str;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'Invalid payload format.' };
  }

  const data = payload.data;
  if (!data || typeof data !== 'object') {
    return { ok: false, message: 'Missing form data.' };
  }

  if (!['brand', 'creator'].includes(data.role)) {
    return { ok: false, message: 'Invalid role.' };
  }

  if (!data.fullName || !String(data.fullName).trim()) {
    return { ok: false, message: 'Le nom est requis.' };
  }

  const phone = normalisePhone(data.whatsapp);
  if (!phone) {
    return { ok: false, message: 'Le numéro WhatsApp est requis.' };
  }

  if (!/^\+?[0-9]{7,15}$/.test(phone)) {
    return { ok: false, message: 'Numéro WhatsApp invalide.' };
  }

  if (!data.email || !String(data.email).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
    return { ok: false, message: 'Une adresse email valide est requise.' };
  }

  return { ok: true };
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
