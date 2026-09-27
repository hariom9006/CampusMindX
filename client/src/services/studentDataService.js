/**
 * CampusMind X - Student Data Service (Personal Analysis Mode)
 * Manages persistence of student-entered academic, attendance, assignment,
 * skill, project, and career data in browser localStorage.
 */

const STORAGE_KEY = 'campusmind_personal_student_data';
const ANALYSIS_STORAGE_KEY = 'campusmind_personal_analysis_results';

export const studentDataService = {
  // Save or replace student input data
  saveStudentData(data) {
    try {
      const payload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return { success: true, data: payload };
    } catch (err) {
      console.error('[StudentDataService] Error saving to localStorage:', err);
      return { success: false, error: err.message };
    }
  },

  // Load student input data (returns null if empty)
  loadStudentData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('[StudentDataService] Error loading from localStorage:', err);
      return null;
    }
  },

  // Update specific fields
  updateStudentData(partialData) {
    try {
      const existing = this.loadStudentData() || {};
      const updated = {
        ...existing,
        ...partialData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, data: updated };
    } catch (err) {
      console.error('[StudentDataService] Error updating localStorage:', err);
      return { success: false, error: err.message };
    }
  },

  // Clear personal data
  clearStudentData() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ANALYSIS_STORAGE_KEY);
      return { success: true };
    } catch (err) {
      console.error('[StudentDataService] Error clearing localStorage:', err);
      return { success: false, error: err.message };
    }
  },

  // Cache calculated analysis results
  saveAnalysisResults(results) {
    try {
      localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify({
        ...results,
        generatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.error('[StudentDataService] Error saving analysis results:', err);
    }
  },

  // Load cached analysis results
  loadAnalysisResults() {
    try {
      const raw = localStorage.getItem(ANALYSIS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  },

  // Check if personal data exists
  hasPersonalData() {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};

export default studentDataService;
