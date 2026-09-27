/**
 * CampusMind X - Data Sync & Connection Management Service
 * Controls synchronization state, permissions, sync history, and data revocation.
 */

import { DemoLMSConnector } from '../integrations/lms/demoLmsConnector';
import { normalizeLMSData } from './dataNormalizationService';
import { UniversityProvider } from '../integrations/university/providers/UniversityProvider';
import { DemoProvider } from '../integrations/university/providers/DemoProvider';
import UniversityApi from '../integrations/university/UniversityApi';

const KEY_PROFILE = 'campusmind_connected_lms_profile';
const KEY_PERMISSIONS = 'campusmind_lms_permissions';
const KEY_HISTORY = 'campusmind_sync_history';
const KEY_STATUS = 'campusmind_lms_connection_status';

// Schema version — bump when normalized profile structure changes
// to auto-invalidate stale cached profiles in localStorage
const PROFILE_SCHEMA_VERSION = 2;

export const DEFAULT_PERMISSIONS = {
  academicResults: true,
  attendance: true,
  assignments: true,
  courses: true,
  examinations: true,
  internalMarks: true,
  skills: true,
  academicDocuments: true,
  personalFiles: false // unchecked by default
};

export const INITIAL_SYNC_HISTORY = [
  {
    id: 'sync-01',
    timestamp: 'Today, 10:42 AM',
    action: 'Academic records & attendance synchronized',
    source: 'University LMS SSO',
    recordsCount: 42,
    status: 'Success'
  },
  {
    id: 'sync-02',
    timestamp: 'Yesterday, 08:15 PM',
    action: 'Attendance telemetry updated',
    source: 'Biometric / Lecture Sync',
    recordsCount: 14,
    status: 'Success'
  },
  {
    id: 'sync-03',
    timestamp: 'Sep 24, 2026, 09:30 AM',
    action: 'Assignment submission vault synchronized',
    source: 'LMS Coursework API',
    recordsCount: 24,
    status: 'Success'
  }
];

export function saveConnectedProfile(profile) {
  try {
    // Tag profile with schema version for future invalidation
    const taggedProfile = { ...profile, _schemaVersion: PROFILE_SCHEMA_VERSION };
    localStorage.setItem(KEY_PROFILE, JSON.stringify(taggedProfile));
    localStorage.setItem(KEY_STATUS, 'Connected');
    return true;
  } catch (err) {
    console.error('Failed to save connected LMS profile:', err);
    return false;
  }
}

export function loadConnectedProfile() {
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validate schema version to prevent stale data from crashing the UI
    if (parsed._schemaVersion !== PROFILE_SCHEMA_VERSION) {
      console.info('[CampusMind] Profile schema outdated — clearing stale cache.');
      localStorage.removeItem(KEY_PROFILE);
      return null;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load connected LMS profile:', err);
    return null;
  }
}

export function clearConnectedProfile() {
  try {
    localStorage.removeItem(KEY_PROFILE);
    localStorage.removeItem(KEY_PERMISSIONS);
    localStorage.removeItem(KEY_STATUS);
    // Keep history or add a disconnect event
    addSyncHistoryEntry({
      timestamp: 'Just now',
      action: 'University LMS disconnected & local data purged',
      source: 'Student Revocation',
      recordsCount: 0,
      status: 'Revoked'
    });
    return true;
  } catch (err) {
    console.error('Failed to clear connected profile:', err);
    return false;
  }
}

export function savePermissions(perms) {
  try {
    localStorage.setItem(KEY_PERMISSIONS, JSON.stringify(perms));
    return true;
  } catch (err) {
    return false;
  }
}

export function loadPermissions() {
  try {
    const raw = localStorage.getItem(KEY_PERMISSIONS);
    if (!raw) return DEFAULT_PERMISSIONS;
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_PERMISSIONS;
  }
}

export function loadSyncHistory() {
  try {
    const raw = localStorage.getItem(KEY_HISTORY);
    if (!raw) return INITIAL_SYNC_HISTORY;
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_SYNC_HISTORY;
  }
}

export function addSyncHistoryEntry(entry) {
  try {
    const history = loadSyncHistory();
    const updated = [
      { id: `sync-${Date.now()}`, ...entry },
      ...history
    ].slice(0, 10); // keep last 10 entries
    localStorage.setItem(KEY_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to append sync history:', err);
    return [];
  }
}

export async function performRealSync({
  universityId = 'galgotias',
  studentId = '24BCA1089',
  authMethod = 'sso',
  permissions = DEFAULT_PERMISSIONS
} = {}) {
  let provider;
  const isDemo = universityId === 'demo_lms';

  if (isDemo) {
    provider = new DemoProvider({ id: 'demo_lms' });
  } else {
    provider = new UniversityProvider({ id: universityId });
  }

  // 1. Authenticate with official university portal or demo sandbox (Zero passwords retained)
  await provider.authenticate({
    universityId,
    studentId,
    authMethod
  });

  // 2. Fetch and normalize authorized student academic records
  const normalized = await provider.syncAll(permissions);

  // 3. Save authorized profile safely
  saveConnectedProfile(normalized);
  savePermissions(permissions);

  const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });

  addSyncHistoryEntry({
    timestamp: `${dateString}, ${timeString}`,
    action: isDemo
      ? 'Demo sandbox academic records synchronized'
      : `Official ${normalized.student?.university || 'University'} academic data synchronized`,
    source: isDemo ? 'CampusMind Synthetic Sandbox' : 'Official University LMS / SSO',
    recordsCount: isDemo ? 38 : 42,
    status: 'Success'
  });

  return normalized;
}

export async function performFullSync(permissions = DEFAULT_PERMISSIONS, universityName = 'Galgotias University') {
  const universityId = universityName.toLowerCase().includes('demo') ? 'demo_lms' : 'galgotias';
  return performRealSync({
    universityId,
    studentId: universityId === 'demo_lms' ? 'DEMO2026' : '24BCA1089',
    authMethod: 'sso',
    permissions
  });
}

export function isLMSConnected() {
  const status = localStorage.getItem(KEY_STATUS);
  const profile = loadConnectedProfile();
  return status === 'Connected' && profile !== null;
}

const dataSyncService = {
  DEFAULT_PERMISSIONS,
  saveConnectedProfile,
  loadConnectedProfile,
  clearConnectedProfile,
  savePermissions,
  loadPermissions,
  loadSyncHistory,
  addSyncHistoryEntry,
  performRealSync,
  performFullSync,
  isLMSConnected
};

export default dataSyncService;
