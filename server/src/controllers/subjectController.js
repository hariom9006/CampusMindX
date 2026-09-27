import Subject from '../models/Subject.js';

// @desc    Get all subjects
// @route   GET /api/subjects
export const getSubjects = async (req, res, next) => {
  try {
    const { semester, department } = req.query;
    const query = {};
    if (semester) query.semester = Number(semester);
    if (department) query.department = department;

    const subjects = await Subject.find(query).populate('department').populate('instructor');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
export const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('department').populate('instructor');
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
};

// @desc    Create subject
// @route   POST /api/subjects
export const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    res.status(200).json({ success: true, message: 'Subject removed successfully' });
  } catch (err) {
    next(err);
  }
};
