# Tasks - פורטל פניות הציבור האחוד

## Task 1: Create HTML Structure
**Status:** ✅ completed  
**Relates to:** REQ-001, REQ-005, REQ-006, REQ-007, REQ-008  

Create the main `index.html` file with:
- HTML5 document structure with RTL and Hebrew lang
- IGDS-compliant header with Nimbus logo
- Form with all required input fields (firstName, lastName, email, phone, description)
- Confirmation view (hidden by default)
- Footer with government information
- Skip navigation link
- Semantic HTML elements (header, main, footer, form, fieldset, legend)
- ARIA attributes on all form elements

---

## Task 2: Implement IGDS Styles
**Status:** ✅ completed  
**Relates to:** REQ-007, REQ-008, REQ-006  

Create `css/styles.css` with:
- Government color palette (#003B71, #0066CC)
- Rubik font from Google Fonts
- RTL layout system
- Responsive breakpoints (mobile, tablet, desktop)
- Form styling with proper spacing and alignment
- Error state styling
- Success/confirmation view styling
- Focus indicators for keyboard navigation
- Minimum 44x44px touch targets for buttons
- 4.5:1 contrast ratio compliance

---

## Task 3: Implement Form Validation
**Status:** ✅ completed  
**Relates to:** REQ-002, REQ-009  

Implement in `js/app.js`:
- Required field validation (non-empty check)
- Email format validation (RFC 5322 pattern)
- Israeli phone format validation (05X-XXXXXXX or 0X-XXXXXXX)
- Minimum length validation for name fields (2 chars) and description (10 chars)
- XSS sanitization on textarea content
- Inline error message display in Hebrew
- Error messages with role="alert" for accessibility
- Clear errors on field focus

---

## Task 4: Implement Ministry Routing Logic
**Status:** ✅ completed  
**Relates to:** REQ-003  

Implement in `js/app.js`:
- Ministry directory with 13 ministries and keyword maps
- Keyword-matching algorithm for free text classification
- Default routing to "משרד ראש הממשלה" when no match found
- Score-based matching for best ministry selection

---

## Task 5: Implement Submission and Confirmation Flow
**Status:** ✅ completed  
**Relates to:** REQ-004, REQ-009  

Implement in `js/app.js`:
- Form submission handler with validation gate
- Double-submit prevention (button disable)
- UUID-based reference number generation
- Timestamp recording
- Form view hide / Confirmation view show transition
- Display target ministry, reference number, and timestamp
- Form clear after successful submission
- aria-live region for dynamic content update

---

## Task 6: Setup Local Development Server
**Status:** ✅ completed  
**Relates to:** REQ-010  

- Verify project runs with `python3 -m http.server 8000`
- Access at `http://localhost:8000`
- No build steps required
