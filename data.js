// נתוני הדגמה בלבד. כל השמות והמספרים מומצאים.
// התאריכים נשמרים כמרחק בימים מהיום שבו פותחים את הדף, כדי שלא יתיישנו.
// startInDays / plannedInDays / retiresInDays: מספר חיובי = בעתיד, שלילי = בעבר.

const HR_DATA = {
  departments: ["תביעות", "חיתום", "מכירות", "שירות לקוחות", "כספים", "מערכות מידע"],

  // עובדים בקליטה. במחלקת כספים אין עובדים בקליטה (לפי SPEC.md, סעיף 6).
  onboarding: [
    { name: "נועה כהן", role: "מסלקת תביעות", department: "תביעות", startInDays: -28, manager: "רחל בן דוד" },
    { name: "איתי לוי", role: "חתם ביטוח רכב", department: "חיתום", startInDays: -21, manager: "משה קליין" },
    { name: "מאיה פרץ", role: "סוכנת מכירות", department: "מכירות", startInDays: -14, manager: "אורית שלום" },
    { name: "יונתן מזרחי", role: "נציג שירות לקוחות", department: "שירות לקוחות", startInDays: -9, manager: "גיל רוזן" },
    { name: "שירה אברהם", role: "מפתחת Full Stack", department: "מערכות מידע", startInDays: -5, manager: "נטע ברק" },
    { name: "עומר ביטון", role: "מסלק תביעות", department: "תביעות", startInDays: -2, manager: "רחל בן דוד" },
    { name: "תמר שפירא", role: "חתמת ביטוח דירה", department: "חיתום", startInDays: 0, manager: "משה קליין" },
    { name: "אלון דהן", role: "סוכן מכירות", department: "מכירות", startInDays: 3, manager: "אורית שלום" },
    { name: "רוני גבאי", role: "נציגת שירות לקוחות", department: "שירות לקוחות", startInDays: 7, manager: "גיל רוזן" },
    { name: "ליאור עזרא", role: "אנליסט מערכות", department: "מערכות מידע", startInDays: 12, manager: "נטע ברק" },
    { name: "הדס נחום", role: "שמאית רכב", department: "תביעות", startInDays: 19, manager: "רחל בן דוד" },
    { name: "דניאל אוחיון", role: "מנהל לקוחות", department: "מכירות", startInDays: 26, manager: "אורית שלום" }
  ],

  // מודעות שמתוכננות להתפרסם ב-AllJobs. אין להן עדיין פניות.
  plannedAds: [
    { role: "ראש צוות תביעות", department: "תביעות", plannedInDays: 5 },
    { role: "מנהל/ת לקוחות עסקיים", department: "מכירות", plannedInDays: 12 },
    { role: "אחראי/ת אבטחת מידע", department: "מערכות מידע", plannedInDays: 18 },
    { role: "חשב/ת שכר", department: "כספים", plannedInDays: 26 }
  ],

  // מודעות שפורסמו ב-AllJobs. בכל מודעה: invited <= applications, passed <= invited.
  publishedAds: [
    { role: "אנליסט/ית כספים", department: "כספים", publishedInDays: -30, applications: 27, invited: 6, passed: 2 },
    { role: "מסלק/ת תביעות", department: "תביעות", publishedInDays: -25, applications: 41, invited: 9, passed: 5 },
    { role: "חתם/ת ביטוח רכב", department: "חיתום", publishedInDays: -20, applications: 34, invited: 8, passed: 3 },
    { role: "מפתח/ת Full Stack", department: "מערכות מידע", publishedInDays: -15, applications: 63, invited: 10, passed: 2 },
    { role: "נציג/ת שירות לקוחות", department: "שירות לקוחות", publishedInDays: -12, applications: 86, invited: 14, passed: 6 },
    { role: "סוכן/ת מכירות", department: "מכירות", publishedInDays: -7, applications: 58, invited: 11, passed: 4 }
  ],

  // עובדים שיוצאים לפנסיה. 5 בתוך 6 חודשים, ו-3 מאוחר יותר (עד 12 חודשים).
  retirements: [
    { name: "מרים ויס", role: "מנהלת אזור", department: "מכירות", retiresInDays: 200, seniorityYears: 27 },
    { name: "יעקב לוין", role: "מסלק תביעות בכיר", department: "תביעות", retiresInDays: 20, seniorityYears: 38 },
    { name: "זהבה כץ", role: "חתמת ביטוח חיים", department: "חיתום", retiresInDays: 330, seniorityYears: 30 },
    { name: "חנה גולן", role: "מנהלת חשבונות", department: "כספים", retiresInDays: 45, seniorityYears: 31 },
    { name: "דוד חזן", role: "מנהל תשתיות", department: "מערכות מידע", retiresInDays: 160, seniorityYears: 33 },
    { name: "שלמה אזולאי", role: "חתם בכיר", department: "חיתום", retiresInDays: 80, seniorityYears: 35 },
    { name: "אברהם סעדה", role: "שמאי", department: "תביעות", retiresInDays: 260, seniorityYears: 36 },
    { name: "רבקה שטרן", role: "ראש צוות שירות", department: "שירות לקוחות", retiresInDays: 120, seniorityYears: 29 }
  ]
};
