/**
 * The Boat Pro - Form Submission Handler
 * Handles email capture, validation, and email service integration
 */

// Configuration object - Update these values for production
const CONFIG = {
    // Email service endpoint - Update with your Mailchimp/ConvertKit/Custom API URL
    emailServiceUrl: 'YOUR_MAILCHIMP_FORM_ACTION_URL',
    // Email field name for your email service (e.g., 'EMAIL' for Mailchimp, 'email_address' for ConvertKit)
    emailFieldName: 'EMAIL',
    // Enable/disable email service submission (set to true when configured)
    enableEmailService: false,
    // Local storage keys
    storageKeys: {
        email: 'boat_show_email',
        signupDate: 'boat_show_signup_date'
    }
};

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Initialize form handler when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const landingPage = document.getElementById('landing-page');
    const successPage = document.getElementById('success-page');
    const userEmailDisplay = document.getElementById('user-email');

    // Check if required elements exist
    if (!submitBtn || !emailInput || !landingPage || !successPage || !userEmailDisplay) {
        console.error('Required form elements not found');
        return;
    }

    // Create error message element
    const errorMessage = createErrorElement();
    emailInput.parentElement.insertBefore(errorMessage, emailInput);

    /**
     * Handle form submission
     */
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Clear previous errors
        clearError(emailInput, errorMessage);

        // Validate email
        if (!email) {
            showError(emailInput, errorMessage, 'Please enter your email address');
            return;
        }

        if (!isValidEmail(email)) {
            showError(emailInput, errorMessage, 'Please enter a valid email address');
            return;
        }

        // Show loading state
        setLoadingState(submitBtn, true);

        try {
            // Send to email service
            await sendToEmailService(email);

            // Show success page
            showSuccessPage(email);

            // Track conversion
            trackConversion(email);
        } catch (error) {
            console.error('Form submission error:', error);
            showError(emailInput, errorMessage, 'An error occurred. Please try again.');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });

    /**
     * Allow Enter key to submit
     */
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
        }
    });

    /**
     * Clear error on input
     */
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('error')) {
            clearError(emailInput, errorMessage);
        }
    });
});

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}

/**
 * Show success page with user email
 * @param {string} email - User's email address
 */
function showSuccessPage(email) {
    const landingPage = document.getElementById('landing-page');
    const successPage = document.getElementById('success-page');
    const userEmailDisplay = document.getElementById('user-email');

    // Hide landing page with smooth transition
    landingPage.style.opacity = '0';

    setTimeout(() => {
        landingPage.classList.add('hidden');
        successPage.classList.remove('hidden');

        // Display user's email
        if (userEmailDisplay) {
            userEmailDisplay.textContent = email;
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fade in success page
        successPage.style.opacity = '0';
        setTimeout(() => {
            successPage.style.opacity = '1';
        }, 10);
    }, 300);
}

/**
 * Send email to configured email service
 * @param {string} email - User's email address
 * @returns {Promise} - Resolves when submission is complete
 */
async function sendToEmailService(email) {
    return new Promise((resolve, reject) => {
        // Store in localStorage immediately
        try {
            localStorage.setItem(CONFIG.storageKeys.email, email);
            localStorage.setItem(CONFIG.storageKeys.signupDate, new Date().toISOString());
        } catch (error) {
            console.warn('localStorage not available:', error);
        }

        // If email service is not enabled, resolve immediately
        if (!CONFIG.enableEmailService) {
            console.log('Email service disabled. Email captured:', email);
            resolve();
            return;
        }

        // Submit to email service
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = CONFIG.emailServiceUrl;
            form.target = '_blank'; // Open in new tab to avoid leaving page
            form.style.display = 'none';

            // Add email field
            const emailField = document.createElement('input');
            emailField.type = 'email';
            emailField.name = CONFIG.emailFieldName;
            emailField.value = email;
            form.appendChild(emailField);

            // Add to page and submit
            document.body.appendChild(form);
            form.submit();

            // Clean up after a short delay
            setTimeout(() => {
                document.body.removeChild(form);
                resolve();
            }, 100);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Track conversion event
 * @param {string} email - User's email address
 */
function trackConversion(email) {
    // Google Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'Lead',
            'event_label': 'Email Signup',
            'value': email
        });
    }

    // Facebook Pixel tracking (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }

    console.log('Conversion tracked for:', email);
}

/**
 * Create error message element
 * @returns {HTMLElement} - Error message element
 */
function createErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    return errorDiv;
}

/**
 * Show error message
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message text
 */
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    input.focus();
}

/**
 * Clear error message
 * @param {HTMLElement} input - Input element
 * @param {HTMLElement} errorElement - Error message element
 */
function clearError(input, errorElement) {
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

/**
 * Set button loading state
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
    }
}
