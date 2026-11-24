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

// Target column headers for each sheet
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
    let raw = '';
    if (e && e.postData) {
      raw = typeof e.postData.getDataAsString === 'function'
        ? e.postData.getDataAsString()
        : (e.postData.contents || '');
    } else if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    }

    if (!raw || raw.trim() === '') {
      raw = '{}';
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, 'Raw data:', raw);
      return jsonResponse({ success: false, message: 'Format JSON invalide.' });
    }

    // Server-side validation
    const validation = validatePayload(payload);
    if (!validation.ok) {
      return jsonResponse({ success: false, message: validation.message });
    }

    const data = payload.data;

    // Honeypot anti-bot check
    if (data.honeypot && String(data.honeypot).trim() !== '') {
      return jsonResponse({ success: true, message: 'Enregistré.' });
    }

    // Open spreadsheet (standalone or container-bound)
    const ss = getSpreadsheet();

    if (data.role === 'brand') {
      return handleBrand(ss, data);
    } else if (data.role === 'creator') {
      return handleCreator(ss, data);
    } else {
      return jsonResponse({ success: false, message: 'Rôle non reconnu.' });
    }

  } catch (err) {
    console.error('doPost error:', err);
    return jsonResponse({ success: false, message: 'Erreur serveur: ' + err.toString() });
  }
}

/**
 * Handle GET requests for testing connectivity.
 */
function doGet() {
  return jsonResponse({
    status: 'ok',
    platform: 'MOSALA',
    message: 'L’API Mosala Waitlist est active et prête à recevoir les inscriptions.',
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

function handleBrand(ss, data) {
  const sheet = getOrCreateSheet(ss, BRANDS_SHEET, BRAND_HEADERS);
  const serverTimestamp = new Date().toISOString();

  // Map incoming values to column names (supports legacy aliases as well)
  const brandDataMap = {
    'Timestamp': serverTimestamp,
    'Source': data.source || 'direct',
    'Full Name': sanitize(data.fullName),
    'WhatsApp': sanitize(data.whatsapp),
    'Email': sanitize(data.email || ''),
    'City': sanitize(data.city || 'Kinshasa'),
    'Business Name': sanitize(data.businessName || data.fullName || ''),
    'Sector': sanitize(data.sector || ''),
    'Budget': sanitize(data.budget || ''),
    'Website': sanitize(data.website || data.websiteOrInsta || ''),
    'Instagram': sanitize(data.instagram || ''),
    'Facebook': sanitize(data.facebook || ''),
  };

  // Alias support for older sheet headers
  if (!brandDataMap['Website/Instagram']) {
    brandDataMap['Website/Instagram'] = brandDataMap['Website'] || brandDataMap['Instagram'] || '';
  }

  const result = saveRecord(sheet, BRAND_HEADERS, brandDataMap, 'WhatsApp');
  console.log('Brand save result:', data.whatsapp, result);
  return jsonResponse(result);
}

// ─── Creator handler ──────────────────────────────────────────────────────────

function handleCreator(ss, data) {
  const sheet = getOrCreateSheet(ss, CREATORS_SHEET, CREATOR_HEADERS);
  const serverTimestamp = new Date().toISOString();
  const niches = Array.isArray(data.niches) ? data.niches.join(', ') : (data.niches || '');

  // Map incoming values to column names (supports legacy aliases as well)
  const creatorDataMap = {
    'Timestamp': serverTimestamp,
    'Source': data.source || 'direct',
    'Full Name': sanitize(data.fullName),
    'WhatsApp': sanitize(data.whatsapp),
    'Email': sanitize(data.email || ''),
    'City': sanitize(data.city || 'Kinshasa'),
    'Creator Name': sanitize(data.creatorName || data.fullName || ''),
    'Niches': sanitize(niches),
    'Instagram': sanitize(data.instagram || data.instagramHandle || ''),
    'TikTok': sanitize(data.tiktok || data.tiktokHandle || ''),
    'YouTube': sanitize(data.youtube || data.youtubeHandle || ''),
    'Facebook': sanitize(data.facebook || ''),
    'Portfolio Link': sanitize(data.portfolioLink || data.portfolio || ''),
  };

  // Alias support for older sheet headers
  creatorDataMap['Instagram Handle'] = creatorDataMap['Instagram'];
  creatorDataMap['TikTok Handle'] = creatorDataMap['TikTok'];
  creatorDataMap['YouTube Handle'] = creatorDataMap['YouTube'];

  const result = saveRecord(sheet, CREATOR_HEADERS, creatorDataMap, 'WhatsApp');
  console.log('Creator save result:', data.whatsapp, result);
  return jsonResponse(result);
}

// ─── Smart Record Saver (Header-Aware & Duplicate-Safe) ────────────────────────

function saveRecord(sheet, targetHeaders, dataMap, phoneColumnName) {
  const serverTimestamp = new Date().toISOString();

  // 1. Read existing row 1 headers
  let currentHeaders = [];
  const lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
      return String(h).trim();
    });
  }

  // 2. Ensure all required headers exist in the sheet
  targetHeaders.forEach(function(h) {
    if (currentHeaders.indexOf(h) === -1) {
      currentHeaders.push(h);
      const colIdx = currentHeaders.length;
      sheet.getRange(1, colIdx).setValue(h).setFontWeight('bold');
    }
  });

  // 3. Locate WhatsApp phone column
  const phoneIdx = currentHeaders.indexOf(phoneColumnName);
  const targetPhone = dataMap[phoneColumnName] || '';

  // 4. Check for existing row by WhatsApp phone number
  let existingRowIdx = -1;
  const lastRow = sheet.getLastRow();
  if (phoneIdx !== -1 && lastRow > 1) {
    const phoneValues = sheet.getRange(2, phoneIdx + 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < phoneValues.length; i++) {
      if (phonesMatch(phoneValues[i][0], targetPhone)) {
        existingRowIdx = i + 2; // 1-indexed, skipping header row
        break;
      }
    }
  }

  // 5. Build or merge row data mapped to exact column headers
  if (existingRowIdx > 0) {
    // Merge: update timestamp, overwrite non-empty fields, preserve existing data
    const existingRange = sheet.getRange(existingRowIdx, 1, 1, currentHeaders.length);
    const existingValues = existingRange.getValues()[0];

    const mergedRow = currentHeaders.map(function(headerName, idx) {
      if (headerName === 'Timestamp') return serverTimestamp;
      const incomingVal = dataMap[headerName];
      if (incomingVal !== undefined && incomingVal !== null && String(incomingVal).trim() !== '') {
        return incomingVal;
      }
      return (existingValues[idx] !== undefined && existingValues[idx] !== null) ? existingValues[idx] : '';
    });

    existingRange.setValues([mergedRow]);
    return { success: true, updated: true, message: 'Profil mis à jour avec succès.' };
  } else {
    // Insert: append new row aligned with current headers
    const newRow = currentHeaders.map(function(headerName) {
      if (headerName === 'Timestamp') return serverTimestamp;
      const incomingVal = dataMap[headerName];
      return (incomingVal !== undefined && incomingVal !== null) ? incomingVal : '';
    });

    sheet.appendRow(newRow);
    return { success: true, updated: false, message: 'Inscription enregistrée avec succès.' };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSpreadsheet() {
  if (typeof SPREADSHEET_ID === 'string' && SPREADSHEET_ID.trim() !== '') {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (err) {
      console.warn('Could not open by SPREADSHEET_ID, trying active sheet:', err);
    }
  }
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {
    console.warn('Could not get active spreadsheet:', err);
  }
  throw new Error('Spreadsheet could not be opened. Check SPREADSHEET_ID in Code.gs.');
}

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

function normalisePhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/\D/g, ''); // Keep digits only (strips +, spaces, dashes, quotes)
}

function phonesMatch(p1, p2) {
  const d1 = normalisePhone(p1);
  const d2 = normalisePhone(p2);
  if (!d1 || !d2) return false;
  if (d1 === d2) return true;
  // Handle DRC numbers: 243XXXXXXXXX (11-12 digits) vs 0XXXXXXXXX (10 digits)
  if (d1.length >= 9 && d2.length >= 9) {
    return d1.slice(-9) === d2.slice(-9);
  }
  return false;
}

function sanitize(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  // Formula injection prevention: prefix with single quote if starts with formula trigger (=, -, @)
  if (['=', '-', '@', '\t', '\r'].some(function(ch) { return str.startsWith(ch); })) {
    return "'" + str;
  }
  // Store phone numbers starting with + as text in Sheets so + is displayed cleanly
  if (str.startsWith('+')) {
    return "'" + str;
  }
  return str;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'Format de requête invalide.' };
  }

  const data = payload.data;
  if (!data || typeof data !== 'object') {
    return { ok: false, message: 'Données de formulaire manquantes.' };
  }

  if (!['brand', 'creator'].includes(data.role)) {
    return { ok: false, message: 'Rôle invalide (marque ou créateur requis).' };
  }

  if (!data.fullName || !String(data.fullName).trim()) {
    return { ok: false, message: 'Le nom est requis.' };
  }

  const phone = normalisePhone(data.whatsapp);
  if (!phone) {
    return { ok: false, message: 'Le numéro WhatsApp est requis.' };
  }

  if (!/^[0-9]{7,15}$/.test(phone)) {
    return { ok: false, message: 'Numéro WhatsApp invalide (entre 7 et 15 chiffres requis).' };
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
