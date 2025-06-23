// utils/filterCoursesBySubject.js

import Course from "../models/course.model.js";

export const getFilteredCourseData = async (subjectMap) => {
  const filteredData = [];

  for (const entry of subjectMap) {
    const { courseId, yearId, subject } = entry;

    const courseDoc = await Course.findById(courseId).lean();
    if (!courseDoc) continue;

    const courseName = courseDoc.course;
    const yearData = courseDoc.years.find(
      (year) => String(year._id) === String(yearId)
    );
    if (!yearData) continue;

    const filteredStudents = yearData.students.filter((student) =>
      student.subjects.includes(subject)
    );

    filteredData.push({
      courseId,
      courseName,
      yearId,
      year: yearData.year,
      subject,
      students: filteredStudents,
    });
  }

  return filteredData;
};
