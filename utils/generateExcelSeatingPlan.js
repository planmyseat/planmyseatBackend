import ExcelJS from 'exceljs';

async function generateExcelSeatingPlan(plan, blockName) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Plan My Seat';
    workbook.lastModifiedBy = 'Plan My Seat';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.properties.date1904 = true;

    const worksheet = workbook.addWorksheet('Seating Plan'); // ✅ Single worksheet for all classes

    // --- Setup: group students by class ---
    const groupedStudentsByClass = plan.students.reduce((acc, student) => {
        if (!acc[student.className]) {
            acc[student.className] = [];
        }
        acc[student.className].push(student);
        return acc;
    }, {});

    const classNames = Object.keys(groupedStudentsByClass).sort();

    if (classNames.length === 0) {
        worksheet.addRow(['No classes found in this seating plan.']);
        return workbook.xlsx.writeBuffer();
    }

    // --- Metadata ---
    const collegeName = "BABA FARID COLLEGE, BATHINDA";
    const examDetails = plan.title || "Unknown Title";
    const planDate = plan.date
        ? new Date(plan.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
        }).replace(/\s/g, '-')
        : 'N/A';
    const planSession = plan.session === "morning" ? "Morning" : "Evening";
    const planBlock = blockName || 'N/A';
    const planTimings = plan.session === "morning"
        ? "10:00am - 12pm"
        : "01:00pm - 3:00pm";

    let currentRow = 1;

    for (const className of classNames) {
        const studentsInClass = groupedStudentsByClass[className];

        let maxSeatingRow = 0;
        let maxSeatingColumn = 0;

        studentsInClass.forEach(student => {
            const row = Number(student.seat.row);
            const col = Number(student.seat.column);
            if (row > maxSeatingRow) maxSeatingRow = row;
            if (col > maxSeatingColumn) maxSeatingColumn = col;
        });

        const mergeEndColumn = Math.max(maxSeatingColumn, 4);
        const grid = Array(maxSeatingRow + 1).fill(null).map(() =>
            Array(maxSeatingColumn + 1).fill('')
        );

        studentsInClass.forEach(student => {
            const row = Number(student.seat.row);
            const col = Number(student.seat.column);
            if (row >= 1 && col >= 1) {
                grid[row][col] = student.uid;
            }
        });

        const blankRowIndex = currentRow++;
        worksheet.addRow([]);
        worksheet.mergeCells(blankRowIndex, 1, blankRowIndex + 3, mergeEndColumn);

        currentRow += 3;
        // Define dynamic row positions
        const COLLEGE_NAME_ROW = currentRow++;
        const EXAM_DETAILS_ROW = currentRow++;
        const SESSION_DATE_ROW = currentRow++;
        const BLOCK_TIMINGS_ROW = currentRow++;
        const CLASS_NAME_HEADER_ROW = currentRow++;
        const ROW_HEADERS_ROW = currentRow++;
        const COURSE_HEADERS_ROW = currentRow++;
        const STUDENT_DATA_START_ROW = currentRow;


        // --- Merge & Set Headers ---
        worksheet.mergeCells(COLLEGE_NAME_ROW, 1, COLLEGE_NAME_ROW, mergeEndColumn);
        worksheet.getCell(COLLEGE_NAME_ROW, 1).value = collegeName;
        worksheet.getCell(COLLEGE_NAME_ROW, 1).font = { bold: true, size: 20 };
        worksheet.getCell(COLLEGE_NAME_ROW, 1).alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.mergeCells(EXAM_DETAILS_ROW, 1, EXAM_DETAILS_ROW, mergeEndColumn);
        worksheet.getCell(EXAM_DETAILS_ROW, 1).value = examDetails;
        worksheet.getCell(EXAM_DETAILS_ROW, 1).font = { bold: true, size: 14 };
        worksheet.getCell(EXAM_DETAILS_ROW, 1).alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getCell(SESSION_DATE_ROW, 1).value = 'Session:';
        worksheet.getCell(SESSION_DATE_ROW, 2).value = planSession;
        worksheet.getCell(SESSION_DATE_ROW, 3).value = 'Date:';
        worksheet.getCell(SESSION_DATE_ROW, 4).value = planDate;

        worksheet.getCell(BLOCK_TIMINGS_ROW, 1).value = 'Block:';
        worksheet.getCell(BLOCK_TIMINGS_ROW, 2).value = planBlock;
        worksheet.getCell(BLOCK_TIMINGS_ROW, 3).value = 'Timings:';
        worksheet.getCell(BLOCK_TIMINGS_ROW, 4).value = planTimings;

        [SESSION_DATE_ROW, BLOCK_TIMINGS_ROW].forEach(r => {
            worksheet.getRow(r).font = { bold: true, size: 11 };
            worksheet.getRow(r).height = 20;
        });

        worksheet.mergeCells(CLASS_NAME_HEADER_ROW, 1, CLASS_NAME_HEADER_ROW, mergeEndColumn);
        const classNameCell = worksheet.getCell(CLASS_NAME_HEADER_ROW, 1);
        classNameCell.value = className;
        classNameCell.font = { bold: true, size: 16 };
        classNameCell.alignment = { horizontal: 'center', vertical: 'middle' };
        classNameCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEEEEEE' }
        };
        worksheet.getRow(CLASS_NAME_HEADER_ROW).height = 25;

        // --- Row Headers & Courses ---
        let col = 1;
        let rowLabelIndex = 1;

        while (col <= maxSeatingColumn) {
            const endCol = col;
            worksheet.mergeCells(ROW_HEADERS_ROW, col, ROW_HEADERS_ROW, endCol);
            const rowHeader = worksheet.getCell(ROW_HEADERS_ROW, col);
            rowHeader.value = `ROW${rowLabelIndex++}`;
            rowHeader.font = { bold: true };
            rowHeader.alignment = { horizontal: 'center', vertical: 'middle' };
            rowHeader.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDDDDDD' }
            };

            for (let c = col; c <= endCol; c++) {
                const student = studentsInClass.find(s => Number(s.seat.column) === c);
                const course = student?.course || '';
                const courseCell = worksheet.getCell(COURSE_HEADERS_ROW, c);
                courseCell.value = course;
                courseCell.font = { bold: true, size: 10 };
                courseCell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true
                };
                courseCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD3D3D3' }
                };
            }

            col = endCol + 1;
        }

        worksheet.getRow(ROW_HEADERS_ROW).height = 20;
        worksheet.getRow(COURSE_HEADERS_ROW).height = 40;

        // --- Add student UID rows ---
        for (let r = 1; r <= maxSeatingRow; r++) {
            const row = worksheet.getRow(currentRow++);
            for (let c = 1; c <= maxSeatingColumn; c++) {
                const uid = grid[r][c];
                const cell = row.getCell(c);
                cell.value = uid;
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.font = { size: 10 };
            }
        }

        // --- Style: Widths & Borders ---
        for (let c = 1; c <= mergeEndColumn; c++) {
            worksheet.getColumn(c).width = 15;
        }

        for (let r = COLLEGE_NAME_ROW; r < currentRow; r++) {
            for (let c = 1; c <= mergeEndColumn; c++) {
                worksheet.getCell(r, c).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            }
        }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

export default generateExcelSeatingPlan;
