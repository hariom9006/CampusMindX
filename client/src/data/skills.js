/**
 * CampusMind X - Skill Gap Analyzer Dataset
 * Phase 1 Prototype Dataset
 */

export const studentSkillData = {
  careerGoal: "Full Stack Developer",
  targetRoleProfile: "Modern Web, Microservices & Cloud-Native Engineering",
  readinessScore: 64, // 64% overall readiness
  level: "Intermediate Apprentice",

  skills: [
    {
      name: "React.js & Frontend Architecture",
      category: "Frontend",
      currentScore: 78,
      requiredScore: 85,
      gap: -7,
      priority: "Medium",
      status: "Approaching Standard",
      description: "Good understanding of hooks and state; requires practice with SSR and state machines."
    },
    {
      name: "Node.js, Express & REST APIs",
      category: "Backend",
      currentScore: 68,
      requiredScore: 80,
      gap: -12,
      priority: "Medium",
      status: "Moderate Gap",
      description: "Familiar with basic routing; needs middleware design and JWT session management mastery."
    },
    {
      name: "Database Design & SQL / NoSQL",
      category: "Database",
      currentScore: 72,
      requiredScore: 75,
      gap: -3,
      priority: "Low",
      status: "Nearly Ready",
      description: "Strong ER diagramming and indexing; slight gap in aggregation pipelines."
    },
    {
      name: "Data Structures & Algorithms",
      category: "Core Computer Science",
      currentScore: 52,
      requiredScore: 85,
      gap: -33,
      priority: "High",
      status: "Critical Gap",
      description: "Requires urgent focus on Dynamic Programming, Trees, and Graph Traversal for technical rounds."
    },
    {
      name: "System Design & Microservices",
      category: "Architecture",
      currentScore: 42,
      requiredScore: 70,
      gap: -28,
      priority: "High",
      status: "Substantial Gap",
      description: "Lacks knowledge of load balancing, caching (Redis), and event brokers."
    },
    {
      name: "Git, CI/CD & Cloud Basics",
      category: "DevOps",
      currentScore: 65,
      requiredScore: 75,
      gap: -10,
      priority: "Medium",
      status: "Moderate Gap",
      description: "Comfortable with Git branching; needs Docker containerization workflow practice."
    }
  ],

  radarData: [
    { subject: "React & UI", current: 78, required: 85, fullMark: 100 },
    { subject: "Node/Backend", current: 68, required: 80, fullMark: 100 },
    { subject: "Databases", current: 72, required: 75, fullMark: 100 },
    { subject: "DSA & Problem Solving", current: 52, required: 85, fullMark: 100 },
    { subject: "System Design", current: 42, required: 70, fullMark: 100 },
    { subject: "DevOps & Docker", current: 65, required: 75, fullMark: 100 }
  ],

  roadmapMilestones: [
    {
      step: 1,
      title: "DSA Foundation & LeetCode Sprints",
      targetDuration: "Weeks 1 - 4",
      status: "In Progress",
      progress: 40,
      topics: ["Graph Traversal (BFS/DFS)", "Dijkstra Algorithm", "Dynamic Programming Memoization"],
      recommendedAction: "Complete DSA Module 4 & Attend Thursday Academic Recovery Clinic."
    },
    {
      step: 2,
      title: "Backend Security & Middleware Architecture",
      targetDuration: "Weeks 5 - 7",
      status: "Upcoming",
      progress: 15,
      topics: ["OAuth2 / JWT Token Refresh", "Rate Limiting & Helmet", "MongoDB Aggregation Pipeline"],
      recommendedAction: "Build secure REST API microservice in BCA-501 Capstone project."
    },
    {
      step: 3,
      title: "Distributed Systems & Docker Containerization",
      targetDuration: "Weeks 8 - 10",
      status: "Planned",
      progress: 0,
      topics: ["Dockerizing Node/React apps", "Redis Cache Layer", "Microservice load balancing"],
      recommendedAction: "Review University Virtual Lab Series on Cloud Deployment."
    },
    {
      step: 4,
      title: "Full-Stack Industry Portfolio & Mock Technical Interview",
      targetDuration: "Weeks 11 - 12",
      status: "Planned",
      progress: 0,
      topics: ["Production deployment on AWS/Render", "Technical system design mock interview", "Resume optimization"],
      recommendedAction: "Submit portfolio to Campus Placement Cell for verified review."
    }
  ]
};
