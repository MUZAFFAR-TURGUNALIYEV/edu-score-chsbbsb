
document.addEventListener("DOMContentLoaded", function () {

    // LocalStorage'dan o'qituvchi ismini olish

    const teacherName =
        localStorage.getItem("teacherName");

    if (teacherName) {

        document.getElementById("teacherName").textContent =
            teacherName;

        document.getElementById("welcomeName").textContent =
            teacherName;

    }

    // Keyingi tugma

    const nextButton =
        document.getElementById("nextButton");

    nextButton.addEventListener("click", function () {

        // Tanlangan ma'lumotlarni olish

        const selectedSchool =
            document.getElementById("school").value;

        const selectedClass =
            document.getElementById("class").value;

        const subject =
            document.getElementById("subject").value;

        const assessmentType =
            document.getElementById("assessmentType").value;

        const tasks =
            document.getElementById("tasks").value;


        // Maktabni tekshirish

        if (!selectedSchool) {

            alert("Iltimos, maktabni tanlang.");

            return;
        }


        // Sinfni tekshirish

        if (!selectedClass) {

            alert("Iltimos, sinfni tanlang.");

            return;
        }


        // Fanni tekshirish

        if (!subject) {

            alert("Iltimos, fanni tanlang.");

            return;
        }


        // BSB / CHSB turini tekshirish

        if (!assessmentType) {

            alert("Iltimos, baholash turini tanlang.");

            return;
        }


        // Topshiriqlar sonini tekshirish

        if (!tasks || Number(tasks) < 1) {

            alert("Iltimos, topshiriqlar sonini kiriting.");

            return;
        }


        // Tanlangan maktabning o'quvchilar bazasini olish

        let schoolStudents;

        if (selectedSchool === "yangiyer-9") {

            schoolStudents = students;

        } else if (selectedSchool === "guliston-28") {

            schoolStudents = students28;

        }


        if (!schoolStudents) {

            alert(
                "Bu maktab uchun o‘quvchilar bazasi mavjud emas."
            );

            return;
        }


        // Tanlangan sinf o'quvchilarini olish

        const classStudents =
            schoolStudents[selectedClass];


        if (!classStudents) {

            alert(
                "Bu maktabda tanlangan sinf uchun o‘quvchilar bazasi mavjud emas."
            );

            return;
        }


        // Ma'lumotlarni LocalStorage'ga saqlash

        localStorage.setItem(
            "selectedSchool",
            selectedSchool
        );

        localStorage.setItem(
            "selectedClass",
            selectedClass
        );

        localStorage.setItem(
            "selectedSubject",
            subject
        );

        localStorage.setItem(
            "assessmentType",
            assessmentType
        );

        localStorage.setItem(
            "taskCount",
            tasks
        );

        localStorage.setItem(
            "classStudents",
            JSON.stringify(classStudents)
        );


        // Keyingi sahifa

        window.location.href =
            "assessment.html";

    });

});
