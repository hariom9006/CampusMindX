/**
 * CampusMind X - Skill Gap Analysis Engine (Phase 4)
 * Evaluates student competencies against industry benchmarked career targets.
 * 
 * SCORING LOGIC SPECIFICATION:
 * 1. Gap Calculation:
 *    gap_i = Math.max(0, targetLevel_i - currentLevel_i)
 * 
 * 2. Priority Classification:
 *    - HIGH: gap >= 30 OR (isCriticalSkill && gap >= 20)
 *    - MEDIUM: 15 <= gap < 30
 *    - LOW: gap < 15
 * 
 * 3. Status Classification:
 *    - 'Mastered': currentLevel >= targetLevel (gap == 0)
 *    - 'On Track': gap < 15
 *    - 'Moderate Gap': 15 <= gap < 30
 *    - 'Critical Gap': gap >= 30
 * 
 * 4. Overall Role Readiness Index:
 *    readinessPercentage = (sum(min(currentLevel_i, targetLevel_i) * weight_i) / sum(targetLevel_i * weight_i)) * 100
 */

export const CAREER_ROLE_BENCHMARKS = {
  'Full Stack Developer': [
    { skill: 'HTML & Semantic CSS', category: 'Frontend', targetLevel: 85, weight: 1.0, critical: false, action: 'Refine CSS Grid, Flexbox layouts, and WCAG accessibility standards.' },
    { skill: 'JavaScript (ES6+)', category: 'Frontend', targetLevel: 85, weight: 1.2, critical: true, action: 'Master closures, async/await, Event Loop mechanics, and prototype chains.' },
    { skill: 'React.js & State Management', category: 'Frontend', targetLevel: 80, weight: 1.2, critical: true, action: 'Build custom hooks, context workflows, and optimize render cycles.' },
    { skill: 'Tailwind CSS & Modern UI', category: 'Frontend', targetLevel: 75, weight: 0.9, critical: false, action: 'Implement dark-mode glassmorphic themes and responsive breakpoints.' },
    { skill: 'Node.js & Runtime Internals', category: 'Backend', targetLevel: 80, weight: 1.3, critical: true, action: 'Build non-blocking I/O event-driven microservices and stream handlers.' },
    { skill: 'Express.js & Middleware', category: 'Backend', targetLevel: 80, weight: 1.1, critical: true, action: 'Implement modular REST routers, centralized error middleware, and rate limiting.' },
    { skill: 'RESTful API Architecture', category: 'Backend', targetLevel: 85, weight: 1.2, critical: true, action: 'Design idempotent endpoints, HTTP status standards, and request validators.' },
    { skill: 'Authentication & JWT', category: 'Backend', targetLevel: 75, weight: 1.1, critical: true, action: 'Secure endpoints with salted bcrypt hashing and JWT bearer tokens.' },
    { skill: 'MongoDB & Mongoose ODM', category: 'Databases', targetLevel: 75, weight: 1.1, critical: true, action: 'Design document schemas, pre/post hooks, and aggregation pipelines.' },
    { skill: 'SQL & Relational Modeling', category: 'Databases', targetLevel: 70, weight: 1.0, critical: false, action: 'Practice normalized schema design and complex multi-table JOINs.' },
    { skill: 'Data Structures & Algorithms', category: 'Core CS', targetLevel: 80, weight: 1.3, critical: true, action: 'Focus on graphs, dynamic programming, and binary search trees.' },
    { skill: 'System Design Basics', category: 'Core CS', targetLevel: 70, weight: 1.2, critical: true, action: 'Study caching, load balancing, stateless sessions, and database indexing.' },
    { skill: 'Git & GitHub Collaboration', category: 'DevOps', targetLevel: 80, weight: 1.0, critical: false, action: 'Master feature branch workflows, rebase rebasing, and pull request reviews.' },
    { skill: 'Deployment & Containerization', category: 'DevOps', targetLevel: 65, weight: 0.9, critical: false, action: 'Containerize multi-container apps using Docker Compose and deploy to cloud.' }
  ],

  'Data Analyst / Data Scientist': [
    { skill: 'Python for Data Analysis', category: 'Programming', targetLevel: 85, weight: 1.3, critical: true, action: 'Master list comprehensions, vectorization, and clean functional scripts.' },
    { skill: 'SQL & Query Optimization', category: 'Databases', targetLevel: 85, weight: 1.3, critical: true, action: 'Write window functions, CTEs, and perform analytical aggregations.' },
    { skill: 'Pandas & NumPy Wrangling', category: 'Data Engineering', targetLevel: 85, weight: 1.2, critical: true, action: 'Clean missing data, handle datetime series, and optimize DataFrame operations.' },
    { skill: 'Data Visualization & BI', category: 'Visualization', targetLevel: 80, weight: 1.1, critical: false, action: 'Build interactive dashboards using Tableau, Power BI, or Seaborn/Recharts.' },
    { skill: 'Statistical Inference', category: 'Mathematics', targetLevel: 75, weight: 1.2, critical: true, action: 'Understand hypothesis testing, p-values, confidence intervals, and distributions.' },
    { skill: 'Scikit-Learn Machine Learning', category: 'Machine Learning', targetLevel: 75, weight: 1.2, critical: true, action: 'Train classification/regression pipelines with cross-validation and hyperparameter tuning.' },
    { skill: 'Data Cleaning & ETL Pipelines', category: 'Data Engineering', targetLevel: 80, weight: 1.1, critical: false, action: 'Automate ingestion scripts, schema validation, and outlier transformation.' }
  ],

  'Cloud & DevOps Engineer': [
    { skill: 'Linux Administration & Shell', category: 'Operating Systems', targetLevel: 85, weight: 1.3, critical: true, action: 'Master bash scripting, process management, and permissions auditing.' },
    { skill: 'Git & Version Control', category: 'Tooling', targetLevel: 80, weight: 1.0, critical: false, action: 'Automate git hooks and branch protection policies.' },
    { skill: 'Docker Containerization', category: 'Containers', targetLevel: 85, weight: 1.3, critical: true, action: 'Write multi-stage Dockerfiles and minimize container image footprint.' },
    { skill: 'Kubernetes Orchestration', category: 'Containers', targetLevel: 75, weight: 1.2, critical: true, action: 'Deploy pods, services, ingress controllers, and config maps.' },
    { skill: 'CI/CD Automation Pipelines', category: 'DevOps', targetLevel: 80, weight: 1.2, critical: true, action: 'Build automated test, build, and deploy GitHub Actions workflows.' },
    { skill: 'AWS / Cloud Infrastructure', category: 'Cloud', targetLevel: 80, weight: 1.2, critical: true, action: 'Provision VPCs, EC2 instances, S3 buckets, and IAM roles.' },
    { skill: 'Networking & Protocol Security', category: 'Infrastructure', targetLevel: 75, weight: 1.1, critical: false, action: 'Understand TCP/IP, DNS routing, TLS termination, and firewall rules.' }
  ],

  'Cybersecurity Analyst': [
    { skill: 'Network Protocols & Packet Analysis', category: 'Networking', targetLevel: 85, weight: 1.3, critical: true, action: 'Analyze network captures using Wireshark and inspect header payloads.' },
    { skill: 'Linux & Scripting for Security', category: 'Systems', targetLevel: 80, weight: 1.1, critical: true, action: 'Write automated reconnaissance and log analysis bash/python scripts.' },
    { skill: 'Vulnerability Scanning & CVEs', category: 'Security Ops', targetLevel: 80, weight: 1.2, critical: true, action: 'Audit configurations using Nmap, Nessus, and OWASP ZAP scanners.' },
    { skill: 'Ethical Hacking Foundations', category: 'Offensive Security', targetLevel: 75, weight: 1.2, critical: false, action: 'Study injection attacks, CSRF, XSS, and privilege escalation vectors.' },
    { skill: 'Cryptography Fundamentals', category: 'Security Principles', targetLevel: 75, weight: 1.1, critical: true, action: 'Master symmetric vs asymmetric encryption, hashing, and PKI certs.' },
    { skill: 'SIEM & Incident Monitoring', category: 'Defensive Security', targetLevel: 70, weight: 1.1, critical: false, action: 'Configure alert correlation rules and analyze Windows/Linux audit logs.' }
  ],

  'AI / Machine Learning Engineer': [
    { skill: 'Advanced Python & OOP', category: 'Programming', targetLevel: 90, weight: 1.3, critical: true, action: 'Write high-performance vectorized code and design clean object hierarchies.' },
    { skill: 'Linear Algebra & Calculus', category: 'Mathematics', targetLevel: 80, weight: 1.2, critical: true, action: 'Understand matrix transformations, eigenvalues, and gradient descent.' },
    { skill: 'Data Structures & Algorithms', category: 'Core CS', targetLevel: 85, weight: 1.3, critical: true, action: 'Optimize algorithmic time/space complexities for big data processing.' },
    { skill: 'Scikit-Learn & Classical ML', category: 'Machine Learning', targetLevel: 85, weight: 1.2, critical: true, action: 'Master ensemble methods, cross-validation, and metrics evaluation.' },
    { skill: 'Deep Learning (PyTorch/TensorFlow)', category: 'Deep Learning', targetLevel: 80, weight: 1.3, critical: true, action: 'Train neural architectures, backprop, embeddings, and attention.' },
    { skill: 'MLOps & FastAPI Model Serving', category: 'Deployment', targetLevel: 75, weight: 1.1, critical: false, action: 'Deploy serialized joblib/onnx models behind low-latency REST endpoints.' }
  ]
};

export const skillGapService = {
  /**
   * Evaluates skill gap between current assessed levels and role requirements.
   * @param {Object} params
   * @param {Array} params.currentSkills - Array of { skillName, level, category } or map
   * @param {string} params.careerTarget - Role identifier (e.g. 'Full Stack Developer')
   * @returns {Object} Structured analysis with gap, priority, and readiness score
   */
  analyzeSkillGap({ currentSkills = [], careerTarget = 'Full Stack Developer' }) {
    // Normalize target role name
    let matchedRoleKey = Object.keys(CAREER_ROLE_BENCHMARKS).find(
      (k) => k.toLowerCase() === careerTarget.toLowerCase() ||
             careerTarget.toLowerCase().includes(k.toLowerCase()) ||
             k.toLowerCase().includes(careerTarget.toLowerCase())
    );

    if (!matchedRoleKey) {
      matchedRoleKey = 'Full Stack Developer';
    }

    const roleBenchmarks = CAREER_ROLE_BENCHMARKS[matchedRoleKey];

    // Build lookup dictionary from student's current skills
    const currentLookup = {};
    if (Array.isArray(currentSkills)) {
      currentSkills.forEach((s) => {
        const name = (s.skillName || s.name || s.skill || '').toLowerCase().trim();
        const level = Number(s.currentLevel ?? s.level ?? 0);
        if (name) currentLookup[name] = level;
      });
    }

    let totalWeightedCurrent = 0;
    let totalWeightedTarget = 0;
    let highPriorityCount = 0;
    let moderateGapCount = 0;
    let masteredCount = 0;

    const evaluatedSkills = roleBenchmarks.map((benchmark) => {
      // Find matching current skill or fuzzy substring match
      const benchNameLower = benchmark.skill.toLowerCase();
      let assessedLevel = currentLookup[benchNameLower];

      if (assessedLevel === undefined) {
        // Try substring matching
        const matchingKey = Object.keys(currentLookup).find(
          (k) => benchNameLower.includes(k) || k.includes(benchNameLower.split(' ')[0])
        );
        assessedLevel = matchingKey ? currentLookup[matchingKey] : 0;
      }

      assessedLevel = Math.min(100, Math.max(0, assessedLevel));
      const targetLevel = benchmark.targetLevel;
      const rawGap = targetLevel - assessedLevel;
      const gap = Math.max(0, rawGap);

      // Priority Classification:
      // High: gap >= 30 OR (critical prerequisite && gap >= 20)
      // Medium: 15 <= gap < 30
      // Low: gap < 15
      let priority = 'Low';
      if (gap >= 30 || (benchmark.critical && gap >= 20)) {
        priority = 'High';
        highPriorityCount++;
      } else if (gap >= 15) {
        priority = 'Medium';
        moderateGapCount++;
      } else {
        priority = 'Low';
        if (gap === 0) masteredCount++;
      }

      // Status classification
      let status = 'Critical Gap';
      if (gap === 0) status = 'Mastered';
      else if (gap < 15) status = 'On Track';
      else if (gap < 30) status = 'Moderate Gap';

      // Weight accumulation for overall role readiness
      const effectiveCap = Math.min(assessedLevel, targetLevel);
      totalWeightedCurrent += effectiveCap * benchmark.weight;
      totalWeightedTarget += targetLevel * benchmark.weight;

      return {
        skill: benchmark.skill,
        category: benchmark.category,
        currentLevel: assessedLevel,
        targetLevel: targetLevel,
        gap: gap,
        priority: priority,
        status: status,
        critical: benchmark.critical,
        action: benchmark.action
      };
    });

    // Calculate Overall Readiness Index Percentage
    const readinessPercentage = totalWeightedTarget > 0
      ? Math.round((totalWeightedCurrent / totalWeightedTarget) * 100)
      : 0;

    // Sort evaluated skills: High priority first, then descending by gap
    evaluatedSkills.sort((a, b) => {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return b.gap - a.gap;
    });

    // Grouping by category for radar visualization
    const categorySummary = {};
    evaluatedSkills.forEach((s) => {
      if (!categorySummary[s.category]) {
        categorySummary[s.category] = {
          category: s.category,
          totalCurrent: 0,
          totalTarget: 0,
          count: 0
        };
      }
      categorySummary[s.category].totalCurrent += s.currentLevel;
      categorySummary[s.category].totalTarget += s.targetLevel;
      categorySummary[s.category].count += 1;
    });

    const radarCategories = Object.values(categorySummary).map((cat) => ({
      category: cat.category,
      current: Math.round(cat.totalCurrent / cat.count),
      target: Math.round(cat.totalTarget / cat.count),
      gap: Math.max(0, Math.round((cat.totalTarget - cat.totalCurrent) / cat.count))
    }));

    return {
      careerTarget: matchedRoleKey,
      readinessPercentage,
      summary: {
        totalSkills: evaluatedSkills.length,
        highPriorityGaps: highPriorityCount,
        moderateGaps: moderateGapCount,
        masteredSkills: masteredCount
      },
      skills: evaluatedSkills,
      radarData: radarCategories,
      scoringMethod: {
        formula: 'gap = Math.max(0, targetLevel - currentLevel)',
        priorityRules: {
          High: 'gap >= 30% or (criticalSkill == true and gap >= 20%)',
          Medium: '15% <= gap < 30%',
          Low: 'gap < 15%'
        },
        readinessFormula: 'sum(min(currentLevel, targetLevel) * weight) / sum(targetLevel * weight) * 100'
      }
    };
  }
};
