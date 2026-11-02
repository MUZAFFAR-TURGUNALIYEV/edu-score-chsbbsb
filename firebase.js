import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBqnBNTT9bgDlNfPmtF24LnPsSt0GSyKGg",
    authDomain: "edu-score-c71ca.firebaseapp.com",
    projectId: "edu-score-c71ca",
    storageBucket: "edu-score-c71ca.firebasestorage.app",
    messagingSenderId: "644392627263",
    appId: "1:644392627263:web:b09bdc1f8bed7483121c8a",
    measurementId: "G-8NWXMWWB31"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);