import xlsx from 'xlsx';
import Course from '../models/course.model.js';

export const add = async (req, res) => {
  try {
    const { year } = req.body;
    const { courseId } = req.params;
    const { _id: userId } = req.user;

    if (!req.file) {
      return res.status(400).json({ error: 'Excel file is required.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const students = rawData.map(row => ({
      uid: row.UID?.toString().trim().toUpperCase(),
      name: row.Name?.toString().trim(),
      subjects: row.Subjects?.split(',').map(s => s.trim()),
    }));

    const course = await Course.findOne({ _id: courseId, createdBy: userId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found for this user.' });
    }

    const existingYear = course.years.find(y => y.year === Number(year));
    if (existingYear) {
      return res.status(409).json({ error: `Year ${year} already exists in this course.` });
    }

    course.years.push({
      year: Number(year),
      students,
    });

    await course.save();

    // Remove internal fields before sending response
    const { _id, course: courseName, years } = course.toObject();

    return res.status(201).json({
      _id,
      course: courseName,
      years,
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Failed to add year to course.',
      details: err.message,
    });
  }
};

export const get = async (req, res) => {}