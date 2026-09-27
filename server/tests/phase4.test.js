/**
 * CampusMind X - Phase 4 Unit Test Suite
 * Validates:
 * 1. Risk Explanation (intelligibility, contribution levels, non-causal phrasing)
 * 2. Skill Gap Calculation (transparent formulas, priorities, readiness index)
 * 3. Recommendation Generation (coverage across 5 categories, explicit Why explanation)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { skillGapService } from '../src/services/skillGapService.js';
import { recommendationEngineService } from '../src/services/recommendationEngineService.js';
import { ensureServer } from './setup.js';

// ============================================================================
// 1. UNIT TESTS: RISK EXPLANATION & NON-CAUSAL PHRASING
// ============================================================================
test('Explainable AI - Non-causal phrasing and contribution tiers validation', async (t) => {
  await ensureServer();
  const mockAcademicPayload = {
    attendance: 68.0,
    assignment_completion: 62.0,
    internal_marks: 16.0,
    previous_gpa: 7.42,
    recent_trend: -0.3,
    core_subject_score: 58.0,
    study_hours_weekly: 14.5,
    missed_labs: 4
  };

  let explanation;
  try {
    const res = await fetch('http://localhost:5000/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockAcademicPayload)
    });
    const json = await res.json();
    explanation = json.data;
  } catch (err) {
    // If server fetch is running in isolated test mode
    assert.fail(`Explain API call failed: ${err.message}`);
  }

  assert.ok(explanation, 'Explanation object should be returned');
  assert.match(explanation.prediction, /Low|Medium|High/, 'Prediction must be Low, Medium, or High');
  assert.ok(explanation.confidence >= 0 && explanation.confidence <= 1.0, 'Confidence must be between 0 and 1');

  // Verify non-causal phrasing constraints
  const summary = explanation.plain_language_summary.toLowerCase();
  assert.ok(
    !summary.includes('caused the student') &&
    !summary.includes('forced the student') &&
    !summary.includes('sole reason for failure'),
    'Explanation must NOT make absolute causal claims'
  );
  assert.ok(
    summary.includes('contributed') || summary.includes('indicator'),
    'Explanation must use correlational/contributory language'
  );

  // Verify contributing factors
  assert.ok(Array.isArray(explanation.contributing_factors), 'Contributing factors must be an array');
  assert.ok(explanation.contributing_factors.length >= 4, 'Must have at least 4 feature factors');

  const validLevels = ['High contribution', 'Medium contribution', 'Low contribution'];
  explanation.contributing_factors.forEach((factor) => {
    assert.ok(factor.label, 'Factor must have a readable label');
    assert.ok(validLevels.includes(factor.contribution_level), `Factor contribution_level must be one of: ${validLevels.join(', ')}`);
    assert.ok(factor.student_value, 'Factor must show student value');
    assert.ok(factor.cohort_benchmark, 'Factor must show cohort benchmark');
    assert.ok(
      factor.explanation.includes('contributed'),
      `Factor explanation must use non-causal phrasing ('contributed'): ${factor.explanation}`
    );
  });
});

// ============================================================================
// 2. UNIT TESTS: SKILL GAP CALCULATION & SCORING RULES
// ============================================================================
test('Skill Gap Engine - Gap formula and priority thresholds', () => {
  const testSkills = [
    { skillName: 'HTML & Semantic CSS', currentLevel: 85 },  // target 85 -> gap 0 (Mastered/Low)
    { skillName: 'JavaScript (ES6+)', currentLevel: 70 },    // target 85, critical -> gap 15 (Medium)
    { skillName: 'React.js & State Management', currentLevel: 55 }, // target 80, critical -> gap 25 (High due to critical && gap >= 20)
    { skillName: 'Node.js & Runtime Internals', currentLevel: 45 }, // target 80, critical -> gap 35 (High due to gap >= 30)
    { skillName: 'Deployment & Containerization', currentLevel: 55 } // target 65, non-critical -> gap 10 (Low)
  ];

  const analysis = skillGapService.analyzeSkillGap({
    currentSkills: testSkills,
    careerTarget: 'Full Stack Developer'
  });

  assert.equal(analysis.careerTarget, 'Full Stack Developer');
  assert.ok(analysis.readinessPercentage > 0 && analysis.readinessPercentage <= 100);

  // Check specific skills in the evaluation
  const htmlSkill = analysis.skills.find((s) => s.skill.includes('HTML'));
  assert.ok(htmlSkill);
  assert.equal(htmlSkill.currentLevel, 85);
  assert.equal(htmlSkill.gap, 0);
  assert.equal(htmlSkill.status, 'Mastered');
  assert.equal(htmlSkill.priority, 'Low');

  const nodeSkill = analysis.skills.find((s) => s.skill.includes('Node.js'));
  assert.ok(nodeSkill);
  assert.equal(nodeSkill.currentLevel, 45);
  assert.equal(nodeSkill.gap, 35);
  assert.equal(nodeSkill.priority, 'High');
  assert.equal(nodeSkill.status, 'Critical Gap');

  const deploySkill = analysis.skills.find((s) => s.skill.includes('Deployment'));
  assert.ok(deploySkill);
  assert.equal(deploySkill.currentLevel, 55);
  assert.equal(deploySkill.gap, 10);
  assert.equal(deploySkill.priority, 'Low');
  assert.equal(deploySkill.status, 'On Track');

  // Verify scoring methodology is returned for transparency
  assert.ok(analysis.scoringMethod, 'Scoring method documentation must be included in response');
  assert.equal(analysis.scoringMethod.formula, 'gap = Math.max(0, targetLevel - currentLevel)');
});

test('Skill Gap Engine - Multi-career target support', () => {
  const roles = [
    'Full Stack Developer',
    'Data Analyst / Data Scientist',
    'Cloud & DevOps Engineer',
    'Cybersecurity Analyst',
    'AI / Machine Learning Engineer'
  ];

  roles.forEach((role) => {
    const res = skillGapService.analyzeSkillGap({
      currentSkills: [{ skillName: 'Python', currentLevel: 70 }],
      careerTarget: role
    });
    assert.equal(res.careerTarget, role);
    assert.ok(res.skills.length >= 5, `${role} must have at least 5 benchmarked competencies`);
  });
});

// ============================================================================
// 3. UNIT TESTS: RECOMMENDATION ENGINE
// ============================================================================
test('Recommendation Engine - 5 categories and Why explanation generation', async () => {
  const res = await fetch('http://localhost:5000/api/recommendations/22BCA1042');
  const json = await res.json();

  assert.equal(json.success, true, 'API should return success: true');
  assert.ok(Array.isArray(json.data), 'Must return an array of recommendations');
  assert.ok(json.data.length >= 4, 'Must generate at least 4 targeted recommendations');

  const requiredCategories = ['Academic', 'Attendance', 'Assignment', 'Skill Development', 'Career'];
  const generatedCategories = json.data.map((r) => r.category);

  requiredCategories.forEach((cat) => {
    assert.ok(
      generatedCategories.includes(cat),
      `Recommendation engine must include at least one recommendation in '${cat}' category. Generated: ${generatedCategories.join(', ')}`
    );
  });

  // Verify each recommendation contains the explicit "Why am I seeing this recommendation?" explanation
  json.data.forEach((rec) => {
    assert.ok(rec.title, 'Recommendation must have a title');
    assert.ok(rec.impactRating, 'Recommendation must specify an impact rating');
    assert.ok(Array.isArray(rec.actionPlan) && rec.actionPlan.length > 0, 'Must have concrete action plan');
    assert.ok(
      rec.rationale.startsWith('Why am I seeing this recommendation?'),
      `Rationale must start with 'Why am I seeing this recommendation?'. Found: ${rec.rationale}`
    );
  });

  // Verify attendance recovery calculation
  const attendanceRec = json.data.find((r) => r.category === 'Attendance');
  assert.ok(attendanceRec, 'Must have attendance recommendation for student with attendance < 75%');
  assert.match(attendanceRec.rationale, /consecutive scheduled classes/, 'Must mention consecutive classes needed for 75% clearance');
});
