import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Get attendance records (filter by student, subject)
// @route   GET /api/attendance
export const getAttendance = async (req, res, next) => {
  try {
    const { student, subject } = req.query;
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

    const records = await Attendance.find(query)
      .populate('student', 'name enrollmentNumber semester')
      .populate('subject', 'name code credits');

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
export const getAttendanceById = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id)
      .populate('student')
      .populate('subject');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

// @desc    Create attendance record
// @route   POST /api/attendance
export const createAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.create(req.body);

    // Update aggregate attendance on student
    if (record.student) {
      const allStudentRecords = await Attendance.find({ student: record.student });
      if (allStudentRecords.length > 0) {
        const totalHeld = allStudentRecords.reduce((acc, curr) => acc + curr.totalClasses, 0);
        const totalAtt = allStudentRecords.reduce((acc, curr) => acc + curr.attendedClasses, 0);
        const agg = totalHeld > 0 ? Math.round((totalAtt / totalHeld) * 100) : 0;
        await Student.findByIdAndUpdate(record.student, { attendance: agg });
      }
    }

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
export const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    // Recompute aggregate attendance for student
    if (record.student) {
      const allStudentRecords = await Attendance.find({ student: record.student });
      const totalHeld = allStudentRecords.reduce((acc, curr) => acc + curr.totalClasses, 0);
      const totalAtt = allStudentRecords.reduce((acc, curr) => acc + curr.attendedClasses, 0);
      const agg = totalHeld > 0 ? Math.round((totalAtt / totalHeld) * 100) : 0;
      await Student.findByIdAndUpdate(record.student, { attendance: agg });
    }

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
export const deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    res.status(200).json({ success: true, message: 'Attendance record deleted' });
  } catch (err) {
    next(err);
  }
};
