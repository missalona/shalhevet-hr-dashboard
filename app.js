// הקוד שמציג את נתוני ההדגמה מ-data.js, לפי SPEC.md.

const ALL_DEPARTMENTS = "כל המחלקות";

// היום, בחצות, כדי שהחישובים יהיו לפי ימים שלמים
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// תבנית יום/חודש/שנה (SPEC.md, סעיף 7)
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function sum(items, field) {
  return items.reduce((total, item) => total + item[field], 0);
}

// יוצר שורת טבלה. כל תא מקבל data-label, כדי שבטלפון יוצג ככרטיס עם כותרות.
function buildRow(cells) {
  const tr = document.createElement("tr");
  cells.forEach(([label, value, isNumber]) => {
    const td = document.createElement("td");
    td.dataset.label = label;
    td.textContent = value;
    if (isNumber) td.className = "num";
    tr.appendChild(td);
  });
  return tr;
}

function fillDepartmentSelect(select) {
  [ALL_DEPARTMENTS, ...HR_DATA.departments].forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.textContent = department;
    select.appendChild(option);
  });
}

// ממירים את המרחקים בימים לתאריכים אמיתיים, לפי היום שבו פתחו את הדף
const onboarding = HR_DATA.onboarding
  .map((employee) => ({ ...employee, startDate: addDays(TODAY, employee.startInDays) }))
  .sort((a, b) => a.startDate - b.startDate);

const publishedAds = HR_DATA.publishedAds
  .map((ad) => ({ ...ad, date: addDays(TODAY, ad.publishedInDays) }))
  .sort((a, b) => a.date - b.date);

const plannedAds = HR_DATA.plannedAds
  .map((ad) => ({ ...ad, date: addDays(TODAY, ad.plannedInDays) }))
  .sort((a, b) => a.date - b.date);

// הרשימה ממוינת מתאריך הפרישה הקרוב לרחוק (SPEC.md, סעיף 4)
const retirements = HR_DATA.retirements
  .map((employee) => ({ ...employee, retireDate: addDays(TODAY, employee.retiresInDays) }))
  .sort((a, b) => a.retireDate - b.retireDate);

// ---- ראש המסך ----
function renderHeaderAndKpis() {
  document.getElementById("today").textContent = formatDate(TODAY);

  const sixMonthsFromToday = addMonths(TODAY, 6);
  const retiringSoon = retirements.filter((employee) => employee.retireDate <= sixMonthsFromToday);

  document.getElementById("kpi-onboarding").textContent = onboarding.length;
  document.getElementById("kpi-published").textContent = publishedAds.length;
  document.getElementById("kpi-invited").textContent = sum(publishedAds, "invited");
  document.getElementById("kpi-retiring").textContent = retiringSoon.length;
}

// ---- קליטת עובדים ----
const onboardingDepartment = document.getElementById("onboarding-department");
const onboardingSearch = document.getElementById("onboarding-search");

function renderOnboarding() {
  const department = onboardingDepartment.value;
  const search = onboardingSearch.value.trim();

  const rows = onboarding.filter((employee) =>
    (department === ALL_DEPARTMENTS || employee.department === department) &&
    employee.name.includes(search)
  );

  const tbody = document.getElementById("onboarding-rows");
  tbody.replaceChildren(...rows.map((employee) => buildRow([
    ["שם", employee.name],
    ["תפקיד", employee.role],
    ["מחלקה", employee.department],
    ["תאריך קליטה", formatDate(employee.startDate), true],
    ["מנהל ישיר", employee.manager]
  ])));

  const empty = document.getElementById("onboarding-empty");
  empty.hidden = rows.length > 0;
  empty.textContent = search
    ? "לא נמצאו עובדים בקליטה בשם הזה"
    : "אין עובדים בקליטה במחלקה זו";
  tbody.closest("table").hidden = rows.length === 0;
}

// ---- מודעות דרושים ----
function renderAds() {
  document.getElementById("published-rows").replaceChildren(...publishedAds.map((ad) => buildRow([
    ["תפקיד", ad.role],
    ["מחלקה", ad.department],
    ["תאריך פרסום", formatDate(ad.date), true],
    ["פניות", ad.applications, true],
    ["הוזמנו לראיון", ad.invited, true],
    ["עברו את הראיון", ad.passed, true]
  ])));

  // מודעה מתוכננת לא מציגה מספר פניות (SPEC.md, סעיף 8)
  document.getElementById("planned-rows").replaceChildren(...plannedAds.map((ad) => buildRow([
    ["תפקיד", ad.role],
    ["מחלקה", ad.department],
    ["תאריך פרסום מתוכנן", formatDate(ad.date), true]
  ])));
}

// גרף הגיוס: הסכומים של כל המודעות שפורסמו
function renderFunnel() {
  const steps = [
    { label: "פניות", value: sum(publishedAds, "applications"), className: "applications" },
    { label: "הוזמנו לראיון", value: sum(publishedAds, "invited"), className: "invited" },
    { label: "עברו את הראיון", value: sum(publishedAds, "passed"), className: "passed" }
  ];
  const max = steps[0].value;

  const funnel = document.getElementById("funnel");
  funnel.replaceChildren(...steps.map((step) => {
    const row = document.createElement("div");
    row.className = "funnel-row";
    row.setAttribute("role", "img");
    row.setAttribute("aria-label", `${step.label}: ${step.value}`);

    const label = document.createElement("span");
    label.className = "funnel-label";
    label.textContent = step.label;

    const track = document.createElement("div");
    track.className = "funnel-track";
    const bar = document.createElement("div");
    bar.className = `funnel-bar ${step.className}`;
    bar.style.width = `${Math.max((step.value / max) * 100, 2)}%`;
    track.appendChild(bar);

    const value = document.createElement("span");
    value.className = "funnel-value";
    value.textContent = step.value;

    row.append(label, track, value);
    return row;
  }));
}

// ---- יציאה לפנסיה ----
const retirementDepartment = document.getElementById("retirement-department");

function renderRetirements() {
  const department = retirementDepartment.value;
  const rows = retirements.filter((employee) =>
    department === ALL_DEPARTMENTS || employee.department === department
  );

  const tbody = document.getElementById("retirement-rows");
  tbody.replaceChildren(...rows.map((employee) => buildRow([
    ["שם", employee.name],
    ["תפקיד", employee.role],
    ["מחלקה", employee.department],
    ["תאריך פרישה", formatDate(employee.retireDate), true],
    ["שנות ותק", employee.seniorityYears, true]
  ])));

  const empty = document.getElementById("retirement-empty");
  empty.hidden = rows.length > 0;
  empty.textContent = "אין עובדים שיוצאים לפנסיה במחלקה זו";
  tbody.closest("table").hidden = rows.length === 0;
}

// ---- הפעלה ----
fillDepartmentSelect(onboardingDepartment);
fillDepartmentSelect(retirementDepartment);
onboardingDepartment.addEventListener("change", renderOnboarding);
onboardingSearch.addEventListener("input", renderOnboarding);
retirementDepartment.addEventListener("change", renderRetirements);

renderHeaderAndKpis();
renderOnboarding();
renderAds();
renderFunnel();
renderRetirements();
