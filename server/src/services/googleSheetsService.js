import { google } from 'googleapis';

/**
 * CampusMind X - Secure User Activity Tracking via Google Sheets API
 * 
 * Records:
 * - ACCOUNT_CREATED (upon successful registration)
 * - SIGN_IN (upon successful authentication)
 * - LOGOUT (upon user session termination)
 * 
 * Columns:
 * Timestamp | Name | Email | Role | Action | Device | Browser | Platform
 * 
 * Security:
 * - Purely server-side; credentials never exposed to client or browser
 * - Sensitive credentials (passwords, hashes, JWTs) are strictly omitted
 * - Non-blocking: Failures in Google Sheets API will NEVER disrupt authentication or user experience
 */

// Deduplication guard for registration events
const recordedRegistrations = new Set();

/**
 * Detect client device, browser, and platform from user-agent header.
 * Collects only basic non-sensitive client environment metadata.
 */
export function parseClientInfo(req) {
  const ua = req?.headers?.['user-agent'] || '';

  // 1. Device
  let device = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    device = 'Mobile';
  }

  // 2. Browser
  let browser = 'Unknown Browser';
  if (/edg([ea])?\//i.test(ua)) {
    browser = 'Edge';
  } else if (/opr\/|opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/i.test(ua)) {
    browser = 'Safari';
  }

  // 3. Platform
  let platform = 'Unknown Platform';
  if (/windows/i.test(ua)) {
    platform = 'Windows';
  } else if (/macintosh|mac os x/i.test(ua)) {
    platform = 'macOS';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    platform = 'iOS';
  } else if (/android/i.test(ua)) {
    platform = 'Android';
  } else if (/linux/i.test(ua)) {
    platform = 'Linux';
  }

  return { device, browser, platform };
}

let isHeaderInitialized = false;

/**
 * Ensure the spreadsheet has the standard header row.
 */
async function ensureHeaders(sheets, spreadsheetId) {
  if (isHeaderInitialized) return;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:H1'
    });

    if (!res.data.values || res.data.values.length === 0 || !res.data.values[0] || res.data.values[0].length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'A1:H1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            ['Timestamp', 'Name', 'Email', 'Role', 'Action', 'Device', 'Browser', 'Platform']
          ]
        }
      });
      console.log('✓ [Google Sheets] Standard activity columns initialized in spreadsheet');
    }
    isHeaderInitialized = true;
  } catch (err) {
    // If permission or range issue occurs on get, proceed with append
    console.warn('[Google Sheets] Note during header check:', err.message);
  }
}

/**
 * Record a user activity row into Google Sheets.
 * Completely non-blocking and safe against unhandled exceptions.
 */
export async function logActivity({ name, email, role, action, req }) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  const { device, browser, platform } = parseClientInfo(req);
  const timestamp = new Date().toISOString();

  // If Google Sheets credentials are not configured, log locally and exit safely
  if (!spreadsheetId || !clientEmail || !privateKeyRaw) {
    console.log(
      `ℹ [User Activity] ${action} | ${name} (${email}) | ${role} | ${device} / ${browser} / ${platform} [Google Sheets credentials not set in env]`
    );
    return { success: false, skipped: true, reason: 'Credentials not configured' };
  }

  try {
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await ensureHeaders(sheets, spreadsheetId);

    const row = [
      timestamp,
      name || 'Anonymous User',
      email || 'unknown@campusmind.edu',
      role || 'student',
      action,
      device,
      browser,
      platform
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:H',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row]
      }
    });

    console.log(`✓ [Google Sheets] Recorded ${action} for ${email} (${device}/${browser}/${platform})`);
    return { success: true };
  } catch (err) {
    // Safe logging without exposing sensitive data
    console.error(`❌ [Google Sheets] Failed to record ${action} for ${email}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Log ACCOUNT_CREATED after user creation in database
 */
export async function logAccountCreated(user, req) {
  if (!user) return;
  const userIdStr = user._id ? user._id.toString() : user.id;

  // Prevent duplicate registration log if retried
  if (userIdStr && recordedRegistrations.has(userIdStr)) {
    return { success: true, skipped: true, reason: 'Duplicate registration log prevented' };
  }
  if (userIdStr) {
    recordedRegistrations.add(userIdStr);
  }

  return await logActivity({
    name: user.name,
    email: user.email,
    role: user.role,
    action: 'ACCOUNT_CREATED',
    req
  });
}

/**
 * Log SIGN_IN after successful authentication
 */
export async function logSignIn(user, req) {
  if (!user) return;
  return await logActivity({
    name: user.name,
    email: user.email,
    role: user.role,
    action: 'SIGN_IN',
    req
  });
}

/**
 * Log LOGOUT upon session termination
 */
export async function logLogout(user, req) {
  return await logActivity({
    name: user?.name || 'Authenticated User',
    email: user?.email || req?.body?.email || 'user@campusmind.edu',
    role: user?.role || req?.body?.role || 'student',
    action: 'LOGOUT',
    req
  });
}

export default {
  parseClientInfo,
  logActivity,
  logAccountCreated,
  logSignIn,
  logLogout
};
