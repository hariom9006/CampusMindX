import Skill from '../models/Skill.js';
import Student from '../models/Student.js';

// @desc    Get skills (filter by student, category)
// @route   GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const { student, category } = req.query;
    const query = {};

    if (student) {
      if (student.match(/^[0-9a-fA-F]{24}$/)) {
        query.student = student;
      } else {
        const studentDoc = await Student.findOne({ enrollmentNumber: student.toUpperCase() });
        if (studentDoc) query.student = studentDoc._id;
      }
    }
    if (category) query.category = category;

    const skills = await Skill.find(query).populate('student', 'name enrollmentNumber careerGoal');
    res.status(200).json({ success: true, count: skills.length, data: skills });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('student');
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// @desc    Create skill
// @route   POST /api/skills
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    if (skill.student) {
      await Student.findByIdAndUpdate(skill.student, { $addToSet: { skills: skill._id } });
    }
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// @desc    Update skill level
// @route   PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    if (skill.student) {
      await Student.findByIdAndUpdate(skill.student, { $pull: { skills: skill._id } });
    }
    res.status(200).json({ success: true, message: 'Skill removed' });
  } catch (err) {
    next(err);
  }
};
