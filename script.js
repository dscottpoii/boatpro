// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-btn');
    const emailInput = document.getElementById('email');
    const landingPage = document.getElementById('landing-page');
    const successPage = document.getElementById('success-page');
    const userEmailDisplay = document.getElementById('user-email');

    // Handle form submission
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            emailInput.focus();
            return;
        }

        // Show success page
        showSuccessPage(email);
        
        // Optional: Send to your email service (replace with your actual endpoint)
        sendToEmailService(email);
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show success page
    function showSuccessPage(email) {
        // Hide landing page
        landingPage.classList.add('hidden');
        
        // Show success page
        successPage.classList.remove('hidden');
        
        // Display user's email
        userEmailDisplay.textContent = email;
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Send to Mailchimp
    function sendToEmailService(email) {
        // Mailchimp form submission
        // This uses Mailchimp's native form POST method
        const MAILCHIMP_URL = 'YOUR_MAILCHIMP_FORM_ACTION_URL';
        
        // Create a hidden form to submit to Mailchimp
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = MAILCHIMP_URL;
        form.target = '_blank'; // Open in new tab to avoid leaving page
        form.style.display = 'none';
        
        // Add email field
        const emailField = document.createElement('input');
        emailField.type = 'email';
        emailField.name = 'EMAIL'; // Mailchimp default field name
        emailField.value = email;
        form.appendChild(emailField);
        
        // Add to page, submit, then remove
        document.body.appendChild(form);
        
        // Note: We already showed success page, so this submission happens in background
        // form.submit(); // Uncomment when you have your Mailchimp URL
        
        setTimeout(() => {
            document.body.removeChild(form);
        }, 100);
        
        // Store in localStorage for tracking
        localStorage.setItem('boat_show_email', email);
        localStorage.setItem('boat_show_signup_date', new Date().toISOString());
        
        console.log('Email ready for Mailchimp:', email);
    }

    // Allow Enter key to submit
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
});
