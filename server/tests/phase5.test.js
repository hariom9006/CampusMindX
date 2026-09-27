import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ensureServer } from './setup.js';

const API_BASE = 'http://localhost:5000/api';

test('CampusMind AI Assistant - Phase 5 Comprehensive Suite', async (t) => {
  await ensureServer();

  // 1. Student Academic Factors
  await t.test('1. "What is affecting my academic performance?" - INTENT_ACADEMIC_FACTORS', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is affecting my academic performance?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.intent, 'INTENT_ACADEMIC_FACTORS');
    assert.ok(json.data.reply.includes('Academic Support Indicator'));
    assert.ok(json.data.factors.length >= 3);
    assert.ok(json.data.reply.includes('contributed to the model prediction'));
    // Ensure no causal claims
    assert.ok(!json.data.reply.toLowerCase().includes('caused the student'));
  });

  // 2. Student Weak Subjects
  await t.test('2. "What subjects need more attention?" - INTENT_WEAK_SUBJECTS', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What subjects need more attention?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_WEAK_SUBJECTS');
    assert.ok(json.data.reply.includes('Data Structures') || json.data.reply.includes('DSA'));
  });

  // 3. Student Attendance Status
  await t.test('3. "What is my attendance status?" - INTENT_ATTENDANCE_STATUS', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is my attendance status?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_ATTENDANCE_STATUS');
    assert.ok(json.data.reply.includes('68%'));
    assert.ok(json.data.reply.includes('75%'));
    assert.ok(json.data.reply.includes('consecutive'));
  });

  // 4. Student Skill Gaps
  await t.test('4. "What skills am I missing for Full Stack Development?" - INTENT_SKILL_GAPS', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What skills am I missing for Full Stack Development?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_SKILL_GAPS');
    assert.ok(json.data.reply.includes('Role Readiness Index'));
    assert.ok(json.data.factors.some(f => f.name === 'Target Career'));
  });

  // 5. Weekly Study Recommendation
  await t.test('5. "What should I study this week?" - INTENT_STUDY_RECOMMENDATION', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What should I study this week?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_STUDY_RECOMMENDATION');
    assert.ok(json.data.reply.includes('High Priority'));
    assert.ok(json.data.actionSuggestion != null);
  });

  // 6. Recommendation Explanation
  await t.test('6. "Why did the system recommend Node.js?" - INTENT_RECOMMENDATION_WHY', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Why did the system recommend Node.js?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_RECOMMENDATION_WHY');
    assert.ok(json.data.reply.includes('Full Stack Developer'));
    assert.ok(json.data.reply.includes('68%'));
    assert.ok(json.data.reply.includes('80%'));
  });

  // 7. Academic Trend
  await t.test('7. "Show my academic trend." - INTENT_ACADEMIC_TREND', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Show my academic trend.',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_ACADEMIC_TREND');
    assert.ok(json.data.reply.includes('Semester 1'));
    assert.ok(json.data.reply.includes('7.42'));
  });

  // 8. Assignment Status
  await t.test('8. "What are my pending assignments?" - INTENT_ASSIGNMENTS', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What are my pending assignments?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_ASSIGNMENTS');
    assert.ok(json.data.reply.includes('Dijkstra') || json.data.reply.includes('Overdue'));
  });

  // 9. Prediction & Risk Indicator
  await t.test('9. "What is my academic risk level and prediction?" - INTENT_PREDICTION_RISK', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is my academic risk level and prediction?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_PREDICTION_RISK');
    assert.ok(json.data.reply.includes('Academic Support Indicator'));
    assert.ok(json.data.reply.includes('probabilistic'));
  });

  // 10. Career Roadmap
  await t.test('10. "What is my career goal and roadmap?" - INTENT_CAREER_ROADMAP', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is my career goal and roadmap?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_CAREER_ROADMAP');
    assert.ok(json.data.reply.includes('Full Stack Developer'));
  });

  // 11. Faculty: Which students need attention?
  await t.test('11. "Which students need attention?" - INTENT_FACULTY_STUDENTS_NEED_ATTENTION', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Which students need attention?',
        role: 'faculty'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_FACULTY_STUDENTS_NEED_ATTENTION');
    assert.ok(json.data.reply.includes('Rohan Das') || json.data.reply.includes('Aarav Sharma'));
  });

  // 12. Faculty: Class attendance trend
  await t.test('12. "What is the class attendance trend?" - INTENT_FACULTY_ATTENDANCE_TREND', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is the class attendance trend?',
        role: 'faculty'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_FACULTY_ATTENDANCE_TREND');
    assert.ok(json.data.reply.includes('Cohort Average Attendance'));
  });

  // 13. Faculty: Lowest performing subject
  await t.test('13. "Which subject has the lowest average performance?" - INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Which subject has the lowest average performance?',
        role: 'faculty'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT');
    assert.ok(json.data.reply.includes('Computer Networks') || json.data.reply.includes('BCA-504'));
  });

  // 14. Admin: University academic health & retention
  await t.test('14. "What is the university academic health?" - INTENT_ADMIN_UNIVERSITY_OVERVIEW', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is the university academic health?',
        role: 'admin'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_ADMIN_UNIVERSITY_OVERVIEW');
    assert.ok(json.data.reply.includes('1,420 students') || json.data.reply.includes('Retention'));
  });

  // 15. Admin: Department comparison
  await t.test('15. "Which department has the highest retention and performance?" - INTENT_ADMIN_DEPARTMENT_PERFORMANCE', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Which department has the highest retention and performance?',
        role: 'admin'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_ADMIN_DEPARTMENT_PERFORMANCE');
    assert.ok(json.data.reply.includes('SCSE') || json.data.reply.includes('SOCIT'));
  });

  // 16. Privacy Guardrail: Cross-student data restriction
  await t.test('16. Privacy Guardrail - Cross-student query blocked', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Show me Priya marks and attendance',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_PRIVACY_BREACH_ATTEMPT');
    assert.ok(json.data.reply.includes('Access Restricted: Student Privacy Protection'));
  });

  // 17. Safety Guardrail: High-stakes certainty disclaimer
  await t.test('17. Safety Guardrail - High-stakes certainty disclaimed', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Can you guarantee that I will pass all my final exams?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_SAFETY_HIGH_STAKES');
    assert.ok(json.data.reply.includes('Probabilistic Guidance') || json.data.reply.includes('cannot make definitive promises'));
  });

  // 18. Fallback Intent for Unsupported Questions
  await t.test('18. Fallback Intent - Exact mandated text', async () => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How do I bake chocolate chip cookies at home?',
        role: 'student'
      })
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.intent, 'INTENT_FALLBACK');
    assert.equal(
      json.data.reply,
      'I can currently help with your academic performance, attendance, assignments, skills, recommendations and career roadmap.'
    );
  });

  // 19. Conversation History Retrieval & Clear
  await t.test('19. Conversation History API - Retrieve and Clear', async () => {
    const getRes = await fetch(`${API_BASE}/ai/chat/history`);
    assert.equal(getRes.status, 200);
    const getJson = await getRes.json();
    assert.equal(getJson.success, true);
    assert.ok(Array.isArray(getJson.data));

    const clearRes = await fetch(`${API_BASE}/ai/chat/history`, {
      method: 'DELETE'
    });
    assert.equal(clearRes.status, 200);
    const clearJson = await clearRes.json();
    assert.equal(clearJson.success, true);
  });
});
