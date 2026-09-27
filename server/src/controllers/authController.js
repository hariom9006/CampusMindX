import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecret_campusmind_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, role: role || 'student' });
    const token = signToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student: user.student,
        faculty: user.faculty
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('student').populate('faculty');
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Demo Quick Login (for Phase 1 & 2 seamless persona evaluation)
// @route   POST /api/auth/demo-login
export const demoLogin = async (req, res, next) => {
  try {
    const { role = 'student' } = req.body;
    let user = await User.findOne({ role });

    if (!user) {
      const emailMap = {
        student: 'aarav.sharma@campus.edu.in',
        faculty: 's.kulkarni@campus.edu.in',
        admin: 'admin@campus.edu.in'
      };
      const nameMap = {
        student: 'Aarav Sharma',
        faculty: 'Dr. Sunita Kulkarni',
        admin: 'Dean of Academic Affairs'
      };
      user = await User.create({
        name: nameMap[role] || 'Demo User',
        email: emailMap[role] || `${role}@campus.edu.in`,
        password: 'Password123!',
        role
      });
    }

    const token = signToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};
