import { database } from './firebase.js';
import { ref, set, get, update, onValue, push } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

export async function createUserProfile(uid, email, username) {
    const userRef = ref(database, `users/${uid}`);
    const now = new Date().toISOString();
    try {
        await set(userRef, {
            username: username || 'User',
            email: email,
            coins: 0,
            diamonds: 0,
            createdAt: now
        });
        console.log("User profile created for ", email);
        return { success: true };
    } catch (error) {
        console.error("Error creating user profile: ", error.message);
        return { success: false, error: error.message };
    }
}

export function getUserData(uid, callback, once = false) {
    const userRef = ref(database, `users/${uid}`);
    if (once) {
        return get(userRef).then(snapshot => snapshot.val());
    } else {
        return onValue(userRef, (snapshot) => {
            callback(snapshot.val());
        });
    }
}

export async function updateUserBalances(uid, newCoins, newDiamonds) {
    const userRef = ref(database, `users/${uid}`);
    try {
        await update(userRef, {
            coins: newCoins,
            diamonds: newDiamonds
        });
        console.log(`User ${uid} balances updated: Coins=${newCoins}, Diamonds=${newDiamonds}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating user balances: ", error.message);
        return { success: false, error: error.message };
    }
}

export async function updateUserField(uid, field, value) {
    const userRef = ref(database, `users/${uid}`);
    try {
        await update(userRef, {
            [field]: value
        });
        console.log(`User ${uid} field ${field} updated to ${value}`);
        return { success: true };
    } catch (error) {
        console.error(`Error updating user ${field}: `, error.message);
        return { success: false, error: error.message };
    }
}

export async function addRedeemRequest(uid, email, coinsUsed, amount) {
    const requestsRef = ref(database, `redeemRequests`);
    const newRequestRef = push(requestsRef);
    const now = new Date().toISOString();
    try {
        await set(newRequestRef, {
            uid: uid,
            email: email,
            coinsUsed: coinsUsed,
            amount: amount,
            status: 'pending',
            createdAt: now
        });
        console.log("Redeem request added for ", email);
        return { success: true };
    } catch (error) {
        console.error("Error adding redeem request: ", error.message);
        return { success: false, error: error.message };
    }
}

export function getRedeemHistory(uid, callback) {
    const requestsRef = ref(database, `redeemRequests`);
    return onValue(requestsRef, (snapshot) => {
        const requests = snapshot.val();
        const userRequests = [];
        if (requests) {
            for (const key in requests) {
                if (requests[key].uid === uid) {
                    userRequests.push({ id: key, ...requests[key] });
                }
            }
        }
        userRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
        callback(userRequests);
    });
}
