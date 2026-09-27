import { skillGapService } from '../services/skillGapService.js';
import Student from '../models/Student.js';
import Skill from '../models/Skill.js';

// @desc    Analyze student skill gaps against career benchmark
// @route   POST /api/skill-gap/analyze
export const analyzeSkillGap = async (req, res, next) => {
  try {
    const { studentId, careerTarget, currentSkills } = req.body;
    let targetRole = careerTarget || 'Full Stack Developer';
    let skillsList = currentSkills || [];

    // If studentId provided, fetch actual registered skills and career goal
    if (studentId) {
      let student = null;
      if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
        student = await Student.findById(studentId);
      } else {
        student = await Student.findOne({ enrollmentNumber: String(studentId).toUpperCase() });
      }

      if (student) {
        if (!careerTarget && student.careerGoal) {
          targetRole = student.careerGoal;
        }

        if (!currentSkills || currentSkills.length === 0) {
          const dbSkills = await Skill.find({ student: student._id });
          if (dbSkills.length > 0) {
            skillsList = dbSkills.map((s) => ({
              skillName: s.skillName,
              currentLevel: s.currentLevel,
              category: s.category
            }));
          }
        }
      }
    }

    const analysis = skillGapService.analyzeSkillGap({
      currentSkills: skillsList,
      careerTarget: targetRole
    });

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};
