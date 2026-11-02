
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    deleteUser
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const form = document.getElementById("registerForm");
const button = document.getElementById("registerButton");
const message = document.getElementById("message");

function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = `message ${type}`;
}

if (!form || !button || !message) {
    console.error(
        "Ro‘yxatdan o‘tish formasi topilmadi. HTML elementlarining ID larini tekshiring."
    );
} else {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username")
            .value.trim().toLowerCase();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (name.length < 3 || name.length > 80) {
            showMessage("Ism va familiyangizni to‘g‘ri kiriting.");
            return;
        }

        if (!/^[a-z0-9._]{3,20}$/.test(username)) {
            showMessage(
                "Login 3–20 belgidan iborat bo‘lsin. Lotin harflari, raqam, nuqta va _ ishlatish mumkin."
            );
            return;
        }

        if (!/^\+?[0-9\s()-]{9,20}$/.test(phone)) {
            showMessage("Telefon raqamini to‘g‘ri kiriting.");
            return;
        }

        if (password.length < 6) {
            showMessage("Parol kamida 6 ta belgidan iborat bo‘lishi kerak.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Parollar bir-biriga mos kelmayapti.");
            return;
        }

        button.disabled = true;
        button.textContent = "Hisob yaratilmoqda...";

        let newUser = null;
        let usernameReserved = false;
        let profileCreated = false;

        const usernameRef = doc(db, "usernames", username);
        const internalEmail = `${username}@login.eduscore.app`;

        try {
            // Login bandligini tekshirish
            const usernameSnapshot = await getDoc(usernameRef);

            if (usernameSnapshot.exists()) {
                showMessage("Bu login band. Boshqa login tanlang.");
                return;
            }

            // Firebase Authentication akkauntini yaratish
            const credential = await createUserWithEmailAndPassword(
                auth,
                internalEmail,
                password
            );

            newUser = credential.user;

            // Loginni UID bilan bog‘lash
            await setDoc(usernameRef, {
                uid: newUser.uid,
                createdAt: serverTimestamp()
            });

            usernameReserved = true;

            // Foydalanuvchi profilini saqlash
            await setDoc(doc(db, "users", newUser.uid), {
                uid: newUser.uid,
                name: name,
                username: username,
                phone: phone,
                createdAt: serverTimestamp()
            });

            profileCreated = true;

            // Kabinetda ko‘rsatish uchun
            localStorage.setItem("teacherName", name);
            localStorage.setItem("teacherPhone", phone);
            localStorage.setItem("teacherLogin", username);

            showMessage(
                "Hisob muvaffaqiyatli yaratildi!",
                "success"
            );

            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Ro‘yxatdan o‘tish xatosi:", error);

            // Qisman yaratilgan ma’lumotlarni tozalash
            if (usernameReserved && !profileCreated) {
                try {
                    await deleteDoc(usernameRef);
                } catch (cleanupError) {
                    console.error(
                        "Login ma’lumotini tozalab bo‘lmadi:",
                        cleanupError
                    );
                }
            }

            if (newUser && !profileCreated) {
                try {
                    await deleteUser(newUser);
                } catch (cleanupError) {
                    console.error(
                        "Akkauntni tozalab bo‘lmadi:",
                        cleanupError
                    );
                }
            }

            if (error.code === "auth/email-already-in-use") {
                showMessage("Bu login band. Boshqa login tanlang.");
            } else if (error.code === "auth/weak-password") {
                showMessage("Kuchliroq parol tanlang.");
            } else if (
                error.code === "auth/operation-not-allowed"
            ) {
                showMessage(
                    "Firebase Console’da Email/Password usulini yoqing."
                );
            } else if (
                error.code === "permission-denied" ||
                error.code === "firestore/permission-denied"
            ) {
                showMessage(
                    "Firestore ruxsat bermadi. Database Rules sozlamalarini tekshiring."
                );
            } else {
                showMessage(
                    "Ro‘yxatdan o‘tish amalga oshmadi. Konsoldagi xatoni tekshiring."
                );
            }

        } finally {
            button.disabled = false;
            button.textContent = "Ro‘yxatdan o‘tish";
        }
    });
}
