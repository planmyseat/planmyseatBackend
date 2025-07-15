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

        if (students.length <= 0) {
            return res.status(400).json({ error: "Wrong Formated Excell File" })
        }

        const course = await Course.findOne({ _id: courseId, createdBy: userId }).select('_id course years');

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

        const plainCourse = course.toObject();
        delete plainCourse.__v;
        delete plainCourse.createdAt;
        delete plainCourse.updatedAt;

        return res.status(201).json(plainCourse);

    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

export const update = async (req, res) => {
    try {
        const { courseId, yearId } = req.params;
        const { year } = req.body;
        const { _id: userId } = req.user;

        const course = await Course.findOne({
            _id: courseId,
            createdBy: userId,
        }).select('_id course years');

        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        if (
            course.years.some(
                y => y._id.toString() !== yearId && y.year === Number(year)
            )
        ) {
            return res.status(409).json({ error: 'Duplicate year not allowed in this course' });
        }

        const yearToUpdate = course.years.id(yearId);
        if (!yearToUpdate) {
            return res.status(404).json({ error: 'Year not found' });
        }

        yearToUpdate.year = Number(year);

        await course.save();

        const plainCourse = course.toObject();
        delete plainCourse.__v;
        delete plainCourse.createdAt;
        delete plainCourse.updatedAt;

        return res.status(201).json(plainCourse);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {

    try {
        const { courseId, yearId } = req.params;
        const { _id: userId } = req.user;

        console.log("courseid",courseId);
        console.log("yearid",yearId);
        console.log("user",userId);
        

        const course = await Course.findOne({ _id: courseId, createdBy: userId }).select('_id course years');
        if (!course) {
            return res.status(404).json({ error: 'Course not found or unauthorized' });
        }

        course.years.pull({ _id: yearId });

        await course.save();

        await seatingPlan.deleteMany({
            courses: {
                $elemMatch: {
                    courseId: courseId,
                    yearId: yearId
                }
            }
        })

        const plainCourse = course.toObject();
        delete plainCourse.__v;
        delete plainCourse.createdAt;
        delete plainCourse.updatedAt;

        return res.status(201).json(plainCourse);
    } catch (err) {
         console.log(err.message);
        return res.status(500).json({
            error: err.message,
           
            
        });
    }
};