import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const form = document.getElementById("loginForm");
const button = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = `message ${type}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username")
        .value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    if (!/^[a-z0-9._]{3,20}$/.test(username)) {
        showMessage("Login formati noto‘g‘ri.");
        return;
    }

    button.disabled = true;
    button.textContent = "Tekshirilmoqda...";

    try {
        const internalEmail = `${username}@login.eduscore.app`;

        const credential = await signInWithEmailAndPassword(
            auth,
            internalEmail,
            password
        );

        const userRef = doc(db, "users", credential.user.uid);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
            showMessage("Foydalanuvchi profili topilmadi.");
            return;
        }

        const userData = userSnapshot.data();

        localStorage.setItem("teacherName", userData.name);
        localStorage.setItem("teacherPhone", userData.phone);
        localStorage.setItem("teacherLogin", userData.username);

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/user-not-found" ||
            error.code === "auth/wrong-password"
        ) {
            showMessage("Login yoki parol noto‘g‘ri.");
        } else {
            showMessage("Kirish amalga oshmadi. Qayta urinib ko‘ring.");
        }

    } finally {
        button.disabled = false;
        button.textContent = "Kirish";
    }
});