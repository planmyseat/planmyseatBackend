import Course from "../models/course.model.js";

export const add = async (req, res) => {
  try {
    const { courseId, yearId } = req.params;
    const { uid, name, subjects } = req.body;
    const userId = req.user._id;

    const course = await Course.findOne({ _id: courseId, createdBy: userId }).select('_id course years');

    if (!course) {
      return res.status(404).json({ error: 'Course not found or access denied.' });
    }

    const year = course.years.id(yearId);

    if (!year) {
      return res.status(404).json({ error: 'Year not found in the course.' });
    }

    const uidExists = year.students.some(student => student.uid === uid);

    if (uidExists) {
      return res.status(400).json({ error: 'Student with this UID already exists in the year.' });
    }

    year.students.push({ uid, name, subjects });

    await course.save();

    const plainCourse = course.toObject();
    delete plainCourse.__v;
    delete plainCourse.createdAt;
    delete plainCourse.updatedAt;

    return res.status(201).json(plainCourse);
  } catch (error) {
    console.error('Error adding student:', error);
    return res.status(500).json({ error: 'Server error while adding student.' });
  }
};

export const update = async (req, res) => {
  try {
    const { courseId, yearId, studentId } = req.params;
    const { uid, name, subjects } = req.body;
    const userId = req.user._id;

    const course = await Course.findOne({ _id: courseId, createdBy: userId }).select('_id course years');

    if (!course) {
      return res.status(404).json({ error: 'Course not found or access denied.' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ error: 'Year not found in the course.' });
    }

    const student = year.students.id(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found in the year.' });
    }

    const duplicateUID = year.students.some(
      s => s.uid === uid && s._id.toString() !== studentId
    );

    if (duplicateUID) {
      return res.status(400).json({ error: 'Another student with this UID already exists in the year.' });
    }

    student.uid = uid;
    student.name = name;
    student.subjects = subjects;

    await course.save();

    const plainCourse = course.toObject();
    delete plainCourse.__v;
    delete plainCourse.createdAt;
    delete plainCourse.updatedAt;

    return res.status(201).json(plainCourse);
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ error: 'Server error while updating student.' });
  }
};

export const remove = async (req, res) => {
  try {
    const { courseId, yearId, studentId } = req.params;
    const userId = req.user._id;

    const course = await Course.findOne({ _id: courseId, createdBy: userId }).select('_id course years');

    if (!course) {
      return res.status(404).json({ error: 'Course not found or access denied.' });
    }

    const year = course.years.id(yearId);
    if (!year) {
      return res.status(404).json({ error: 'Year not found in the course.' });
    }

    const student = year.students.id(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found in the year.' });
    }

    student.deleteOne();

    await course.save();

    const plainCourse = course.toObject();
    delete plainCourse.__v;
    delete plainCourse.createdAt;
    delete plainCourse.updatedAt;

    return res.status(201).json(plainCourse);
  } catch (error) {
    console.error('Error removing student:', error);
    return res.status(500).json({ error: 'Server error while removing student.' });
  }
};