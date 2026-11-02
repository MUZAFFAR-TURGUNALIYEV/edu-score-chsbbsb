document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // MA'LUMOTLAR
    // =====================================

    const teacherName =
        localStorage.getItem("teacherName");

    const selectedClass =
        localStorage.getItem("selectedClass");

    const subject =
        localStorage.getItem("selectedSubject");

    const taskCount =
        Number(localStorage.getItem("taskCount")) || 0;

    const classStudents =
        JSON.parse(
            localStorage.getItem("classStudents") || "[]"
        );


    // =====================================
    // SAHIFA MA'LUMOTLARI
    // =====================================

    const teacherNameEl =
        document.getElementById("teacherName");

    if (teacherNameEl) {
        teacherNameEl.textContent =
            teacherName || "";
    }


    const classNameEl =
        document.getElementById("className");

    if (classNameEl) {
        classNameEl.textContent =
            selectedClass || "—";
    }


    const subjectNameEl =
        document.getElementById("subjectName");

    if (subjectNameEl) {
        subjectNameEl.textContent =
            subject || "—";
    }


    const studentCountEl =
        document.getElementById("studentCount");

    if (studentCountEl) {
        studentCountEl.textContent =
            classStudents.length;
    }


    // =====================================
    // TOPSHIRIQ HEADERLARI
    // =====================================

    const tableHeader =
        document.getElementById("tableHeader");


    if (tableHeader) {

        for (
            let i = 1;
            i <= taskCount;
            i++
        ) {

            const th =
                document.createElement("th");

            th.textContent =
                `${i}-topşiriq`;

            tableHeader.appendChild(th);

        }

    }


    // =====================================
    // O'QUVCHILAR
    // =====================================

    const studentTable =
        document.getElementById("studentTable");


    if (studentTable) {

        classStudents.forEach(
            function (student, index) {

                const tr =
                    document.createElement("tr");


                // №
                const numberTd =
                    document.createElement("td");

                numberTd.textContent =
                    index + 1;

                tr.appendChild(numberTd);


                // F.I.O
                const nameTd =
                    document.createElement("td");

                nameTd.className =
                    "student-name";

                nameTd.textContent =
                    student;

                tr.appendChild(nameTd);


                // BALL INPUTLARI
                for (
                    let task = 1;
                    task <= taskCount;
                    task++
                ) {

                    const scoreTd =
                        document.createElement("td");


                    const input =
                        document.createElement("input");


                    input.type =
                        "number";


                    input.className =
                        "score-input";


                    input.min =
                        "0";


                    input.max =
                        "30";


                    input.placeholder =
                        "—";


                    input.dataset.student =
                        index;


                    input.dataset.task =
                        task;


                    scoreTd.appendChild(input);

                    tr.appendChild(scoreTd);

                }


                studentTable.appendChild(tr);

            }
        );

    }


    // =====================================
    // BAHOLARNI SAQLASH
    // =====================================

    const saveButton =
        document.getElementById("saveButton");


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const scores = [];


                classStudents.forEach(
                    function (
                        student,
                        studentIndex
                    ) {

                        const studentScores = [];


                        for (
                            let task = 1;
                            task <= taskCount;
                            task++
                        ) {

                            const input =
                                document.querySelector(
                                    `[data-student="${studentIndex}"][data-task="${task}"]`
                                );


                            studentScores.push(

                                input &&
                                input.value !== ""

                                    ? Number(input.value)

                                    : null

                            );

                        }


                        scores.push({

                            student:
                                student,

                            scores:
                                studentScores

                        });

                    }
                );


                localStorage.setItem(
                    "assessmentScores",
                    JSON.stringify(scores)
                );


                alert(
                    "Baholar saqlandi."
                );

            }
        );

    }


    // =====================================
    // EXCEL YUKLAB OLISH
    // =====================================

    const downloadButton = document.getElementById("downloadExcelButton");

    if (downloadButton) {
        downloadButton.addEventListener("click", async function () {
            if (typeof ExcelJS === "undefined") {
                alert("ExcelJS yuklanmadi. Internetni tekshiring.");
                return;
            }

            try {
                const workbook = new ExcelJS.Workbook();
                workbook.creator = "EduScore";
                workbook.calcProperties.fullCalcOnLoad = true;
                workbook.calcProperties.forceFullCalc = true;
                workbook.calcProperties.calcMode = "auto";

                const worksheet = workbook.addWorksheet(selectedClass || "Baholash");
                const nTasks = Math.max(1, taskCount);
                const lastTaskCol = nTasks + 2;
                const totalCol = lastTaskCol + 1;
                const percentCol = lastTaskCol + 2;
                const lastCol = percentCol;
                const lastColLetter = getExcelColumnName(lastCol);
                const taskStartRow = 6;
                const studentStartRow = 7;
                const studentEndRow = studentStartRow + classStudents.length - 1;
                const averageRow = studentEndRow + 1;
                const averagePercentRow = studentEndRow + 2;
                const font = "Times New Roman";
                const thin = { style: "thin", color: { argb: "FF000000" } };
                const border = { top: thin, left: thin, bottom: thin, right: thin };

                worksheet.getColumn(1).width = 5;
                worksheet.getColumn(2).width = 38;
                for (let col = 3; col <= lastTaskCol; col++) worksheet.getColumn(col).width = 12;
                worksheet.getColumn(totalCol).width = 12;
                worksheet.getColumn(percentCol).width = 12;

                function put(row, col, value, opts = {}) {
                    const cell = worksheet.getCell(row, col);
                    cell.value = value;
                    cell.font = { name: font, size: opts.size || 11, bold: !!opts.bold, underline: !!opts.underline };
                    cell.alignment = { horizontal: opts.align || "center", vertical: "middle", wrapText: true };
                    if (opts.border !== false) cell.border = border;
                    if (opts.numFmt) cell.numFmt = opts.numFmt;
                    return cell;
                }

                // Sarlavha, sinf va fan
                worksheet.mergeCells(1, 1, 1, lastCol);
                put(1, 1, `Yangiyer şahar 9-maktab  0 - Çorak 0 - BSB böyiça tahlil  (0000-0000 öquv yili)`, { bold: true, size: 12 });
                put(2, 2, "Sinf", { bold: true, align: "right", border: false });
                put(2, 3, selectedClass || "");
                put(3, 2, "Fan", { bold: true, underline: true });
                worksheet.mergeCells(3, 3, 3, Math.min(5, lastCol));
                put(3, 3, subject || "", { bold: true });

                // Ustun sarlavhalari
                for (let col = 1; col <= lastCol; col++) worksheet.mergeCells(4, col, 5, col);
                put(4, 1, "№", { bold: true });
                put(4, 2, "F.I.O", { bold: true });
                for (let task = 1; task <= nTasks; task++) put(4, task + 2, `${task}-topşiriq`, { bold: true });
                put(4, totalCol, "Jami ball", { bold: true });
                put(4, percentCol, "Foizi %", { bold: true });

                // Maksimal ball qatori
                const maxScores = [];
                for (let task = 1; task <= nTasks; task++) {
                    const scoreInputs = Array.from(document.querySelectorAll(`input[data-task="${task}"]`));
                    const entered = scoreInputs.map(input => Number(input.max)).find(v => Number.isFinite(v) && v > 0);
                    maxScores.push(entered || 5);
                    put(taskStartRow, task + 2, maxScores[task - 1], { bold: true });
                }
                const maxTotal = maxScores.reduce((sum, value) => sum + value, 0);
                put(taskStartRow, totalCol, { formula: `SUM(C${taskStartRow}:${getExcelColumnName(lastTaskCol)}${taskStartRow})`, result: maxTotal }, { bold: true });

                const taskSums = Array(nTasks).fill(0);
                let allTotal = 0;
                const storedScores = JSON.parse(localStorage.getItem("assessmentScores") || "[]");
                classStudents.forEach((student, index) => {
                    const row = studentStartRow + index;
                    put(row, 1, index + 1);
                    put(row, 2, student, { align: "left" });
                    let total = 0;
                    for (let task = 1; task <= nTasks; task++) {
                        const input = document.querySelector(`[data-student="${index}"][data-task="${task}"]`);
                        const saved = storedScores[index]?.scores?.[task - 1];
                        const raw = input && input.value !== "" ? Number(input.value) : (saved == null ? 0 : Number(saved));
                        const score = Number.isFinite(raw) ? raw : 0;
                        put(row, task + 2, score);
                        taskSums[task - 1] += score;
                        total += score;
                    }
                    allTotal += total;
                    put(row, totalCol, { formula: `SUM(C${row}:${getExcelColumnName(lastTaskCol)}${row})`, result: total }, { bold: true });
                    put(row, percentCol, { formula: `IF(${getExcelColumnName(totalCol)}${taskStartRow}=0,0,ROUND(${getExcelColumnName(totalCol)}${row}/${getExcelColumnName(totalCol)}${taskStartRow}*100,0))`, result: maxTotal ? Math.round(total / maxTotal * 100) : 0 }, { bold: true });
                });

                // Örtaça ball qatori
                put(averageRow, 1, "");
                put(averageRow, 2, "");
                for (let task = 1; task <= nTasks; task++) {
                    const col = task + 2;
                    const avg = classStudents.length ? taskSums[task - 1] / classStudents.length : 0;
                    put(averageRow, col, { formula: classStudents.length ? `AVERAGE(${getExcelColumnName(col)}${studentStartRow}:${getExcelColumnName(col)}${studentEndRow})` : "0", result: avg }, { bold: true, numFmt: "0.0" });
                }
                const avgTotal = classStudents.length ? allTotal / classStudents.length : 0;
                put(averageRow, totalCol, { formula: classStudents.length ? `AVERAGE(${getExcelColumnName(totalCol)}${studentStartRow}:${getExcelColumnName(totalCol)}${studentEndRow})` : "0", result: avgTotal }, { bold: true, numFmt: "0.0" });
                put(averageRow, percentCol, "");

                // Örtaça körsatkiç foizda
                worksheet.mergeCells(averagePercentRow, 1, averagePercentRow, 2);
                put(averagePercentRow, 1, "Örtaça körsatkiç % da", { bold: true });
                for (let task = 1; task <= nTasks; task++) {
                    const col = task + 2;
                    const avg = classStudents.length ? taskSums[task - 1] / classStudents.length : 0;
                    const pct = maxScores[task - 1] ? Math.round(avg / maxScores[task - 1] * 100) : 0;
                    put(averagePercentRow, col, { formula: `IF(${getExcelColumnName(col)}${taskStartRow}=0,0,ROUND(${getExcelColumnName(col)}${averageRow}/${getExcelColumnName(col)}${taskStartRow}*100,0))`, result: pct }, { bold: true, numFmt: '0"%"' });
                }
                const avgPct = maxTotal ? Math.round(avgTotal / maxTotal * 100) : 0;
                put(averagePercentRow, totalCol, { formula: `IF(${getExcelColumnName(totalCol)}${taskStartRow}=0,0,ROUND(${getExcelColumnName(totalCol)}${averageRow}/${getExcelColumnName(totalCol)}${taskStartRow}*100,0))`, result: avgPct }, { bold: true, numFmt: '0"%"' });
                put(averagePercentRow, percentCol, "");

                worksheet.eachRow(row => { row.height = 22; });
                worksheet.views = [{ state: "frozen", ySplit: 6 }];
                const buffer = await workbook.xlsx.writeBuffer();
                const safeClass = (selectedClass || "sinf").replace(/[\\/:*?"<>|]/g, "_");
                const safeSubject = (subject || "fan").replace(/[\\/:*?"<>|]/g, "_");
                const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `EduScore_${safeClass}_${safeSubject}_tahlil.xlsx`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error("Excel xatosi:", error);
                alert("Excel yaratishda xatolik: " + error.message);
            }
        });
    }


    // =====================================
    // EXCEL USTUN HARFINI ANIQLASH
    // =====================================

    function getExcelColumnName(number) {

        let result = "";


        while (
            number > 0
        ) {

            const remainder =
                (number - 1) % 26;


            result =
                String.fromCharCode(
                    65 + remainder
                ) +
                result;


            number =
                Math.floor(
                    (number - 1) / 26
                );

        }


        return result;

    }

});