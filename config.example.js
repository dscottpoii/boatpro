/**
 * The Boat Pro - Configuration File
 *
 * IMPORTANT: This is an example configuration file.
 * Copy this file to 'config.js' and update with your actual values.
 * DO NOT commit config.js to your repository if it contains sensitive information.
 *
 * Instructions:
 * 1. Copy this file: cp config.example.js config.js
 * 2. Update all placeholder values with your actual credentials
 * 3. Add config.js to .gitignore if it contains sensitive data
 */

const SITE_CONFIG = {
    // ============================================
    // Google Analytics
    // ============================================
    // Get your GA4 Measurement ID from: https://analytics.google.com/
    // Format: G-XXXXXXXXXX
    googleAnalyticsId: 'G-XXXXXXXXXX',

    // ============================================
    // Formspree (Form Submissions)
    // ============================================
    // Sign up at: https://formspree.io/
    // Create a form and get your form ID
    // Format: xXXXXXXX (8 characters)
    formspreeId: 'YOUR_FORMSPREE_ID',

    // ============================================
    // PayPal (Payment Processing)
    // ============================================
    // Create a subscription button at: https://www.paypal.com/buttons/
    // Get the hosted button ID from PayPal
    paypalButtonId: 'YOUR_PAYPAL_BUTTON_ID',

    // ============================================
    // Email Service (Mailchimp/ConvertKit)
    // ============================================
    email: {
        // Service provider: 'mailchimp', 'convertkit', or 'custom'
        provider: 'mailchimp',

        // Mailchimp Configuration
        mailchimp: {
            // Get from your Mailchimp form's action URL
            formActionUrl: 'YOUR_MAILCHIMP_FORM_ACTION_URL',
            // Usually 'EMAIL' for Mailchimp
            emailFieldName: 'EMAIL'
        },

        // ConvertKit Configuration
        convertkit: {
            // Get from ConvertKit form settings
            formId: 'YOUR_CONVERTKIT_FORM_ID',
            // Usually 'email_address' for ConvertKit
            emailFieldName: 'email_address'
        },

        // Custom API Configuration
        custom: {
            // Your custom API endpoint
            apiEndpoint: 'https://api.yourdomain.com/subscribe',
            // Field name expected by your API
            emailFieldName: 'email',
            // HTTP method (usually POST)
            method: 'POST'
        },

        // Enable email service integration
        enabled: false
    },

    // ============================================
    // Site URLs
    // ============================================
    // Your GitHub Pages URL or custom domain
    siteUrl: 'https://yourusername.github.io/boatpro',

    // Individual page URLs (will be prefixed with siteUrl)
    pages: {
        home: '/',
        landing: '/landing.html',
        thankYou: '/thank-you.html',
        newsletter: '/The Boat Pro Newsletter.html',
        privacy: '/privacy.html',
        terms: '/terms.html',
        refund: '/refund.html'
    },

    // ============================================
    // Facebook Pixel (Optional)
    // ============================================
    // Get from Facebook Business Manager: https://business.facebook.com/
    facebookPixelId: null, // Set to your pixel ID if using Facebook ads

    // ============================================
    // Contact Information
    // ============================================
    contact: {
        email: 'support@theboatpro.com',
        // Add other contact methods as needed
    },

    // ============================================
    // Pricing Configuration
    // ============================================
    pricing: {
        free: {
            price: 0,
            name: 'Free Guide Only'
        },
        introductory: {
            price: 4.99,
            period: 'month',
            name: 'Introductory Rate'
        },
        regular: {
            price: 19.99,
            period: 'month',
            name: 'Regular Rate'
        },
        annual: {
            price: 19.99,
            period: 'year',
            originalPrice: 49.99,
            savings: 30.00,
            name: 'Annual Premium'
        }
    },

    // ============================================
    // Feature Flags
    // ============================================
    features: {
        // Enable/disable specific features
        showPricing: true,
        showTestimonials: true,
        enableAnalytics: false, // Set to true when GA is configured
        enableFacebookPixel: false, // Set to true when pixel is configured
        maintenanceMode: false
    },

    // ============================================
    // SEO Configuration
    // ============================================
    seo: {
        siteName: 'The Boat Pro',
        defaultTitle: 'The Boat Pro - Your Essential Boat Show Guide',
        defaultDescription: 'Get your FREE US Boat Show Do\'s and Don\'ts Guide plus exclusive insider tips.',
        keywords: ['boat show', 'annapolis', 'boat guide', 'sailing', 'powerboat'],
        author: 'The Boat Pro',
        twitterHandle: '@theboatpro' // Optional
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
