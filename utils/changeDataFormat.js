const courselist = [];

const convertFilteredDataToAlgoFormat = (filteredCourses) => {
  if (!Array.isArray(filteredCourses)) return [];

  const data = filteredCourses.map((course) => {

    // Build course label like "BCA-1st year" 
    const yearSuffix = getYearSuffix(course.year);
    const courseLabel = `${course.courseName}-${yearSuffix} year`;

    // Only return uid and name (strip subjects)
    const students = course.students.map(({ uid, name }) => ({ uid, name }));
    courselist.push(courseLabel)
    return {
      course: courseLabel,
      students: students,
    };
  });

  return data;
};

// Helper to convert year number to 1st/2nd/3rd/etc.
const getYearSuffix = (year) => {
  if (year === 1) return "1st";
  if (year === 2) return "2nd";
  if (year === 3) return "3rd";
  return `${year}th`;
};


const fetchStudentsUids = (course, studentsData) => {
   
  let result = {};
  if (!Array.isArray(course)) {
    throw new Error("Course must be an array of course names");
  }
  if (course.length === 0) {
    throw new Error("Course array cannot be empty");
  }

  course.forEach((c) => {
    const courseData = studentsData.find((data) => data.course === c);
    if (!courseData) {
      throw new Error(`Course ${c} not found`);
    }
    result[c] = courseData.students.map((student) => student.uid);
  });

  return result; // returns an object with course names as keys and arrays of uids as values
  // Example: { BCA: [1, 2, 3], MCA: [101, 102, ...], MSc: [201, 202, ...] }
};



export const ChangeDataForomat = (filteredData) => {

  const data = convertFilteredDataToAlgoFormat(filteredData);
   const uidsbyCourse = fetchStudentsUids(courselist, data);   
   // this is the actual data format which is required in algorithm....
   
  return uidsbyCourse;
};
