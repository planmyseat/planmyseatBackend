import Course from '../models/course.model.js';

export const add = async (req, res) => {
  try {
    const { name } = req.body;
    const { _id: userId } = req.user;

    const course = new Course({
      course: name,
      createdBy: userId,
      years: [],
    });

    await course.save();

    return res.status(201).json({
      _id: course._id,
      course: course.course,
      years: course.years,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Course with this name already exists for this user',
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const get = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const courses = await Course.find({ createdBy: userId })
      .select('_id course years ') 

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const { _id: userId } = req.user;
    const { name } = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { course: name },
      { new: true, runValidators: true }
    ).select('_id course years');

    if (!course) {
      return res.status(404).json({ error: 'Course not found or unauthorized' });
    }

    return res.status(200).json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Another course with this name already exists',
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId } = req.user;

    const course = await Course.findOneAndDelete({ _id: id, createdBy: userId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found or not authorized to delete' });
    }

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
