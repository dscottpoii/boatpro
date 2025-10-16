# Landing Page Review

## Summary
- The hero opt-in form still points at placeholder Formspree and redirect URLs, so leads cannot complete the signup funnel.
- The premium PayPal checkout uses a dummy button ID, blocking paid conversions during the offer.
- The email capture form lacks accessible labels/autocomplete hints, and analytics is configured with a placeholder property, leaving both UX and tracking gaps.

## Findings

1. **Formspree endpoint still contains a placeholder ID (Blocker)**
   The `action` attribute is set to `https://formspree.io/f/YOUR_FORMSPREE_ID`, so submissions will fail until a real project ID is provided. Swap in the production Formspree endpoint to restore lead capture.
   _Location:_ `landing.html`, line 513.

2. **Redirect URL points to a placeholder domain**  
   The `_next` hidden input currently targets `https://yourusername.github.io/boat-pro-landing/thank-you.html`, which does not match this repository's production domain. Update it to the published thank-you URL (for example, `/thank-you.html`) to keep subscribers on the correct site.  
   _Location:_ `landing.html`, line 517.

3. **PayPal checkout button is inactive (Blocker)**
   The PayPal form still references `YOUR_PAYPAL_BUTTON_ID`, so PayPal rejects the request. Insert the real hosted button ID generated in PayPal so buyers can complete the premium purchase.
   _Location:_ `landing.html`, line 567.

4. **Email inputs are missing explicit labels (High)**
   Because the form only uses placeholders, assistive technologies and browser autofill cannot reliably identify the fields. Add visually-associated `<label>` elements, and include `id`/`for` plus `autocomplete="name"` and `autocomplete="email"` attributes to improve accessibility and conversions.
   _Location:_ `landing.html`, lines 514-515.

5. **Google Analytics property is still a placeholder (Medium)**
   The gtag snippet initializes `G-XXXXXXXXXX`, so no sessions are recorded and the script throws a 404 request in production. Update the property ID to the live GA4 measurement ID or remove the snippet until it is available.
   _Location:_ `landing.html`, lines 2-9.

6. **Analytics script precedes the `<html>` element (Low)**
   The GA script block is declared between the `<!DOCTYPE html>` and `<html>` tags, which is invalid document structure and can trip up validators. Move the script into the `<head>` element (after the opening `<html>`) when wiring up the real analytics ID.
   _Location:_ `landing.html`, lines 2-9.
