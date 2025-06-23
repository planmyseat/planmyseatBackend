

export const generateSeatingPlanAlgo = (coursesUidsMap, classes) => {
  const finalPlan = [];
  
  const courseNames = Object.keys(coursesUidsMap); //const courseNames = ["BCA", "MCA", "MSc",...];
    console.log(courseNames);
  const courseQueues = courseNames.map((name) => ({
    name,
    queue: [...coursesUidsMap[name]],
  }));

  let activeCourses = courseQueues.slice(0, 2); // Start with first two

  let nextCourseIndex = 2;

 for (const classObj of classes) {
  const { className, row, columns } = classObj;
  let lastAssignedCourseName = null; 

  for (let col = 1; col <= columns; col++) {
    let currentCourse;
    
    activeCourses = activeCourses.filter(c => c.queue.length > 0);
    // Refill if fewer than 2 active courses
    while (activeCourses.length < 2 && nextCourseIndex < courseQueues.length) {  
      const nextCourse = courseQueues[nextCourseIndex++];
      if (nextCourse.queue.length > 0) {
        activeCourses.push(nextCourse);
      }
    }  
    // Add dummy course if only one left
    if (activeCourses.length === 1) {
      activeCourses.push({ name: "DUMMY", queue: [] });
    }

    // 🔁 Choose course
    if (activeCourses.length === 2) {  // 🆕 Ensure we have two active courses
      const c1 = activeCourses[0];
      const c2 = activeCourses[1];

      // 🛠️ Ensure alternation from previous column (new logic)
      if (c1.name === lastAssignedCourseName) {
        currentCourse = c2;
      } else {
        currentCourse = c1;
      }
    } else if (activeCourses.length === 1) {
      currentCourse = activeCourses[0];
    } else {
      continue;
    }

    lastAssignedCourseName = currentCourse.name;

    // Now seat students row-wise in this column
    for (let rowIndex = 1; rowIndex <= row; rowIndex++) {
      const seat = { row: rowIndex, column: col };
      const uid = currentCourse.queue.shift();

      if (uid !== undefined) {
        finalPlan.push({
          uid,
          course: currentCourse.name,
          className,
          seat,
        });
      }
     
    }
  }
}

  return finalPlan;
};

  //   [
  //   {
  //     name: "BCA",
  //     queue: [1, 2, 3, 4]
  //   },
  //   {
  //     name: "MCA",
  //     queue: [101, 102, 103]
  //   },
  //   {
  //     name: "MSc",
  //     queue: [201, 202]
  //   }
  // ]




//   activeCourses = [
  //   { name: "MCA", queue: [101] },
  //   { name: "MSc", queue: [201, 202] }
  // ];