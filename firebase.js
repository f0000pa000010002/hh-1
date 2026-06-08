import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyBhuSxkjcsZ3TtNGYCOXOOl7-WWG_EsgPo",
    authDomain: "ililbb-70fb0.firebaseapp.com",
    databaseURL: "https://ililbb-70fb0-default-rtdb.firebaseio.com",
    projectId: "ililbb-70fb0",
    storageBucket: "ililbb-70fb0.firebasestorage.app",
    messagingSenderId: "1059355688483",
    appId: "1:1059355688483:web:a71b5f3bc4fb31ee86fb96",
    measurementId: "G-GVEB9G3V95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

export { auth, database, googleProvider };
