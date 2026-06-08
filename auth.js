import { auth, googleProvider } from './firebase.js';
import { createUserProfile, getUserData, updateUserField } from './database.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const protectedRoutes = ['/dashboard.html', '/earn.html', '/mystery-box.html', '/redeem.html', '/profile.html', '/index.html'];
const authRoutes = ['/login.html', '/register.html', '/forgot-password.html'];

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    const currentPath = window.location.pathname;

    // Handle /index.html as a redirector
    if (currentPath === '/' || currentPath === '/index.html') {
        if (user) {
            window.location.href = '/dashboard.html';
        } else {
            window.location.href = '/login.html';
        }
        return; 
    }

    if (user) {
        // User is signed in
        if (authRoutes.includes(currentPath)) {
            window.location.href = '/dashboard.html'; // Redirect from auth pages if logged in
        }

        // Check if user profile exists in DB, create if not (for new Google sign-ins)
        if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            // Potentially new user, ensure profile is created
            const userData = await new Promise(resolve => getUserData(user.uid, resolve, true)); // Fetch once
            if (!userData) {
                console.log("Creating profile for new user: ", user.email);
                await createUserProfile(user.uid, user.email, user.displayName || 'User');
            }
        }

    } else {
        // User is signed out
        if (protectedRoutes.includes(currentPath)) {
            window.location.href = '/login.html'; // Redirect to login if not logged in
        }
    }
});

export function getCurrentUser() {
    return new Promise((resolve) => {
        if (currentUser) {
            resolve(currentUser);
        } else {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                currentUser = user;
                unsubscribe();
                resolve(user);
            });
        }
    });
}

export async function registerUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user.uid, email, username);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Registration failed: ", error.message);
        return { success: false, error: error.message };
    }
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Login failed: ", error.message);
        return { success: false, error: error.message };
    }
}

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Check if user profile exists, create if not
        const userData = await new Promise(resolve => getUserData(user.uid, resolve, true)); // Fetch once
        if (!userData) {
            console.log("Creating profile for new Google user: ", user.email);
            await createUserProfile(user.uid, user.email, user.displayName || user.email.split('@')[0]);
        }
        return { success: true, user };
    } catch (error) {
        console.error("Google sign-in failed: ", error.message);
        return { success: false, error: error.message };
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Password reset email sent!" };
    } catch (error) {
        console.error("Password reset failed: ", error.message);
        return { success: false, error: error.message };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = '/login.html';
        return { success: true };
    } catch (error) {
        console.error("Logout failed: ", error.message);
        return { success: false, error: error.message };
    }
}
