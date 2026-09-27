import Assignment from '../models/Assignment.js';
import Student from '../models/Student.js';

// @desc    Get assignments (filter by student, subject, status)
// @route   GET /api/assignments
export const getAssignments = async (req, res, next) => {
  try {
    const { student, subject, status } = req.query;
    const query = {};

    if (student) {
      if (student.match(/^[0-9a-fA-F]{24}$/)) {
        query.student = student;
      } else {
        const studentDoc = await Student.findOne({ enrollmentNumber: student.toUpperCase() });
        if (studentDoc) query.student = studentDoc._id;
      }
    }
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate('student', 'name enrollmentNumber')
      .populate('subject', 'name code')
      .sort({ dueDate: -1 });

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
export const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('student')
      .populate('subject');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
export const createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

// @desc    Update assignment (submit, grade, change status)
// @route   PUT /api/assignments/:id
export const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
export const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, message: 'Assignment removed' });
  } catch (err) {
    next(err);
  }
};
