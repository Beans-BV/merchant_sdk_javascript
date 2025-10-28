// ============================================================================
// UTILS - Shared utility functions
// ============================================================================

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Create a dedicated snackbar container
function getSnackbarContainer() {
    let container = document.getElementById('snackbar-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'snackbar-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    return container;
}

// Add snackbar styles once
function addSnackbarStyles() {
    if (document.querySelector('#snackbar-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'snackbar-styles';
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .custom-snackbar {
            transition: all 0.3s ease-out;
            pointer-events: auto;
        }
        .custom-snackbar.fade {
            opacity: 0;
            transform: translateY(100%);
        }
    `;
    document.head.appendChild(style);
}

// Remove snackbar with animation
function removeSnackbar(snackbar) {
    if (snackbar._timeoutId) {
        clearTimeout(snackbar._timeoutId);
    }
    snackbar.classList.add('fade');
    setTimeout(() => {
        if (snackbar.parentNode) {
            snackbar.remove();
        }
    }, 300);
}

// Custom snackbar alert function (like Flutter/Dart snackbar)
function showAlert(message, type = 'info') {
    const container = getSnackbarContainer();
    
    // Remove existing alerts
    container.querySelectorAll('.custom-snackbar').forEach(alert => {
        if (alert._timeoutId) clearTimeout(alert._timeoutId);
        alert.remove();
    });
    
    // Add styles if needed
    addSnackbarStyles();
    
    // Create snackbar
    const snackbar = document.createElement('div');
    snackbar.className = `custom-snackbar alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible`;
    snackbar.style.cssText = `
        min-width: 300px;
        max-width: 500px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        animation: slideUp 0.3s ease-out;
        margin-bottom: 10px;
        opacity: 1;
        visibility: visible;
        display: block;
    `;
    
    snackbar.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span style="flex: 1;">${message}</span>
            <button type="button" class="btn-close" aria-label="Close" style="margin-left: 8px;"></button>
        </div>
    `;
    
    // Add to container
    container.appendChild(snackbar);
    
    // Close button handler
    snackbar.querySelector('.btn-close').addEventListener('click', () => {
        removeSnackbar(snackbar);
    });
    
    // Auto-remove after 5 seconds
    snackbar._timeoutId = setTimeout(() => {
        removeSnackbar(snackbar);
    }, 5000);
}
