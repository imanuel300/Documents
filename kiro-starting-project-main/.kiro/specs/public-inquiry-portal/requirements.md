# Requirements - פורטל פניות הציבור האחוד

## Product Overview
פורטל פניות הציבור האחוד הוא מוצר ממשלתי המאפשר לאזרחים להגיש פניות במקום אחד מבלי לדעת מראש איזה משרד ממשלתי מטפל בהן. המערכת מסווגת אוטומטית את נושא הפנייה ומנתבת אותה למשרד המתאים.

## Requirements

### Requirement 1: Inquiry Form Display
**ID:** REQ-001  
**Type:** Functional  
**Priority:** High  

When the system initializes, the web client SHALL display the inquiry form with the following input controls:
- First name (שם פרטי) - text input, required
- Last name (שם משפחה) - text input, required
- Email (אימייל) - email input, required
- Phone (טלפון) - tel input, required
- Free text description (תיאור הפנייה) - textarea, required

The form SHALL render the Nimbus logo header image from `images/header/nimbus_logo.png`.

---

### Requirement 2: Input Validation
**ID:** REQ-002  
**Type:** Functional  
**Priority:** High  

When the user attempts to submit the form, the system SHALL validate all input fields:
- Email field SHALL conform to RFC 5322 email format
- Phone field SHALL accept Israeli phone format (05X-XXXXXXX or 0X-XXXXXXX)
- All required fields SHALL be non-empty
- Free text field SHALL be sanitized against XSS attacks

When validation fails, the system SHALL display field-specific error messages in Hebrew below the relevant input field.

---

### Requirement 3: Automatic Ministry Routing
**ID:** REQ-003  
**Type:** Functional  
**Priority:** High  

When the user submits a valid form, the system SHALL classify the inquiry topic and route it to the appropriate government ministry from the following closed list:
1. משרד הבריאות
2. משרד הפנים
3. נציבות שירות המדינה
4. משרד המשפטים
5. מערך הדיגיטל הלאומי
6. משרד הכלכלה
7. משרד האוצר
8. רשות המסים
9. משרד ראש הממשלה
10. משרד הבטחון
11. משרד העלייה והקליטה
12. רשות האכיפה והגביה
13. משרד התיירות

The routing SHALL be based on keyword matching in the free text description field.

---

### Requirement 4: Submission Confirmation
**ID:** REQ-004  
**Type:** Functional  
**Priority:** High  

When the user submits the form successfully, the application SHALL hide the form inputs and render a single confirmation message view that includes:
- A success icon and confirmation text in Hebrew
- The identified target ministry name
- A unique reference number for the inquiry
- A timestamp of submission

---

### Requirement 5: Single Page Application Architecture
**ID:** REQ-005  
**Type:** Non-Functional / Architectural  
**Priority:** High  

The application SHALL be built as a single page application using Core-Web technologies (Vanilla HTML, CSS, JavaScript) without:
- No backend server dependency
- No database connection
- No external API calls for routing logic

The ministry routing logic SHALL be implemented entirely client-side.

---

### Requirement 6: Accessibility Compliance
**ID:** REQ-006  
**Type:** Non-Functional  
**Priority:** High  

The application user interface SHALL comply with WCAG 2.1 Level AA accessibility standards:
- All form inputs SHALL have associated labels with correct `for` attributes
- All interactive elements SHALL be keyboard-navigable (Tab order)
- Color contrast ratio SHALL meet minimum 4.5:1 for normal text
- Error messages SHALL use `role="alert"` for screen reader announcement
- Required fields SHALL use `aria-required="true"`
- The page SHALL include a skip navigation link
- All images SHALL include descriptive alt text in Hebrew

---

### Requirement 7: RTL and Hebrew Language Support
**ID:** REQ-007  
**Type:** Non-Functional  
**Priority:** High  

The application SHALL render all content in Hebrew with full RTL (Right-to-Left) support:
- HTML document SHALL declare `dir="rtl"` and `lang="he"`
- All text labels, placeholders, and messages SHALL be in Hebrew
- Layout SHALL flow from right to left

---

### Requirement 8: Government Design System Compliance (IGDS)
**ID:** REQ-008  
**Type:** Non-Functional  
**Priority:** Medium  

The application SHALL comply with the Israel Government Design System (IGDS):
- Government color palette (Primary: #003B71, Secondary: #0066CC)
- Rubik font family for all text elements
- Minimum button touch target of 44x44 pixels
- Responsive layout supporting mobile, tablet, and desktop breakpoints

---

### Requirement 9: Security Compliance
**ID:** REQ-009  
**Type:** Non-Functional  
**Priority:** High  

The application SHALL implement client-side security measures:
- XSS prevention through HTML encoding of user content
- No use of innerHTML with user-provided content
- Form clear after successful submission
- Double-submit prevention (disable submit button after click)
- No PII stored in localStorage or sessionStorage

---

### Requirement 10: Local Development Server
**ID:** REQ-010  
**Type:** Operational  
**Priority:** Medium  

The application SHALL be runnable via a local Python HTTP server:
- Command: `python3 -m http.server 8000`
- Access URL: `http://localhost:8000`
- No additional build steps or dependencies required
