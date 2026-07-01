# Design - פורטל פניות הציבור האחוד

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Core-Web (Vanilla HTML/CSS/JS) | Prototype-only, no build step required |
| UI Componentry | Custom IGDS-based components | Government design compliance |
| Backend | None | Client-side prototype only |
| Database | None | No persistence required |
| Font | Rubik (Google Fonts) | IGDS Hebrew/Arabic support |
| Server | Python3 http.server | Zero-dependency local dev |

## Application Architecture

```
┌─────────────────────────────────────────┐
│           index.html (SPA)              │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │   igds-header (Nimbus Logo)     │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │   Main Content Area             │    │
│  │   ┌───────────────────────┐     │    │
│  │   │  Form View (default)  │     │    │
│  │   │  - First Name         │     │    │
│  │   │  - Last Name          │     │    │
│  │   │  - Email              │     │    │
│  │   │  - Phone              │     │    │
│  │   │  - Description        │     │    │
│  │   │  - Submit Button      │     │    │
│  │   └───────────────────────┘     │    │
│  │   ┌───────────────────────┐     │    │
│  │   │  Confirmation View    │     │    │
│  │   │  (hidden by default)  │     │    │
│  │   │  - Success Message    │     │    │
│  │   │  - Target Ministry    │     │    │
│  │   │  - Reference Number   │     │    │
│  │   └───────────────────────┘     │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │   igds-footer                   │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Application Flow

### Flow 1: Page Load
1. Browser loads `index.html`
2. CSS styles applied (IGDS theme, RTL layout)
3. JavaScript initializes form validation listeners
4. Form view is displayed, confirmation view is hidden
5. Nimbus logo loaded in header

### Flow 2: Form Submission
1. User fills all required fields
2. User clicks "שלח פנייה" (Submit)
3. Client-side validation runs:
   - Validate all required fields are non-empty
   - Validate email format (RFC 5322 pattern)
   - Validate phone format (Israeli format)
   - Sanitize textarea content
4. If validation fails → Display inline error messages
5. If validation passes → Execute ministry routing

### Flow 3: Ministry Routing (Client-Side)
1. Extract free text from description field
2. Run keyword-matching algorithm against ministry keywords map
3. Identify best-matching ministry from closed list of 13
4. If no match found → Default to "משרד ראש הממשלה"

### Flow 4: Confirmation Display
1. Hide form view
2. Generate unique reference number (UUID-based)
3. Record current timestamp
4. Display confirmation view with:
   - Success icon (✓)
   - "הפנייה נשלחה בהצלחה" message
   - Target ministry name
   - Reference number
   - Submission timestamp

## Data Models

### InquiryForm
```typescript
interface InquiryForm {
  firstName: string;      // שם פרטי - required, min 2 chars
  lastName: string;       // שם משפחה - required, min 2 chars
  email: string;          // אימייל - required, RFC 5322 format
  phone: string;          // טלפון - required, Israeli format
  description: string;    // תיאור הפנייה - required, min 10 chars
}
```

### MinistryRoute
```typescript
interface MinistryRoute {
  id: number;
  name: string;           // Hebrew ministry name
  keywords: string[];     // Keywords for routing matching
}
```

### SubmissionResult
```typescript
interface SubmissionResult {
  referenceNumber: string;  // Unique identifier (UUID format)
  targetMinistry: string;   // Matched ministry name
  submittedAt: string;      // ISO timestamp
  status: 'success';
}
```

### Ministry Directory (Closed List - 13 Ministries)
```javascript
const MINISTRIES = [
  { id: 1,  name: "משרד הבריאות", keywords: ["בריאות", "רפואה", "חולה", "רופא", "בית חולים", "תרופה", "קופת חולים", "ביטוח בריאות"] },
  { id: 2,  name: "משרד הפנים", keywords: ["תעודת זהות", "דרכון", "רישום", "אזרחות", "תושבות", "עירייה", "רשות מקומית"] },
  { id: 3,  name: "נציבות שירות המדינה", keywords: ["משרה", "מכרז", "עובד מדינה", "פנסיה", "שירות המדינה", "מינוי"] },
  { id: 4,  name: "משרד המשפטים", keywords: ["חוק", "משפט", "עורך דין", "בית משפט", "תביעה", "זכויות", "רישום חברות"] },
  { id: 5,  name: "מערך הדיגיטל הלאומי", keywords: ["דיגיטל", "אתר", "מקוון", "טכנולוגיה", "מחשב", "אפליקציה", "ממשל זמין"] },
  { id: 6,  name: "משרד הכלכלה", keywords: ["עסק", "יבוא", "יצוא", "תעשייה", "מסחר", "רישיון עסק", "תעסוקה"] },
  { id: 7,  name: "משרד האוצר", keywords: ["תקציב", "מס", "כספים", "שכר", "פיננסי", "בנק"] },
  { id: 8,  name: "רשות המסים", keywords: ["מס הכנסה", "מע\"מ", "ארנונה", "החזר מס", "דוח שנתי", "ניכוי", "חשבונית"] },
  { id: 9,  name: "משרד ראש הממשלה", keywords: ["ממשלה", "ראש ממשלה", "מדיניות", "כללי"] },
  { id: 10, name: "משרד הבטחון", keywords: ["צבא", "בטחון", "מילואים", "נכה צה\"ל", "שירות ביטחון", "גיוס"] },
  { id: 11, name: "משרד העלייה והקליטה", keywords: ["עלייה", "קליטה", "עולה חדש", "סל קליטה", "הכרה בתארים", "אולפן"] },
  { id: 12, name: "רשות האכיפה והגביה", keywords: ["הוצאה לפועל", "חוב", "גבייה", "עיקול", "פשיטת רגל", "תיק הוצל\"פ"] },
  { id: 13, name: "משרד התיירות", keywords: ["תיירות", "מלון", "אטרקציה", "מדריך תיירים", "רישיון תיירות"] }
];
```

## File Structure
```
project-root/
├── index.html              # Main SPA entry point
├── css/
│   └── styles.css          # IGDS-compliant styles
├── js/
│   └── app.js              # Application logic
├── images/
│   └── header/
│       └── nimbus_logo.png # Nimbus government logo
└── .kiro/
    ├── steering/
    │   ├── baseline-security-constitution.md
    │   └── frontend-constitution.md
    └── specs/
        └── public-inquiry-portal/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## Security Implementation (Per baseline-security-constitution.md)
- Input sanitization using DOMPurify-like encoding (custom implementation)
- No innerHTML usage with user content - textContent only
- Form cleared after successful submission
- Double-submit prevention via button disable
- No PII in localStorage/sessionStorage
- Error messages reveal no technical internals

## Accessibility Implementation (Per frontend-constitution.md)
- Full keyboard navigation (Tab order)
- ARIA labels on all form inputs
- role="alert" on error/success messages
- aria-required="true" on mandatory fields
- Skip navigation link
- Semantic HTML (header, main, footer, form, fieldset, legend)
- Color contrast meeting 4.5:1 ratio
- Focus indicators on all interactive elements
