document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // FAQAT CHSB TANLANGANDA ISHLAYDI
    // =====================================

    const assessmentType = localStorage.getItem("assessmentType");

    if (assessmentType !== "CHSB") {
        return;
    }

    // =====================================
    // MA'LUMOTLAR
    // =====================================

    const teacherName = localStorage.getItem("teacherName") || "";
    const selectedClass = localStorage.getItem("selectedClass") || "";
    const subject = localStorage.getItem("selectedSubject") || "";

    const classStudents = JSON.parse(
        localStorage.getItem("classStudents") || "[]"
    );

    const selectedSchool = localStorage.getItem("selectedSchool") || "yangiyer-9";

    const schoolName = selectedSchool === "guliston-28"
        ? "Guliston tumani 28-maktab"
        : "Yangiyer shahar 9-maktab";

    // CHSB maksimal ballari
    const maxScores = [7.5, 27, 5.5];

    const competencyNames = [
        "Bilish",
        "Qöllaş",
        "Mulohaza"
    ];

    // =====================================
    // SAHIFA ELEMENTLARI
    // =====================================

    const teacherNameEl = document.getElementById("teacherName");
    const classNameEl = document.getElementById("className");
    const subjectNameEl = document.getElementById("subjectName");

    if (teacherNameEl) teacherNameEl.textContent = teacherName;
    if (classNameEl) classNameEl.textContent = selectedClass;
    if (subjectNameEl) subjectNameEl.textContent = subject;

    const assessmentCard = document.querySelector(".assessment-card");

    if (!assessmentCard) {
        console.error("assessment-card topilmadi.");
        return;
    }

    // =====================================
    // CHSB JADVALI
    // =====================================

    assessmentCard.innerHTML = `
        <div style="padding: 20px;">

            <h2 style="margin-bottom: 8px;">
                CHSB — Tahlil jadvali
            </h2>

            <p style="margin-bottom: 20px; color: #777;">
                Öquvçilarniŋ kompetensiyalar böyiça ballarini kiriting.
            </p>

            <div style="
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 20px;
            ">

                <div>
                    <label for="chsbQuarter">Çorak</label>
                    <select id="chsbQuarter" style="display:block; padding:8px; margin-top:5px;">
                        <option value="1">1-çorak</option>
                        <option value="2">2-çorak</option>
                        <option value="3">3-çorak</option>
                        <option value="4">4-çorak</option>
                    </select>
                </div>

                <div>
                    <label for="chsbNumber">CHSB raqami</label>
                    <select id="chsbNumber" style="display:block; padding:8px; margin-top:5px;">
                        <option value="1">CHSB-1</option>
                        <option value="2">CHSB-2</option>
                    </select>
                </div>

                <div>
                    <label for="chsbYear">Öquv yili</label>
                    <input
                        id="chsbYear"
                        type="text"
                        value="2026-2027"
                        style="display:block; padding:8px; margin-top:5px; width:110px;"
                    >
                </div>

            </div>

            <div style="
                overflow-x: auto;
                width: 100%;
            ">

                <table id="chsbTable" style="
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 850px;
                ">

                    <thead>
                        <tr>
                            <th rowspan="2">№</th>
                            <th rowspan="2">F.I.O</th>
                            <th colspan="3">Kompetensiyalar böyiça ball</th>
                            <th rowspan="2">Jami ball</th>
                            <th colspan="4">Natija (%)</th>
                        </tr>

                        <tr>
                            <th>Bilish</th>
                            <th>Qöllaş</th>
                            <th>Mulohaza</th>
                            <th>Bilish</th>
                            <th>Qöllaş</th>
                            <th>Mulohaza</th>
                            <th>Jami</th>
                        </tr>

                        <tr>
                            <th colspan="2">Maksimal ball</th>
                            <th>${maxScores[0]}</th>
                            <th>${maxScores[1]}</th>
                            <th>${maxScores[2]}</th>
                            <th>${maxScores.reduce((a, b) => a + b, 0)}</th>
                            <th>100%</th>
                            <th>100%</th>
                            <th>100%</th>
                            <th>100%</th>
                        </tr>
                    </thead>

                    <tbody id="chsbStudentTable"></tbody>

                    <tfoot>
                        <tr id="chsbAverageRow">
                            <th colspan="2">Örtaça ball</th>
                            <th id="avgBilish">0</th>
                            <th id="avgQollash">0</th>
                            <th id="avgMulohaza">0</th>
                            <th id="avgTotal">0</th>
                            <th colspan="4"></th>
                        </tr>

                        <tr id="chsbPercentRow">
                            <th colspan="2">Örtaça körsatkiç % da</th>
                            <th id="percentBilish">0%</th>
                            <th id="percentQollash">0%</th>
                            <th id="percentMulohaza">0%</th>
                            <th id="percentTotal">0%</th>
                            <th colspan="4"></th>
                        </tr>
                    </tfoot>

                </table>

            </div>

            <div style="
                display:flex;
                flex-wrap:wrap;
                align-items:center;
                gap:12px;
                margin-top:20px;
            ">

                <div>
                    Öquvçilar:
                    <strong id="studentCount">${classStudents.length}</strong>
                </div>

                <button id="saveCHSBButton">Saqlash</button>

                <button id="downloadCHSBButton">Excel yuklab olish</button>

            </div>

            <p style="margin-top:15px; color:#777; font-size:13px;">
                Maksimal ballar: Bilish — 7.5, Qöllaş — 27, Mulohaza — 5.5.
            </p>

        </div>
    `;

    // =====================================
    // JADVAL UCHUN CHEGARALAR
    // =====================================

    const table = document.getElementById("chsbTable");

    table.querySelectorAll("th, td").forEach(cell => {
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "9px";
        cell.style.textAlign = "center";
    });

    table.querySelectorAll("thead th").forEach(cell => {
        cell.style.background = "#f1f5f9";
        cell.style.fontWeight = "600";
    });

    // =====================================
    // SAQLANGAN BAHOLARNI OLISH
    // =====================================

    const storageKey = "chsbScores";

    const savedData = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
    );

    const savedQuarter = localStorage.getItem("chsbQuarter");
    const savedNumber = localStorage.getItem("chsbNumber");
    const savedYear = localStorage.getItem("chsbYear");

    if (savedQuarter) {
        document.getElementById("chsbQuarter").value = savedQuarter;
    }

    if (savedNumber) {
        document.getElementById("chsbNumber").value = savedNumber;
    }

    if (savedYear) {
        document.getElementById("chsbYear").value = savedYear;
    }

    // =====================================
    // O'QUVCHILARNI JADVALGA CHIQARISH
    // =====================================

    const studentTable = document.getElementById("chsbStudentTable");

    classStudents.forEach((student, index) => {

        const tr = document.createElement("tr");

        const numberTd = document.createElement("td");
        numberTd.textContent = index + 1;
        tr.appendChild(numberTd);

        const nameTd = document.createElement("td");
        nameTd.textContent = student;
        nameTd.style.textAlign = "left";
        nameTd.style.minWidth = "220px";
        tr.appendChild(nameTd);

        for (let competency = 0; competency < 3; competency++) {

            const td = document.createElement("td");

            const input = document.createElement("input");

            input.type = "number";
            input.min = "0";
            input.max = String(maxScores[competency]);
            input.step = "0.1";
            input.placeholder = "0";
            input.className = "chsb-score-input";

            input.style.width = "75px";
            input.style.padding = "7px";
            input.style.textAlign = "center";

            input.dataset.student = index;
            input.dataset.competency = competency;

            const savedScore = savedData[index]?.scores?.[competency];

            if (savedScore !== undefined && savedScore !== null) {
                input.value = savedScore;
            }

            input.addEventListener("input", function () {

                let value = Number(input.value);

                if (input.value !== "" && value > maxScores[competency]) {
                    input.value = maxScores[competency];
                }

                if (value < 0) {
                    input.value = 0;
                }

                calculateResults();

            });

            td.appendChild(input);
            tr.appendChild(td);

        }

        const totalTd = document.createElement("td");
        totalTd.id = `chsbTotal${index}`;
        totalTd.textContent = "0";
        tr.appendChild(totalTd);

        for (let i = 0; i < 4; i++) {

            const percentTd = document.createElement("td");
            percentTd.id = `chsbPercent${index}_${i}`;
            percentTd.textContent = "0%";
            tr.appendChild(percentTd);

        }

        studentTable.appendChild(tr);

    });

    // =====================================
    // NATIJALARNI HISOBLASH
    // =====================================

    function getStudentScores(index) {

        const scores = [];

        for (let competency = 0; competency < 3; competency++) {

            const input = document.querySelector(
                `[data-student="${index}"][data-competency="${competency}"]`
            );

            scores.push(
                input && input.value !== ""
                    ? Number(input.value)
                    : 0
            );

        }

        return scores;
    }

    function calculateResults() {

        const sums = [0, 0, 0];
        let totalAll = 0;

        classStudents.forEach((student, index) => {

            const scores = getStudentScores(index);

            const total = scores.reduce((a, b) => a + b, 0);

            totalAll += total;

            scores.forEach((score, competency) => {
                sums[competency] += score;
            });

            document.getElementById(`chsbTotal${index}`).textContent =
                total.toFixed(1);

            scores.forEach((score, competency) => {

                const percent = maxScores[competency]
                    ? (score / maxScores[competency]) * 100
                    : 0;

                document.getElementById(
                    `chsbPercent${index}_${competency}`
                ).textContent = Math.round(percent) + "%";

            });

            const totalMax = maxScores.reduce((a, b) => a + b, 0);

            const totalPercent = totalMax
                ? (total / totalMax) * 100
                : 0;

            document.getElementById(
                `chsbPercent${index}_3`
            ).textContent = Math.round(totalPercent) + "%";

        });

        const count = classStudents.length;

        const average = sums.map(sum =>
            count ? sum / count : 0
        );

        const maxTotal = maxScores.reduce((a, b) => a + b, 0);

        const averageTotal = count ? totalAll / count : 0;

        document.getElementById("avgBilish").textContent =
            average[0].toFixed(1);

        document.getElementById("avgQollash").textContent =
            average[1].toFixed(1);

        document.getElementById("avgMulohaza").textContent =
            average[2].toFixed(1);

        document.getElementById("avgTotal").textContent =
            averageTotal.toFixed(1);

        document.getElementById("percentBilish").textContent =
            Math.round(average[0] / maxScores[0] * 100) + "%";

        document.getElementById("percentQollash").textContent =
            Math.round(average[1] / maxScores[1] * 100) + "%";

        document.getElementById("percentMulohaza").textContent =
            Math.round(average[2] / maxScores[2] * 100) + "%";

        document.getElementById("percentTotal").textContent =
            Math.round(averageTotal / maxTotal * 100) + "%";

    }

    calculateResults();

    // =====================================
    // BAHOLARNI SAQLASH
    // =====================================

    document.getElementById("saveCHSBButton").addEventListener("click", function () {

        const scores = classStudents.map((student, index) => ({
            student: student,
            scores: getStudentScores(index)
        }));

        localStorage.setItem(storageKey, JSON.stringify(scores));

        localStorage.setItem(
            "chsbQuarter",
            document.getElementById("chsbQuarter").value
        );

        localStorage.setItem(
            "chsbNumber",
            document.getElementById("chsbNumber").value
        );

        localStorage.setItem(
            "chsbYear",
            document.getElementById("chsbYear").value
        );

        alert("CHSB baholari saqlandi.");

    });

    // =====================================
    // EXCEL YUKLAB OLISH
    // =====================================

    // =====================================
    // EXCEL YUKLAB OLISH — RASMDAGI SHABLON
    // =====================================

    document.getElementById("downloadCHSBButton").addEventListener("click", async function () {

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

            const worksheet = workbook.addWorksheet(selectedClass || "CHSB");

            const font = "Times New Roman";

            const thin = {
                style: "thin",
                color: { argb: "FF000000" }
            };

            const border = {
                top: thin,
                left: thin,
                bottom: thin,
                right: thin
            };

            const totalMax = maxScores.reduce((a, b) => a + b, 0);

            const quarter = document.getElementById("chsbQuarter").value;
            const chsbNumber = document.getElementById("chsbNumber").value;
            const year = document.getElementById("chsbYear").value;

            // =====================================
            // YORDAMCHI FUNKSIYA
            // =====================================

            function put(row, col, value, options = {}) {
                const cell = worksheet.getCell(row, col);

                cell.value = value;

                cell.font = {
                    name: font,
                    size: options.size || 11,
                    bold: !!options.bold,
                    underline: !!options.underline
                };

                cell.alignment = {
                    horizontal: options.align || "center",
                    vertical: "middle",
                    wrapText: true
                };

                cell.border = border;

                if (options.numFmt) {
                    cell.numFmt = options.numFmt;
                }

                return cell;
            }

            // =====================================
            // USTUN KENGLIKLARI
            // =====================================

            worksheet.getColumn(1).width = 6;
            worksheet.getColumn(2).width = 43;

            for (let col = 3; col <= 10; col++) {
                worksheet.getColumn(col).width = 14;
            }

            // =====================================
            // 1-QATOR: ASOSIY SARLAVHA
            // =====================================

            worksheet.mergeCells("A1:J1");

            put(
                1,
                1,
                `${schoolName}  ${quarter}-Çorak ${chsbNumber}-CHSB böyiça tahlil  (${year} öquv yili)`,
                {
                    bold: true,
                    size: 12
                }
            );

            worksheet.getRow(1).height = 27;

            // =====================================
            // 2-QATOR: SINF
            // =====================================

            worksheet.mergeCells("A2:B2");

            put(2, 2, "Sinf", {
                bold: true,
                align: "right",
                border: false
            });

            put(2, 3, selectedClass, {
                bold: true
            });

            // =====================================
            // 3-QATOR: FAN
            // =====================================

            worksheet.mergeCells("B3:B3");
            worksheet.mergeCells("C3:E3");

            put(3, 2, "Fan", {
                bold: true
            });

            put(3, 3, subject, {
                bold: true
            });

            // =====================================
            // 4-5-QATOR: JADVAL SARLAVHALARI
            // =====================================

            worksheet.mergeCells("A4:A5");
            worksheet.mergeCells("B4:B5");

            worksheet.mergeCells("C4:E4");

            worksheet.mergeCells("F4:F5");

            worksheet.mergeCells("G4:J4");

            put(4, 1, "№", { bold: true });
            put(4, 2, "F.I.O", { bold: true });

            put(4, 3, "Kompetensiyalar böyiça ball", {
                bold: true
            });

            put(4, 6, "Jami ball", {
                bold: true
            });

            put(4, 7, "Natija", {
                bold: true
            });

            put(5, 3, "Bilish (ball)", { bold: true });
            put(5, 4, "Qöllaş (ball)", { bold: true });
            put(5, 5, "Mulohaza (ball)", { bold: true });

            put(5, 7, "Bilish %", { bold: true });
            put(5, 8, "Qöllaş %", { bold: true });
            put(5, 9, "Mulohaza %", { bold: true });
            put(5, 10, "jami 100%", { bold: true });

            worksheet.getRow(4).height = 32;
            worksheet.getRow(5).height = 32;

            // =====================================
            // 6-QATOR: MAKSIMAL BALLAR
            // =====================================

            put(6, 1, "");
            put(6, 2, "");

            maxScores.forEach((score, index) => {
                put(6, index + 3, score, {
                    bold: true
                });
            });

            put(6, 6, "");

            for (let col = 7; col <= 10; col++) {
                put(6, col, "");
            }

            // =====================================
            // 7-QATORdan: O'QUVCHILAR
            // =====================================

            const studentStartRow = 7;

            const sums = [0, 0, 0];
            let totalAll = 0;

            classStudents.forEach((student, index) => {

                const row = studentStartRow + index;

                const scores = getStudentScores(index);

                const total = scores.reduce((a, b) => a + b, 0);

                put(row, 1, index + 1);
                put(row, 2, student, {
                    align: "left"
                });

                scores.forEach((score, competency) => {

                    put(row, competency + 3, score);

                    sums[competency] += score;

                    const percent = maxScores[competency]
                        ? Math.round(score / maxScores[competency] * 100)
                        : 0;

                    put(
                        row,
                        competency + 7,
                        percent
                    );

                });

                totalAll += total;

                put(row, 6, total, {
                    numFmt: "0.0"
                });

                const totalPercent = totalMax
                    ? Math.round(total / totalMax * 100)
                    : 0;

                put(row, 10, totalPercent);

                worksheet.getRow(row).height = 24;
            });

            // =====================================
            // O'RTACHA BALL QATORI
            // =====================================

            const averageRow = studentStartRow + classStudents.length;

            const count = classStudents.length;

            const averages = sums.map(sum =>
                count ? sum / count : 0
            );

            const averageTotal = count
                ? totalAll / count
                : 0;

            put(averageRow, 1, "");
            put(averageRow, 2, "");

            averages.forEach((average, index) => {
                put(
                    averageRow,
                    index + 3,
                    average,
                    {
                        bold: true,
                        numFmt: "0.0"
                    }
                );
            });

            put(averageRow, 6, averageTotal, {
                bold: true,
                numFmt: "0.0"
            });

            for (let col = 7; col <= 10; col++) {
                put(averageRow, col, "");
            }

            // =====================================
            // O'RTACHA KO'RSATKICH FOIZDA
            // =====================================

            const averagePercentRow = averageRow + 1;

            worksheet.mergeCells(
                averagePercentRow,
                1,
                averagePercentRow,
                2
            );

            put(
                averagePercentRow,
                1,
                "Örtaça körsatkiç % da",
                {
                    bold: true
                }
            );

            averages.forEach((average, index) => {

                const percent = maxScores[index]
                    ? Math.round(average / maxScores[index] * 100)
                    : 0;

                put(
                    averagePercentRow,
                    index + 3,
                    percent,
                    {
                        bold: true
                    }
                );

            });

            const averageTotalPercent = totalMax
                ? Math.round(averageTotal / totalMax * 100)
                : 0;

            put(
                averagePercentRow,
                6,
                averageTotalPercent,
                {
                    bold: true
                }
            );

            // Örtaça foizlar G:J ustunlarida

            averages.forEach((average, index) => {

                const percent = maxScores[index]
                    ? Math.round(average / maxScores[index] * 100)
                    : 0;

                put(
                    averagePercentRow,
                    index + 7,
                    percent,
                    {
                        bold: true
                    }
                );

            });

            put(
                averagePercentRow,
                10,
                averageTotalPercent,
                {
                    bold: true
                }
            );

            // =====================================
            // JADVAL DIZAYNI
            // =====================================

            worksheet.eachRow(row => {

                row.eachCell(cell => {

                    cell.font = {
                        name: font,
                        size: cell.font?.size || 11,
                        bold: cell.font?.bold || false
                    };

                    cell.alignment = {
                        horizontal: cell.alignment?.horizontal || "center",
                        vertical: "middle",
                        wrapText: true
                    };

                    cell.border = border;

                });

            });

            worksheet.getRow(averagePercentRow).height = 25;

            worksheet.views = [
                {
                    state: "frozen",
                    ySplit: 6
                }
            ];

            // =====================================
            // EXCEL FAYLINI YUKLAB OLISH
            // =====================================

            const buffer = await workbook.xlsx.writeBuffer();

            const safeClass = (selectedClass || "sinf")
                .replace(/[\\/:*?"<>|]/g, "_");

            const safeSubject = (subject || "fan")
                .replace(/[\\/:*?"<>|]/g, "_");

            const blob = new Blob(
                [buffer],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download =
                `EduScore_${safeClass}_${safeSubject}_CHSB_tahlil.xlsx`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);

        } catch (error) {

            console.error("CHSB Excel xatosi:", error);

            alert("Excel yaratishda xatolik: " + error.message);

        }

    });


});