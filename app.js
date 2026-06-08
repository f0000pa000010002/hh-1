// This file can be used for global app utilities or initialization if needed.
// For now, most logic is page-specific or handled in auth.js/database.js.

// Utility function to show/hide loading spinners
export function showLoading(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        if (show) {
            element.classList.add('loading-active');
        } else {
            element.classList.remove('loading-active');
        }
    }
}

// Utility for showing toast messages
export function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        const newToastContainer = document.createElement('div');
        newToastContainer.id = 'toast-container';
        document.body.appendChild(newToastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// Function to update user balance display globally if elements exist
export function updateBalanceDisplay(coins, diamonds) {
    const coinDisplay = document.getElementById('user-coins');
    const diamondDisplay = document.getElementById('user-diamonds');
    if (coinDisplay) coinDisplay.textContent = coins;
    if (diamondDisplay) diamondDisplay.textContent = diamonds;
}

// Common navigation setup if needed globally
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
