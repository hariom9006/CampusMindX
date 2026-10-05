import crypto from 'crypto';
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

// @desc    Register a real user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Required fields validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a password.' });
    }

    // 2. Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    const cleanEmail = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email format.' });
    }

    // 3. Password strength check
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // 4. Role authorization: For security, normal users cannot register as Admin
    let userRole = (role || 'student').toLowerCase();
    if (userRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator accounts cannot be created via public registration. Contact your institution administrator.'
      });
    }
    if (!['student', 'faculty'].includes(userRole)) {
      userRole = 'student';
    }

    // 5. Duplicate email detection
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    // 6. Connect to existing student or faculty record if available, or create initial reference
    let studentRef = null;
    let facultyRef = null;

    if (userRole === 'student') {
      // Check if student profile exists with this email or link to default demo student
      const matchedStudent = await Student.findOne({ email: cleanEmail });
      if (matchedStudent) {
        studentRef = matchedStudent._id;
      }
    } else if (userRole === 'faculty') {
      const matchedFaculty = await Faculty.findOne({ email: cleanEmail });
      if (matchedFaculty) {
        facultyRef = matchedFaculty._id;
      }
    }

    // 7. Create user with hashed password (hashed by UserSchema pre-save)
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: userRole,
      student: studentRef,
      faculty: facultyRef
    });

    const token = signToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user with real credentials
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Do not reveal whether email exists for security
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Compare bcrypt password hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
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
        createdAt: user.createdAt,
        student: user.student,
        faculty: user.faculty
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current authenticated user session
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('student')
      .populate('faculty');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        student: user.student,
        faculty: user.faculty
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, email } = req.body;

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      if (cleanEmail !== user.email) {
        const existing = await User.findOne({ email: cleanEmail });
        if (existing) {
          return res.status(409).json({ success: false, message: 'Email address is already in use by another account.' });
        }
        user.email = cleanEmail;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your account email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    // Always return success response for security (do not expose email existence)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email address, password reset instructions have been dispatched.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(24).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour validity
    await user.save({ validateBeforeSave: false });

    // For development, provide simulator hint in non-production
    const devResetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been dispatched.',
      devResetLink: process.env.NODE_ENV !== 'production' ? devResetLink : undefined
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password using valid token
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, email } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You may now sign in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Demo Quick Login
// @route   POST /api/auth/demo-login
export const demoLogin = async (req, res, next) => {
  try {
    const { role = 'student' } = req.body;
    let user = await User.findOne({ role });

    if (!user) {
      const emailMap = {
        student: 'hariom.anand@campus.edu.in',
        faculty: 's.kulkarni@campus.edu.in',
        admin: 'admin@campus.edu.in'
      };
      const nameMap = {
        student: 'Hariom Anand',
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
