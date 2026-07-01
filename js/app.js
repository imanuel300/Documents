/**
 * פורטל פניות הציבור האחוד
 * Application Logic - Core Web (Vanilla JS)
 * 
 * Implements:
 * - Form validation (REQ-002)
 * - Ministry routing (REQ-003)
 * - Submission confirmation (REQ-004)
 * - Security measures (REQ-009)
 */

'use strict';

// ============================================
// Ministry Directory - Closed List (13 Ministries)
// ============================================
const MINISTRIES = [
    {
        id: 1,
        name: "משרד הבריאות",
        keywords: ["בריאות", "רפואה", "חולה", "רופא", "בית חולים", "תרופה", "קופת חולים", "ביטוח בריאות", "מרפאה", "אשפוז", "חיסון", "טיפול רפואי"]
    },
    {
        id: 2,
        name: "משרד הפנים",
        keywords: ["תעודת זהות", "דרכון", "רישום", "אזרחות", "תושבות", "עירייה", "רשות מקומית", "ויזה", "כניסה לארץ", "רישום נישואין"]
    },
    {
        id: 3,
        name: "נציבות שירות המדינה",
        keywords: ["משרה", "מכרז", "עובד מדינה", "פנסיה", "שירות המדינה", "מינוי", "קידום", "שכר עובדי מדינה"]
    },
    {
        id: 4,
        name: "משרד המשפטים",
        keywords: ["חוק", "משפט", "עורך דין", "בית משפט", "תביעה", "זכויות", "רישום חברות", "אפוטרופוס", "ירושה", "צוואה"]
    },
    {
        id: 5,
        name: "מערך הדיגיטל הלאומי",
        keywords: ["דיגיטל", "אתר", "מקוון", "טכנולוגיה", "מחשב", "אפליקציה", "ממשל זמין", "שירות מקוון", "סייבר"]
    },
    {
        id: 6,
        name: "משרד הכלכלה",
        keywords: ["עסק", "יבוא", "יצוא", "תעשייה", "מסחר", "רישיון עסק", "תעסוקה", "יזמות", "סטארטאפ", "תחרות"]
    },
    {
        id: 7,
        name: "משרד האוצר",
        keywords: ["תקציב", "מס", "כספים", "שכר", "פיננסי", "בנק", "מטבע", "הלוואה", "משכנתא"]
    },
    {
        id: 8,
        name: "רשות המסים",
        keywords: ["מס הכנסה", "מע\"מ", "ארנונה", "החזר מס", "דוח שנתי", "ניכוי", "חשבונית", "תיק מס", "שומה", "ניהול ספרים"]
    },
    {
        id: 9,
        name: "משרד ראש הממשלה",
        keywords: ["ממשלה", "ראש ממשלה", "מדיניות", "כללי", "לאומי", "ביטחון לאומי"]
    },
    {
        id: 10,
        name: "משרד הבטחון",
        keywords: ["צבא", "בטחון", "מילואים", "נכה צה\"ל", "שירות ביטחון", "גיוס", "צה\"ל", "חייל", "משוחרר"]
    },
    {
        id: 11,
        name: "משרד העלייה והקליטה",
        keywords: ["עלייה", "קליטה", "עולה חדש", "סל קליטה", "הכרה בתארים", "אולפן", "הגירה", "תושב חוזר"]
    },
    {
        id: 12,
        name: "רשות האכיפה והגביה",
        keywords: ["הוצאה לפועל", "חוב", "גבייה", "עיקול", "פשיטת רגל", "תיק הוצל\"פ", "צו תשלום", "איחוד תיקים"]
    },
    {
        id: 13,
        name: "משרד התיירות",
        keywords: ["תיירות", "מלון", "אטרקציה", "מדריך תיירים", "רישיון תיירות", "נופש", "טיול", "אירוח"]
    }
];

// ============================================
// Utility Functions
// ============================================

/**
 * Sanitize user input to prevent XSS attacks
 * Uses textContent approach - no innerHTML with user data
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Generate a UUID-based reference number
 */
function generateReferenceNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `GOV-${timestamp}-${random}`.toUpperCase();
}

/**
 * Format current date and time in Hebrew locale
 */
function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// Validation Functions
// ============================================

/**
 * Validate email format (RFC 5322 simplified)
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

/**
 * Validate Israeli phone format
 * Accepts: 05X-XXXXXXX, 0X-XXXXXXX, 05XXXXXXXX, 0XXXXXXXXX
 */
function isValidPhone(phone) {
    const phoneRegex = /^0(5[0-9]|[2-4]|[7-9])-?\d{7}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate all form fields and return errors object
 */
function validateForm(formData) {
    const errors = {};

    // First name validation
    if (!formData.firstName.trim()) {
        errors.firstName = 'שדה שם פרטי הוא שדה חובה';
    } else if (formData.firstName.trim().length < 2) {
        errors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
        errors.lastName = 'שדה שם משפחה הוא שדה חובה';
    } else if (formData.lastName.trim().length < 2) {
        errors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
    }

    // Email validation
    if (!formData.email.trim()) {
        errors.email = 'שדה אימייל הוא שדה חובה';
    } else if (!isValidEmail(formData.email.trim())) {
        errors.email = 'נא להזין כתובת אימייל תקינה';
    }

    // Phone validation
    if (!formData.phone.trim()) {
        errors.phone = 'שדה טלפון הוא שדה חובה';
    } else if (!isValidPhone(formData.phone.trim())) {
        errors.phone = 'נא להזין מספר טלפון ישראלי תקין (לדוגמה: 050-1234567)';
    }

    // Description validation
    if (!formData.description.trim()) {
        errors.description = 'שדה תיאור הפנייה הוא שדה חובה';
    } else if (formData.description.trim().length < 10) {
        errors.description = 'תיאור הפנייה חייב להכיל לפחות 10 תווים';
    }

    return errors;
}

// ============================================
// Ministry Routing Logic
// ============================================

/**
 * Route inquiry to the most relevant ministry based on keyword matching
 * Falls back to "משרד ראש הממשלה" if no match found
 */
function routeToMinistry(description) {
    const normalizedText = description.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const ministry of MINISTRIES) {
        let score = 0;
        for (const keyword of ministry.keywords) {
            if (normalizedText.includes(keyword)) {
                score++;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestMatch = ministry;
        }
    }

    // Default to משרד ראש הממשלה if no keyword match
    if (!bestMatch || highestScore === 0) {
        bestMatch = MINISTRIES.find(m => m.id === 9); // משרד ראש הממשלה
    }

    return bestMatch.name;
}

// ============================================
// UI Functions
// ============================================

/**
 * Display error messages next to form fields
 */
function showErrors(errors) {
    // Clear all previous errors first
    clearErrors();

    for (const [field, message] of Object.entries(errors)) {
        const errorElement = document.getElementById(`${field}-error`);
        const inputElement = document.getElementById(field);

        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.classList.add('input-error');
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', `${field}-error`);
        }
    }
}

/**
 * Clear all error messages and states
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });

    const inputElements = document.querySelectorAll('.form-input');
    inputElements.forEach(el => {
        el.classList.remove('input-error');
        el.removeAttribute('aria-invalid');
    });
}

/**
 * Show the confirmation view and hide the form
 */
function showConfirmation(ministry, referenceNumber, timestamp) {
    const formView = document.getElementById('form-view');
    const confirmationView = document.getElementById('confirmation-view');

    // Set confirmation details using textContent (XSS safe)
    document.getElementById('target-ministry').textContent = ministry;
    document.getElementById('reference-number').textContent = referenceNumber;
    document.getElementById('submission-time').textContent = timestamp;

    // Toggle views
    formView.classList.add('hidden');
    confirmationView.classList.remove('hidden');

    // Focus on confirmation heading for screen readers
    document.getElementById('confirmation-heading').focus();
}

/**
 * Reset form and show the form view again
 */
function resetForm() {
    const formView = document.getElementById('form-view');
    const confirmationView = document.getElementById('confirmation-view');
    const form = document.getElementById('inquiry-form');
    const submitBtn = document.getElementById('submit-btn');

    // Reset form fields
    form.reset();
    clearErrors();

    // Re-enable submit button
    submitBtn.disabled = false;

    // Toggle views
    confirmationView.classList.add('hidden');
    formView.classList.remove('hidden');

    // Focus on first field
    document.getElementById('firstName').focus();
}

// ============================================
// Event Handlers
// ============================================

/**
 * Handle form submission
 */
function handleSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submit-btn');

    // Double-submit prevention
    if (submitBtn.disabled) {
        return;
    }

    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        description: document.getElementById('description').value
    };

    // Validate
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        // Focus on first error field for accessibility
        const firstErrorField = Object.keys(errors)[0];
        document.getElementById(firstErrorField).focus();
        return;
    }

    // Disable submit button to prevent double submission
    submitBtn.disabled = true;

    // Sanitize description for routing
    const sanitizedDescription = sanitizeInput(formData.description);

    // Route to ministry
    const targetMinistry = routeToMinistry(formData.description);

    // Generate reference and timestamp
    const referenceNumber = generateReferenceNumber();
    const timestamp = formatTimestamp();

    // Clear form data from memory (PII protection)
    document.getElementById('inquiry-form').reset();

    // Show confirmation
    showConfirmation(targetMinistry, referenceNumber, timestamp);
}

/**
 * Clear error when user starts typing in a field
 */
function handleInputFocus(event) {
    const field = event.target;
    const errorElement = document.getElementById(`${field.id}-error`);

    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inquiry-form');

    // Form submit handler
    form.addEventListener('submit', handleSubmit);

    // Clear errors on input focus
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
    });
});
