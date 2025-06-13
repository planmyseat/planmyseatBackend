export default function generateSeatingPlan(coursesRollnumbers, classRanges) {
    const totalCapacity = classRanges.reduce((total, clas) => total + clas.capacityLeft, 0)
    const totalStudents = coursesRollnumbers.reduce((total, course) => total + course.students.length, 0);
    let arrangement = []
    let studentsPlaced = 0;
    let studentsByCourse = {};
    let courseList = coursesRollnumbers.map(course => course.name);
    let alreadyPlaced = [
        courseList[0], courseList[1]
    ]
    let courseIndex = [0, 1];
    let classIndex = 0
    let studentIndex = [0, 0]
    let cantPlace = [];

    function createEmptyClasses(classRanges) {
        return classRanges.map(classInfo => ({
            name: classInfo.name,
            capacityLeft: classInfo.capacityLeft,
            students: {},
            seating: Array.from({ length: classInfo.row }, () => Array(classInfo.col).fill(null))
        }));
    }

    coursesRollnumbers.forEach(course => {
        studentsByCourse[course.name] = [...course.students.map(student => student.uid)];
    });

    if (totalStudents > totalCapacity) {
        console.log("students more than expected");
        console.log(totalCapacity, totalStudents);
        
        return
    }

    arrangement = createEmptyClasses(classRanges);

    while (studentsPlaced < totalStudents) {
        if (classIndex < classRanges.length) {
            let row = classRanges[classIndex]["row"];
            let col = classRanges[classIndex]["col"];
            let isEven = false;
            arrangement[classIndex]["students"][courseList[courseIndex[0]]] = 0
            arrangement[classIndex]["students"][courseList[courseIndex[1]]] = 0
            for (let c = 0; c < col; c++) {
                for (let r = 0; r < row; r++) {
                    if (!isEven && courseIndex[0] != -1) {
                        if (r == 0 || studentIndex[0] == 0) {
                            arrangement[classIndex]["seating"][r][c] = `${courseList[courseIndex[0]]} ${studentsByCourse[courseList[courseIndex[0]]][studentIndex[0]]}`
                        } else {
                            arrangement[classIndex]["seating"][r][c] = `${studentsByCourse[courseList[courseIndex[0]]][studentIndex[0]]}`
                        }
                        studentIndex[0]++;
                        studentsPlaced++
                        arrangement[classIndex]["capacityLeft"]--
                        arrangement[classIndex]["students"][courseList[courseIndex[0]]]++
                        if (studentIndex[0] == studentsByCourse[courseList[courseIndex[0]]].length) {
                            courseIndex[0] = alreadyPlaced.length;
                            studentIndex[0] = 0
                            if (courseIndex[0] >= courseList.length) {
                                courseIndex[0] = -1
                            } else {
                                arrangement[classIndex]["students"][courseList[courseIndex[0]]] = 0
                                alreadyPlaced.push(courseList[courseIndex[0]])
                            }
                        }
                    } else if (isEven && courseIndex[1] != -1) {
                        if (r == 0 || studentIndex[1] == 0) {
                            arrangement[classIndex]["seating"][r][c] = `${courseList[courseIndex[1]]} ${studentsByCourse[courseList[courseIndex[1]]][studentIndex[1]]}`

                        } else {
                            arrangement[classIndex]["seating"][r][c] = `${studentsByCourse[courseList[courseIndex[1]]][studentIndex[1]]}`
                        }
                        studentIndex[1]++;
                        studentsPlaced++
                        arrangement[classIndex]["capacityLeft"]--
                        arrangement[classIndex]["students"][courseList[courseIndex[1]]]++
                        if (studentIndex[1] == studentsByCourse[courseList[courseIndex[1]]].length) {
                            courseIndex[1] = alreadyPlaced.length;
                            studentIndex[1] = 0
                            if (courseIndex[1] >= courseList.length) {
                                courseIndex[1] = -1;
                            } else {
                                arrangement[classIndex]["students"][courseList[courseIndex[1]]] = 0
                                alreadyPlaced.push(courseList[courseIndex[1]])
                            }
                        }
                    }
                }
                isEven = !isEven
            }
            classIndex++
        } else {
            if (studentIndex[0] != studentsByCourse[courseList[courseIndex[0]]].length) {
                while (studentIndex[0] != studentsByCourse[courseList[courseIndex[0]]].length) {
                    cantPlace.push(studentsByCourse[courseList[courseIndex[0]]][studentIndex[0]])
                    studentsPlaced++
                }
            } else if (studentIndex[1] != studentsByCourse[courseList[courseIndex[1]]].length) {
                while (studentIndex[1] != studentsByCourse[courseList[courseIndex[1]]].length) {
                    cantPlace.push(studentsByCourse[courseList[courseIndex[1]]][studentIndex[1]])
                    studentsPlaced++
                }
            }
        }
    }
    return { arrangement, cantPlace }
}