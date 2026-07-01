# פורטל פניות הציבור האחוד 🏛️

> נקודת מגע דיגיטלית אחודה, נגישה ומבוססת בינה מלאכותית, המאפשרת לאזרח להגיש פנייה לממשלה בשפה חופשית מבלי שעליו לדעת מראש איזה משרד ממשלתי אמון על הטיפול בה.

## 📋 אודות הפרויקט

פרויקט זה נבנה במסגרת **סדנת Spec-to-Design** של AWS Kiro Lab, בשיתוף עם תוכנית "ממשלה בקליק".

הפרויקט מדגים תהליך פיתוח מלא בגישת **SDD (Spec-Driven Development)** — פיתוח מונחה מפרט — שבו כל שלב מתועד, מאושר ונבדק לפני שהקוד נכתב.

## 🚀 הרצה מהירה

```bash
cd kiro-starting-project-main
python3 -m http.server 8000
```

פתחו בדפדפן: **http://localhost:8000**

> אין צורך בהתקנות, dependencies או build steps — הפרויקט בנוי ב-Core Web (Vanilla HTML/CSS/JS).

## 🏗️ מבנה הפרויקט

```
kiro-starting-project-main/
├── index.html                              # אפליקציית SPA ראשית
├── css/
│   └── styles.css                          # עיצוב ממשלתי IGDS
├── js/
│   └── app.js                              # לוגיקת אפליקציה (ולידציה + ניתוב)
├── images/
│   └── header/
│       └── nimbus_logo.png                 # לוגו נימבוס ממשלתי
├── README.md                               # קובץ זה
└── .kiro/
    ├── steering/                           # חוקות הפרויקט
    │   ├── baseline-security-constitution.md   # חוקת אבטחת מידע
    │   └── frontend-constitution.md            # חוקת עיצוב IGDS
    └── specs/
        └── public-inquiry-portal/          # מפרטי המערכת
            ├── requirements.md             # 10 דרישות בפורמט EARS
            ├── design.md                   # תכנון ארכיטקטוני
            └── tasks.md                    # משימות יישום
```

## 🎯 יכולות המערכת

| יכולת | תיאור |
|--------|--------|
| טופס פנייה | שדות: שם פרטי, שם משפחה, אימייל, טלפון, תיאור חופשי |
| ולידציה | בדיקת פורמט אימייל (RFC 5322), טלפון ישראלי, שדות חובה |
| ניתוב אוטומטי | סיווג הפנייה ל-13 משרדים ממשלתיים לפי מילות מפתח |
| דף אישור | מספר אסמכתא, שם המשרד המנתב, חותמת זמן |
| נגישות | WCAG 2.1 Level AA מלא |
| אבטחה | מניעת XSS, ולידציית קלט, מניעת שליחה כפולה |
| RTL | תמיכה מלאה בעברית וכיווניות ימין-לשמאל |

## 🏢 רשימת משרדים ממשלתיים (13)

המערכת מנתבת פניות ל-13 המשרדים הבאים בלבד (רשימה סגורה):

1. משרד הבריאות
2. משרד הפנים
3. נציבות שירות המדינה
4. משרד המשפטים
5. מערך הדיגיטל הלאומי
6. משרד הכלכלה
7. משרד האוצר
8. רשות המסים
9. משרד ראש הממשלה (ברירת מחדל)
10. משרד הבטחון
11. משרד העלייה והקליטה
12. רשות האכיפה והגביה
13. משרד התיירות

## 🔒 עקרונות אבטחת מידע שיושמו

בהתאם לחוקת `baseline-security-constitution.md`:

### 1. הגנה על קלט המשתמש (Input Validation)
- ולידציית אימייל לפי RFC 5322
- ולידציית טלפון בפורמט ישראלי (05X-XXXXXXX / 0X-XXXXXXX)
- בדיקת שדות חובה ואורך מינימלי
- sanitization על תוכן חופשי

### 2. הגנה מפני XSS (Cross-Site Scripting)
- פונקציית `sanitizeInput()` — קידוד HTML דרך `textContent`
- אין שימוש ב-`innerHTML` עם נתוני משתמש
- כל הצגה דינמית דרך `textContent` בלבד

### 3. אבטחת מידע אישי (PII Protection)
- ניקוי הטופס (`form.reset()`) מיד לאחר שליחה מוצלחת
- אין שמירה ב-localStorage או sessionStorage
- אין העברת PII ב-URL parameters

### 4. מניעת שליחה כפולה (CSRF/Double-Submit)
- כפתור שליחה הופך ל-disabled מיד עם לחיצה
- בדיקת guard clause בתחילת handler

### 5. ניהול שגיאות מאובטח
- הודעות שגיאה ידידותיות בעברית בלבד
- אין חשיפת מידע טכני למשתמש הקצה

## 🎨 רכיבי עיצוב ממשלתי (IGDS)

בהתאם לחוקת `frontend-constitution.md`:

### פלטת צבעים
| שם | ערך | שימוש |
|----|------|-------|
| Primary | `#003B71` | Header, Footer, כותרות |
| Secondary | `#0066CC` | כפתורים, קישורים, Focus |
| Success | `#008A00` | אייקון ואישור הצלחה |
| Error | `#D32F2F` | שגיאות ולידציה, שדות חובה |
| Warning | `#F57C00` | התראות |

### טיפוגרפיה
- **פונט:** Rubik (Google Fonts) — תומך עברית וערבית
- **גודל בסיס:** 16px
- **כותרת ראשית (H1):** 32px, weight 700
- **כותרת משנית (H2):** 24px, weight 700
- **Line Height:** 1.6

### מבנה רכיבים
- `igds-header` — Header ממשלתי עם לוגו נימבוס
- `igds-footer` — Footer עם זכויות יוצרים ממשלתי
- טופס עם labels, שדות חובה מסומנים ב-*, הודעות שגיאה מתחת לשדה
- כפתור שליחה בולט (min 48px × 200px)

### Responsive Breakpoints
- **Mobile:** עד 768px — layout מוערם, כפתור ברוחב מלא
- **Tablet:** 768px–1024px — כותרות מוקטנות
- **Desktop:** מעל 1024px — טופס מרוכז ב-720px

## ♿ נגישות (WCAG 2.1 Level AA)

| עיקרון | יישום |
|--------|-------|
| Skip Navigation | קישור "דלג לתוכן הראשי" בראש העמוד |
| Form Labels | כל שדה עם `<label for="...">` מקושר |
| ARIA Required | `aria-required="true"` על כל שדות חובה |
| Error Alerts | `role="alert"` + `aria-live="polite"` |
| Keyboard Navigation | Tab order תקין, Focus indicators ברורים |
| Semantic HTML | `header`, `main`, `footer`, `form`, `fieldset`, `legend` |
| Color Contrast | ניגודיות 4.5:1 מינימום |
| Touch Targets | כפתורים מעל 44×44px |
| Dynamic Content | `aria-live="polite"` על אזורים מתעדכנים |
| Alt Text | תמונות עם alt בעברית |

## 📐 ארכיטקטורה

### Technology Stack
| שכבה | בחירה | סיבה |
|------|--------|------|
| Framework | Vanilla HTML/CSS/JS | אב טיפוס ללא build step |
| UI | Custom IGDS | עמידה בתקן ממשלתי |
| Backend | ללא | אב טיפוס client-side בלבד |
| Database | ללא | אין צורך ב-persistence |
| Server | Python3 http.server | ללא dependencies |

### Application Flow
```
[Page Load] → [Form Display] → [User Input] → [Validation]
                                                    │
                                         ┌──────────┴──────────┐
                                         │                     │
                                    [Errors]              [Valid]
                                         │                     │
                                    [Show Inline         [Route to
                                     Messages]            Ministry]
                                                              │
                                                    [Show Confirmation]
                                                    - Target Ministry
                                                    - Reference Number
                                                    - Timestamp
```

### Ministry Routing Algorithm
1. מקבל את הטקסט החופשי מהמשתמש
2. מבצע keyword matching מול מילוני מילות מפתח לכל משרד
3. סוכם ניקוד (כמות התאמות) לכל משרד
4. מחזיר את המשרד עם הניקוד הגבוה ביותר
5. אם אין התאמה — ברירת מחדל: "משרד ראש הממשלה"

## 📝 מפרטי המערכת (Specs)

### Requirements (10 דרישות)
| מזהה | שם | סוג |
|------|-----|------|
| REQ-001 | Inquiry Form Display | Functional |
| REQ-002 | Input Validation | Functional |
| REQ-003 | Automatic Ministry Routing | Functional |
| REQ-004 | Submission Confirmation | Functional |
| REQ-005 | SPA Architecture | Non-Functional |
| REQ-006 | Accessibility Compliance | Non-Functional |
| REQ-007 | RTL and Hebrew Support | Non-Functional |
| REQ-008 | IGDS Compliance | Non-Functional |
| REQ-009 | Security Compliance | Non-Functional |
| REQ-010 | Local Development Server | Operational |

### Tasks (6 משימות — כולן הושלמו ✅)
1. ✅ Create HTML Structure
2. ✅ Implement IGDS Styles
3. ✅ Implement Form Validation
4. ✅ Implement Ministry Routing Logic
5. ✅ Implement Submission and Confirmation Flow
6. ✅ Setup Local Development Server

## 🧪 בדיקה ידנית

1. פתחו את האפליקציה ב-http://localhost:8000
2. נסו לשלוח טופס ריק — תופיעינה הודעות שגיאה בעברית
3. הזינו אימייל לא תקין (למשל "abc") — שגיאת פורמט
4. הזינו מספר טלפון לא ישראלי — שגיאת פורמט
5. מלאו את כל השדות תקין עם תיאור כמו "אני צריך לחדש דרכון" — המערכת תנתב למשרד הפנים
6. וודאו שדף האישור מציג: שם המשרד, מספר אסמכתא, תאריך ושעה
7. לחצו "הגשת פנייה נוספת" — הטופס יתאפס

## 📜 מתודולוגיית SDD (Spec-Driven Development)

הפרויקט נבנה בגישת **Spec as Code** — כל שלב פיתוח מתחיל ביצירת מפרט מדויק ומאושר:

1. **חוקות (Constitutions)** — עקרונות מחייבים שכל קוד חייב לעמוד בהם
2. **דרישות (Requirements)** — מה המערכת צריכה לעשות (פורמט EARS)
3. **תכנון (Design)** — איך המערכת בנויה טכנית
4. **משימות (Tasks)** — פירוט ביצוע עם מעקב סטטוס
5. **קוד (Implementation)** — גזירת קוד מהמפרטים

> "אם הקוד אינו תואם ב-100% למפרט — הוא נדחה."

---

**© 2026 פורטל פניות הציבור האחוד — מדינת ישראל | סדנת AWS Kiro Lab**
