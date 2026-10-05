import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import universityRoutes from './routes/universityRoutes.js';

// Middlewares
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seed.js';
import Student from './models/Student.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusmind_x';

// Security Hardening: Disable x-powered-by & apply secure HTTP headers
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Configurable CORS support for local development and production deployments
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile, curl, Postman, internal calls)
    if (!origin) return callback(null, true);

    const isExplicit = configuredOrigins.includes(origin) || defaultAllowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith('.vercel.app');
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    const isWildcardConfigured = configuredOrigins.includes('*');

    if (isExplicit || isVercelPreview || isLocalhost || isWildcardConfigured) {
      return callback(null, origin);
    }
    return callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Database Initialization & Auto-Seed
let isDbConnected = false;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    isDbConnected = true;
    console.log(`✓ [CampusMind Express] MongoDB connected successfully at: ${MONGODB_URI}`);

    // Auto-seed if students collection is empty
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('ℹ [CampusMind Express] Database empty. Running initial Phase 2 seed...');
      await seedDatabase();
    } else {
      console.log(`ℹ [CampusMind Express] Database already populated with ${studentCount} students.`);
    }
  } catch (err) {
    console.error('❌ [CampusMind Express] MongoDB connection error:', err.message);
    isDbConnected = false;
  }
}

connectDB();

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    phase: 'Phase 2 - Node.js + Express + MongoDB Architecture',
    system: 'CampusMind X API Gateway',
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected,
      engine: 'MongoDB / Mongoose ODM',
      host: mongoose.connection.host || 'localhost'
    }
  });
});

// Manual Seed Trigger Endpoint (Useful for resetting / verifying test data)
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database successfully re-seeded with demo data' });
  } catch (err) {
    next(err);
  }
});

// Mount All Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/university', universityRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP Listener
const server = app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CampusMind X Backend active on port ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   • Health:          http://localhost:${PORT}/api/health`);
  console.log(`   • Auth:            http://localhost:${PORT}/api/auth`);
  console.log(`   • Students:        http://localhost:${PORT}/api/students`);
  console.log(`   • Faculty:         http://localhost:${PORT}/api/faculty`);
  console.log(`   • Departments:     http://localhost:${PORT}/api/departments`);
  console.log(`   • Subjects:        http://localhost:${PORT}/api/subjects`);
  console.log(`   • Attendance:      http://localhost:${PORT}/api/attendance`);
  console.log(`   • Marks:           http://localhost:${PORT}/api/marks`);
  console.log(`   • Assignments:     http://localhost:${PORT}/api/assignments`);
  console.log(`   • Skills:          http://localhost:${PORT}/api/skills`);
  console.log(`   • Skill Gap:       http://localhost:${PORT}/api/skill-gap`);
  console.log(`   • Recommendations: http://localhost:${PORT}/api/recommendations`);
  console.log(`   • Notifications:   http://localhost:${PORT}/api/notifications`);
  console.log(`   • Analytics:       http://localhost:${PORT}/api/analytics`);
  console.log(`   • AI Engine:       http://localhost:${PORT}/api/ai`);
  console.log(`======================================================\n`);
});

export default app;
