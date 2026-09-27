import Marks from '../models/Marks.js';
import Student from '../models/Student.js';

// @desc    Get marks (filter by student, subject, semester)
// @route   GET /api/marks
export const getMarks = async (req, res, next) => {
  try {
    const { student, subject, semester } = req.query;
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
    if (semester) query.semester = Number(semester);

    const marks = await Marks.find(query)
      .populate('student', 'name enrollmentNumber semester')
      .populate('subject', 'name code credits')
      .sort({ semester: 1 });

    res.status(200).json({ success: true, count: marks.length, data: marks });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single marks record
// @route   GET /api/marks/:id
export const getMarksById = async (req, res, next) => {
  try {
    const mark = await Marks.findById(req.params.id)
      .populate('student')
      .populate('subject');

    if (!mark) {
      return res.status(404).json({ success: false, message: 'Marks record not found' });
    }
    res.status(200).json({ success: true, data: mark });
  } catch (err) {
    next(err);
  }
};

// @desc    Create marks record
// @route   POST /api/marks
export const createMarks = async (req, res, next) => {
  try {
    const mark = await Marks.create(req.body);
    res.status(201).json({ success: true, data: mark });
  } catch (err) {
    next(err);
  }
};

// @desc    Update marks record
// @route   PUT /api/marks/:id
export const updateMarks = async (req, res, next) => {
  try {
    const mark = await Marks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!mark) {
      return res.status(404).json({ success: false, message: 'Marks record not found' });
    }
    res.status(200).json({ success: true, data: mark });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete marks record
// @route   DELETE /api/marks/:id
export const deleteMarks = async (req, res, next) => {
  try {
    const mark = await Marks.findByIdAndDelete(req.params.id);
    if (!mark) {
      return res.status(404).json({ success: false, message: 'Marks record not found' });
    }
    res.status(200).json({ success: true, message: 'Marks record deleted' });
  } catch (err) {
    next(err);
  }
};
