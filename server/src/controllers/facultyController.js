import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';

// @desc    Get all faculty
// @route   GET /api/faculty
export const getFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.find().populate('department', 'name code');
    res.status(200).json({ success: true, count: faculty.length, data: faculty });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single faculty & their advised cohort
// @route   GET /api/faculty/:id
export const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('department');
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    const cohort = await Student.find({ advisor: faculty._id }).sort({ riskScore: -1 });
    res.status(200).json({ success: true, data: { faculty, cohort } });
  } catch (err) {
    next(err);
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
export const createFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
export const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, data: faculty });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
export const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }
    res.status(200).json({ success: true, message: 'Faculty removed successfully' });
  } catch (err) {
    next(err);
  }
};
