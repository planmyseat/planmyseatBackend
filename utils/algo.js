
export const generateSeatingPlanAlgo = (coursesUidsMap, classes) => {
  const finalPlan = [];
  const courseNames = Object.keys(coursesUidsMap);
  const courseQueues = courseNames.map((name) => ({
    name,
    queue: [...coursesUidsMap[name]],
  }));

  let activeCourses = courseQueues.slice(0, 2);
  let nextCourseIndex = 2;

  for (const classObj of classes) {
    const { className, row, columns } = classObj;
    let lastAssignedCourseName = null;
    let skipColumnForSingleCourse = false; // Track alternation for single course

    for (let col = 1; col <= columns; col++) {
      activeCourses = activeCourses.filter((c) => c.queue.length > 0);

      while (activeCourses.length < 2 && nextCourseIndex < courseQueues.length) {
        const nextCourse = courseQueues[nextCourseIndex++];
        if (nextCourse.queue.length > 0) {
          activeCourses.push(nextCourse);
        }
      }

      if (activeCourses.length === 1) {
        //  Skip krdo this column if alternation needed
        if (skipColumnForSingleCourse) {
          skipColumnForSingleCourse = false;
          continue; // leave this column empty
        } else {
          skipColumnForSingleCourse = true;
        }
      }

      if (activeCourses.length === 1) {
        activeCourses.push({ name: "DUMMY", queue: [] });
      }

      let currentCourse;
      if (activeCourses.length === 2) {
        const [c1, c2] = activeCourses;
        currentCourse = (c1.name === lastAssignedCourseName) ? c2 : c1;
      } else {
        continue;
      }

      lastAssignedCourseName = currentCourse.name;

      for (let rowIndex = 1; rowIndex <= row; rowIndex++) {
        const seat = { row: rowIndex, column: col };
        let assigned = false;

        while (!assigned) {
          const uid = currentCourse.queue.shift();

          if (uid !== undefined) {
            finalPlan.push({
              uid,
              course: currentCourse.name,
              className,
              seat,
            });
            assigned = true;
          } else {

            activeCourses = activeCourses.filter(c => c.queue.length > 0);

            while (activeCourses.length < 2 && nextCourseIndex < courseQueues.length) {
              const nextCourse = courseQueues[nextCourseIndex++];
              if (nextCourse.queue.length > 0) {
                activeCourses.push(nextCourse);
              }
            }

            if (activeCourses.length > 0) {
              currentCourse = activeCourses.find(c => c.name !== currentCourse.name) || activeCourses[0];
              lastAssignedCourseName = currentCourse.name;
            } else {
              assigned = true;
            }
          }
        }
      }
    }
  }

  return finalPlan;
};
  