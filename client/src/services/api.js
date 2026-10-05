/**
 * CampusMind X - Enhanced Service Layer (Phase 2)
 * Interfaces directly with Express + MongoDB REST API with resilient fallback and loading handling.
 */

import { currentStudent, allStudents } from "../data/students";
import { studentAcademicData } from "../data/academicData";
import { studentAttendanceData } from "../data/attendanceData";
import { studentSkillData } from "../data/skills";
import { studentRecommendations, facultyInterventionPrototypes } from "../data/recommendations";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export const apiService = {
  // Auth Token Helper
  getAuthToken() {
    return localStorage.getItem('campusmind_token') || null;
  },

  setAuthToken(token) {
    if (token) localStorage.setItem('campusmind_token', token);
    else localStorage.removeItem('campusmind_token');
  },

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  },

  // Health check
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[API Service] Backend health check failed, using fallback:', err.message);
    }
    return { status: "ok", mode: "mock-fallback", database: { engine: "In-Memory Fallback" } };
  },

  // Auth APIs
  async register(data) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success && json.token) {
        this.setAuthToken(json.token);
      }
      return json;
    } catch (err) {
      return { success: false, message: 'Network error or server unavailable. Please try again.' };
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success && json.token) {
        this.setAuthToken(json.token);
      }
      return json;
    } catch (err) {
      return { success: false, message: 'Network error or server unavailable. Please try again.' };
    }
  },

  async getMe() {
    try {
      const token = this.getAuthToken();
      if (!token) return { success: false, message: 'No token' };

      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        return await res.json();
      }
      return { success: false, message: 'Session expired or invalid' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async updateProfile(data) {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async forgotPassword(email) {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  async resetPassword(token, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  logout() {
    this.setAuthToken(null);
  },

  async demoLogin(role = 'student') {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const json = await res.json();
      if (json.success && json.token) {
        this.setAuthToken(json.token);
      }
      return json;
    } catch {
      return { success: true, token: 'mock-demo-token', user: { role } };
    }
  },

  // Student details
  async getCurrentStudent(identifier = "22BCA1042") {
    try {
      const res = await fetch(`${API_BASE}/students/${identifier}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load student from MongoDB, falling back:', err.message);
    }
    return currentStudent;
  },

  // Full student dashboard bundle
  async getStudentDashboardBundle(identifier = "22BCA1042") {
    try {
      const res = await fetch(`${API_BASE}/students/${identifier}/dashboard`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load dashboard bundle, using fallback:', err.message);
    }
    return null;
  },

  async getAllStudents(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/students${query ? `?${query}` : ''}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load students, using fallback:', err.message);
    }
    return allStudents;
  },

  // Attendance Analytics
  async getAttendanceRecords(studentId = null) {
    try {
      const url = studentId ? `${API_BASE}/attendance?student=${studentId}` : `${API_BASE}/attendance`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load attendance, using fallback:', err.message);
    }
    return studentAttendanceData.subjectWiseAttendance;
  },

  // Marks & Performance
  async getMarksRecords(studentId = null) {
    try {
      const url = studentId ? `${API_BASE}/marks?student=${studentId}` : `${API_BASE}/marks`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load marks, using fallback:', err.message);
    }
    return studentAcademicData.currentSubjects;
  },

  // Assignments
  async getAssignments(studentId = null) {
    try {
      const url = studentId ? `${API_BASE}/assignments?student=${studentId}` : `${API_BASE}/assignments`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load assignments, using fallback:', err.message);
    }
    return studentAcademicData.assignmentStatus.recentSubmissions;
  },

  // Skills
  async getSkills(studentId = null) {
    try {
      const url = studentId ? `${API_BASE}/skills?student=${studentId}` : `${API_BASE}/skills`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load skills, using fallback:', err.message);
    }
    return studentSkillData.skills;
  },

  // Recommendations (Phase 4 intelligent rule-based engine)
  async getRecommendations(studentId = '22BCA1042') {
    try {
      const url = studentId ? `${API_BASE}/recommendations/${studentId}` : `${API_BASE}/recommendations`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load recommendations, using fallback:', err.message);
    }
    return studentRecommendations;
  },

  // Notifications
  async getNotifications(studentId = null) {
    try {
      const url = studentId ? `${API_BASE}/notifications?student=${studentId}` : `${API_BASE}/notifications`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load notifications, using fallback:', err.message);
    }
    return null;
  },

  async markNotificationRead(id) {
    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  },

  // Faculty & Institutional Analytics
  async getAnalyticsOverview() {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Failed to load analytics from backend, using fallback:', err.message);
    }
    return {
      totalStudents: allStudents.length,
      highRiskCount: allStudents.filter((s) => s.riskLevel === "High").length,
      mediumRiskCount: allStudents.filter((s) => s.riskLevel === "Medium").length,
      lowRiskCount: allStudents.filter((s) => s.riskLevel === "Low").length,
      averageAttendance: 74.5,
      passPercentage: 86.4,
      department: studentAcademicData.departmentOverview,
      interventions: facultyInterventionPrototypes
    };
  },

  // AI Assistant Prototype Conversation
  async getAiAssistantReply(userQuery) {
    const q = userQuery.toLowerCase();
    
    if (q.includes("attendance") || q.includes("shortage") || q.includes("bca-504")) {
      return {
        reply: "Your overall attendance is **68%**, which is below the university 75% threshold. Specifically, Computer Networks (BCA-504) is at 48% and Data Structures (BCA-505) is at 62%. According to the academic recovery calculation, attending **10 consecutive scheduled lectures** will elevate your standing above 75%.",
        factors: [
          { name: "Computer Networks Attendance", value: "48%", impact: "Severe" },
          { name: "Consecutive Sessions Required", value: "10 classes", impact: "High Priority" }
        ],
        actionSuggestion: "Enroll in the Attendance Recovery Sprint and register your medical slip for Sept 24."
      };
    } else if (q.includes("dsa") || q.includes("data structure") || q.includes("performance") || q.includes("grade")) {
      return {
        reply: "Your current predicted GPA is **7.2**, with an overall performance of **71%**. The key bottleneck identified by feature attribution is **Data Structures & Algorithms II (58%)** with 1 overdue assignment (Dijkstra implementation). Web Tech remains your strongest course at **84%**.",
        factors: [
          { name: "DSA Internal Score", value: "16/30 (58%)", impact: "Negative (-14%)" },
          { name: "Full Stack Web Tech", value: "84%", impact: "Positive (+16%)" }
        ],
        actionSuggestion: "Join Dr. Sunita Kulkarni's Thursday DSA Remedial Clinic to submit the overdue graph assignment for partial evaluation."
      };
    } else if (q.includes("career") || q.includes("skill") || q.includes("full stack") || q.includes("roadmap")) {
      return {
        reply: "For your career goal as a **Full Stack Developer**, your current skill readiness index is **64%**. While your React frontend skills (78%) and SQL databases (72%) are on track, the primary hiring blockers are **System Design (42%)** and **Algorithmic Complexity (52%)**.",
        factors: [
          { name: "System Design Gap", value: "-28% deficit", impact: "High Priority" },
          { name: "DSA Gap", value: "-33% deficit", impact: "Critical Priority" }
        ],
        actionSuggestion: "Follow Milestone 1 of your Personalized Learning Roadmap to strengthen Graph Algorithms before starting Docker & Cloud modules."
      };
    }

    return {
      reply: `I have analyzed your BCA Semester 5 academic profile from MongoDB. With an overall performance of 71%, attendance of 68%, and assignment completion of 62%, your Academic Support Indicator is Medium. How can I help you regarding your grades, attendance clearance, or career roadmap today?`,
      factors: [
        { name: "Academic Support Indicator", value: "Medium", impact: "Active Monitoring" },
        { name: "Current CGPA", value: "7.42", impact: "Satisfactory" }
      ],
      actionSuggestion: "Try asking: 'Why is my DSA grade pulling down my predicted GPA?' or 'How many classes do I need to clear attendance?'"
    };
  },

  // Phase 3 - Real Python AI/ML Engine Endpoints (via Express Node Backend)
  async getAiHealth() {
    try {
      const res = await fetch(`${API_BASE}/ai/health`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('[API Service] AI Engine health check failed:', err.message);
    }
    return { success: false, data: { status: 'offline' } };
  },

  async predictRisk(academicData) {
    try {
      const res = await fetch(`${API_BASE}/ai/predict-risk`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(academicData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Risk prediction failed:', err.message);
    }
    return null;
  },

  async predictPerformance(academicData) {
    try {
      const res = await fetch(`${API_BASE}/ai/predict-performance`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(academicData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Performance prediction failed:', err.message);
    }
    return null;
  },

  // Phase 4: Explainable AI Engine
  async explainPrediction(academicData, target = 'risk') {
    try {
      const res = await fetch(`${API_BASE}/ai/explain`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ ...academicData, target })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Explain prediction failed:', err.message);
    }
    return null;
  },

  // Phase 4: Skill Gap Analysis Engine
  async analyzeSkillGap(payload = {}) {
    try {
      const res = await fetch(`${API_BASE}/skill-gap/analyze`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('[API Service] Skill gap analysis failed:', err.message);
    }
    return null;
  },

  // Phase 5: CampusMind AI Conversational Assistant
  async sendChatMessage(message, options = {}) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message,
          role: options.role || 'student',
          studentId: options.studentId || null,
          facultyId: options.facultyId || null,
          conversationId: options.conversationId || null
        })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      throw new Error(`API returned ${res.status}`);
    } catch (err) {
      console.warn('[API Service] Chat request failed, using local model synthesis:', err.message);
      return await this.getAiAssistantReply(message);
    }
  },

  async getChatHistory(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.studentId) params.append('studentId', options.studentId);
      if (options.conversationId) params.append('conversationId', options.conversationId);
      
      const res = await fetch(`${API_BASE}/ai/chat/history?${params.toString()}`, {
        headers: this.getHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn('[API Service] Failed to fetch chat history:', err.message);
    }
    return [];
  },

  async clearChatHistory(options = {}) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat/history`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify(options)
      });
      return res.ok;
    } catch (err) {
      console.warn('[API Service] Failed to clear chat history:', err.message);
      return false;
    }
  }
};

