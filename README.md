# Annapolis Boat Show Guide 2025

Professional lead generation website for the Annapolis Boat Shows with premium membership upsell.

## 🚤 Features

- **Responsive Landing Page** with lead capture form
- **Premium Membership** upgrade path ($9.99/month)
- **Downloadable PDF** boat show guide
- **Privacy Policy** compliance
- **Email Marketing** integration ready
- **Payment Processing** ready (Stripe)
- **Analytics Tracking** (Google Analytics & Facebook Pixel)

## 📁 Project Structure

```
boat-show-guide-2025/
├── index.html              # Main landing page
├── membership.html         # Premium membership page
├── thank-you.html         # Thank you page after signup
├── privacy.html           # Privacy policy
├── guide.html             # Boat show guide (optional)
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   ├── images/            # Image assets (logo, photos)
│   └── pdf/               # PDF guide download
├── README.md              # This file
└── .gitignore            # Git ignore file
```

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/boat-show-guide-2025.git
cd boat-show-guide-2025
```

### 2. Required Customizations

Before deploying, you MUST update these placeholders:

#### Google Analytics
Replace `YOUR_GA_ID` with your Google Analytics tracking ID:
- Find in: All HTML files
- Get ID from: https://analytics.google.com

#### Facebook Pixel (Optional)
Replace `YOUR_PIXEL_ID` with your Facebook Pixel ID:
- Find in: index.html, thank-you.html
- Get ID from: Facebook Events Manager

#### Stripe Payment Link
Replace `STRIPE_PAYMENT_LINK_HERE` with your actual Stripe payment link:
- Find in: membership.html
- Get link from: https://dashboard.stripe.com/payment-links

#### Contact Information
Replace placeholder email addresses:
- `support@boatshowinsider.com` → Your support email
- `privacy@boatshowinsider.com` → Your privacy email

#### GitHub Username
Replace `YOUR-USERNAME` with your actual GitHub username:
- Find in: thank-you.html (social share URLs)

#### Personal Information
Replace `[YOUR NAME]` with your actual name:
- Find in: index.html (about section)

### 3. Add Images

Add these images to `assets/images/`:
- `logo.png` - Your logo (recommended size: 200x60px)
- `boat-hero.jpg` - Hero background image
- `expert-photo.jpg` - Your photo or team photo

### 4. Add PDF Guide

Place your boat show guide PDF in `assets/pdf/`:
- `boat-show-guide-2025.pdf`

## 🚀 Deployment to GitHub Pages

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes for deployment

Your site will be live at:
```
https://YOUR-USERNAME.github.io/boat-show-guide-2025/
```

## 📧 Email Integration Options

### Option A: Mailchimp

1. Create Mailchimp account
2. Create audience/list
3. Get embedded form code
4. Update form action in `index.html`

### Option B: ConvertKit

1. Create ConvertKit account
2. Create landing page form
3. Copy form embed code
4. Replace form in `index.html`

### Option C: Custom API

Edit `assets/js/main.js` to send form data to your API:

```javascript
async function sendToAPI(data) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}
```

## 💰 Monetization Setup

### Stripe Integration

1. Create Stripe account: https://stripe.com
2. Navigate to **Products** → **Payment Links**
3. Create payment link:
   - Name: Premium Membership
   - Price: $9.99/month
   - Type: Recurring
4. Copy payment link URL
5. Replace `STRIPE_PAYMENT_LINK_HERE` in `membership.html`

## 📊 Analytics Setup

### Google Analytics

1. Create GA4 property: https://analytics.google.com
2. Copy Measurement ID (format: G-XXXXXXXXXX)
3. Replace `YOUR_GA_ID` in all HTML files

### Facebook Pixel (Optional)

1. Create pixel in Facebook Events Manager
2. Copy Pixel ID
3. Replace `YOUR_PIXEL_ID` in HTML files

## 🧪 Testing Checklist

Before going live, test:

- [ ] All pages load correctly
- [ ] Forms submit properly
- [ ] Links work (navigation, footer, CTAs)
- [ ] Images display correctly
- [ ] Mobile responsive design
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Analytics tracking fires
- [ ] Payment link redirects correctly
- [ ] Privacy policy is complete
- [ ] All placeholder text replaced

## 🔧 Customization Guide

### Colors

Edit CSS variables in `assets/css/style.css`:

```css
:root {
    --primary-color: #1e40af;      /* Main blue */
    --secondary-color: #0891b2;    /* Teal */
    --accent-color: #fbbf24;       /* Gold/yellow */
}
```

### Fonts

Current font: Inter (from Google Fonts)

To change, update in HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap" rel="stylesheet">
```

Then update CSS:
```css
body {
    font-family: 'YOUR-FONT', sans-serif;
}
```

## 📝 Content Updates

### Pricing

To change membership price:
1. Update in `membership.html` (multiple locations)
2. Update Stripe payment link
3. Update marketing materials

### Show Dates

Update show dates in:
- `index.html` - Footer
- `guide.html` - Throughout document
- Meta descriptions

## 🔒 Security Best Practices

1. **Never commit sensitive data** to repository
2. **Use environment variables** for API keys (if using backend)
3. **Enable HTTPS** (automatic with GitHub Pages)
4. **Regular security audits** of dependencies
5. **Keep privacy policy updated**

## 📱 Social Media Integration

### Share Buttons

Customize share URLs in `thank-you.html`:

```html
<!-- Facebook -->
<a href="https://www.facebook.com/sharer/sharer.php?u=YOUR-URL">

<!-- Twitter -->
<a href="https://twitter.com/intent/tweet?text=YOUR-TEXT&url=YOUR-URL">
```

## 🐛 Troubleshooting

### GitHub Pages Not Updating

```bash
# Clear cache and force push
git add .
git commit -m "Force update"
git push -f origin main
```

### Images Not Displaying

- Check file paths (case-sensitive!)
- Ensure images are in `assets/images/`
- Verify file extensions match code

### Forms Not Submitting

- Check browser console for errors
- Verify email service integration
- Test with simple `console.log()` first

## 📚 Additional Resources

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Stripe Docs**: https://stripe.com/docs
- **Google Analytics**: https://analytics.google.com/analytics/academy/
- **Mailchimp API**: https://mailchimp.com/developer/

## 🤝 Support

For support:
- Email: support@boatshowinsider.com
- GitHub Issues: Create an issue in this repository

## 📄 License

Copyright © 2025 Boat Show Insider. All rights reserved.

## 🎯 Next Steps After Deployment

1. **Test thoroughly** on mobile and desktop
2. **Set up email automation** sequence
3. **Create social media posts** to promote
4. **Monitor analytics** for insights
5. **A/B test** different headlines and CTAs
6. **Collect testimonials** from users
7. **Update content** regularly

---

**Live Site**: https://YOUR-USERNAME.github.io/boat-show-guide-2025/

**Last Updated**: October 6, 2025  
