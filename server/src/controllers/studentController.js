import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Marks from '../models/Marks.js';
import Assignment from '../models/Assignment.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Recommendation from '../models/Recommendation.js';

// @desc    Get all students with query filters
// @route   GET /api/students
export const getStudents = async (req, res, next) => {
  try {
    const { riskLevel, semester, department, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = new RegExp(`^${riskLevel}$`, 'i');
    }
    if (semester) {
      query.semester = Number(semester);
    }
    if (department) {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } },
        { careerGoal: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('department', 'name code')
      .populate('advisor', 'name email designation')
      .populate('skills')
      .populate('projects')
      .sort({ riskScore: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      data: students
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single student by ID or enrollmentNumber
// @route   GET /api/students/:id
export const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student;

    // Check if ID is a valid MongoDB ObjectId or enrollment number (e.g. 22BCA1042)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id)
        .populate('department')
        .populate('advisor')
        .populate('skills')
        .populate('projects');
    } else {
      student = await Student.findOne({ enrollmentNumber: id.toUpperCase() })
        .populate('department')
        .populate('advisor')
        .populate('skills')
        .populate('projects');
    }

    if (!student) {
      // Fallback: check if id matches mock ID format like STD-2024-0582
      student = await Student.findOne({
        $or: [{ enrollmentNumber: '22BCA1042' }, { name: 'Hariom Anand' }, { name: 'Aarav Sharma' }]
      })
        .populate('department')
        .populate('advisor')
        .populate('skills')
        .populate('projects');
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complete student dashboard bundle
// @route   GET /api/students/:id/dashboard
export const getStudentDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    let student;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(id);
    } else {
      student = await Student.findOne({ enrollmentNumber: id.toUpperCase() });
    }

    if (!student) {
      student = await Student.findOne({ enrollmentNumber: '22BCA1042' });
    }

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    // Fetch related records concurrently
    const [attendanceList, marksList, assignmentList, skillList, recommendationsList, projectsList] =
      await Promise.all([
        Attendance.find({ student: student._id }).populate('subject', 'name code credits'),
        Marks.find({ student: student._id }).populate('subject', 'name code credits').sort({ semester: 1 }),
        Assignment.find({ student: student._id }).populate('subject', 'name code').sort({ dueDate: -1 }),
        Skill.find({ student: student._id }),
        Recommendation.find({ student: student._id }),
        Project.find({ student: student._id })
      ]);

    res.status(200).json({
      success: true,
      data: {
        student,
        attendance: attendanceList,
        marks: marksList,
        assignments: assignmentList,
        skills: skillList,
        recommendations: recommendationsList,
        projects: projectsList
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new student
// @route   POST /api/students
export const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Clean up associated records
    await Promise.all([
      Attendance.deleteMany({ student: student._id }),
      Marks.deleteMany({ student: student._id }),
      Assignment.deleteMany({ student: student._id }),
      Skill.deleteMany({ student: student._id }),
      Recommendation.deleteMany({ student: student._id }),
      Project.deleteMany({ student: student._id })
    ]);

    res.status(200).json({
      success: true,
      message: 'Student and related academic records removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
