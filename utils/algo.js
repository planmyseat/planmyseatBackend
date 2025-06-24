export const generateSeatingPlanAlgo = (courseData, block, totalCapacity, totalStudents) => {
    const arrangement = []

    let studentsPlaced = 0

    let activeCourses = courseData.splice(0, 2)

    while (studentsPlaced < totalCapacity && studentsPlaced < totalStudents) {
        block.classes.forEach(cls => {
            let odd = true
            for (let c = 1; c <= cls.columns; c++) {
                for (let r = 1; r <= cls.row; r++) {
                    if (odd) {
                        if (activeCourses[0].students.length < 1) {
                            if (courseData.length) {
                                activeCourses[0] = courseData.shift()                                
                            } else {
                                continue;
                            }
                        }
                        const data = activeCourses[0].students.shift()
                        arrangement.push({
                            uid: data.uid,
                            name: data.name,
                            course: activeCourses[0].name,
                            className: cls.className,
                            seat: { row: r, column: c },
                            atendance: false
                        })
                        studentsPlaced++
                    } else {
                        if (activeCourses[1].students.length < 1) {
                            if (courseData.length) {
                                activeCourses[1] = courseData.shift()
                            } else {
                                continue;
                            }
                        }
                        const data = activeCourses[1].students.shift()
                        arrangement.push({
                            uid: data.uid,
                            name: data.name,
                            course: activeCourses[1].name,
                            className: cls.className,
                            seat: { row: r, column: c },
                            atendance: false
                        })
                        studentsPlaced++
                    }
                }
                odd = !odd
            }
        });
    }
    return arrangement
}