import Department from '../models/Department.js';
import Student from '../models/Student.js';

// @desc    Get all departments
// @route   GET /api/departments
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single department with stats
// @route   GET /api/departments/:id
export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    const studentCount = await Student.countDocuments({ department: department._id });
    res.status(200).json({ success: true, data: { department, studentCount } });
  } catch (err) {
    next(err);
  }
};

// @desc    Create department
// @route   POST /api/departments
export const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department removed successfully' });
  } catch (err) {
    next(err);
  }
};
