// הקוד שמציג את נתוני ההדגמה מ-data.js, לפי SPEC.md.

const ALL_DEPARTMENTS = "כל המחלקות";
const DAY_MS = 24 * 60 * 60 * 1000;

// צבעי גרף העוגה, לפי SPEC.md, סעיף 7
const DONUT_COLORS = ["#14213D", "#E8590C", "#FFC24B", "#4A5568", "#DDE1E8"];

// היום, בחצות, כדי שהחישובים יהיו לפי ימים שלמים
const NOW = new Date();
const TODAY = new Date(NOW);
TODAY.setHours(0, 0, 0, 0);

// ---- פונקציות עזר ----
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

function daysFromToday(date) {
  return Math.round((date - TODAY) / DAY_MS);
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

function percent(part, whole) {
  return Math.round((part / whole) * 100);
}

function initials(name) {
  const words = name.split(" ");
  return words[0][0] + words[words.length - 1][0];
}

// "היום", "מחר" או "בעוד X ימים" (SPEC.md, סעיף 5)
function inDaysText(days) {
  if (days === 0) return "היום";
  if (days === 1) return "מחר";
  return `בעוד ${days} ימים`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function pill(text, kind) {
  return el("span", `pill ${kind}`, text);
}

// עובד: ראשי תיבות, שם ותפקיד
function personBlock(name, role) {
  const wrap = el("div", "person");
  const avatar = el("span", "avatar", initials(name));
  avatar.setAttribute("aria-hidden", "true");
  const text = el("div");
  text.append(el("span", "person-name", name), el("span", "person-role", role));
  wrap.append(avatar, text);
  return wrap;
}

// יוצר שורת טבלה. כל תא מקבל data-label, כדי שבטלפון יוצג ככרטיס עם כותרות.
// תוכן התא יכול להיות טקסט או אלמנט.
function buildRow(cells) {
  const tr = document.createElement("tr");
  cells.forEach(({ label, value, className }) => {
    const td = document.createElement("td");
    td.dataset.label = label;
    if (className) td.className = className;
    if (value instanceof Node) td.appendChild(value);
    else td.textContent = value;
    tr.appendChild(td);
  });
  return tr;
}

function fillDepartmentSelect(select) {
  [ALL_DEPARTMENTS, ...HR_DATA.departments].forEach((department) => {
    const option = el("option", "", department);
    option.value = department;
    select.appendChild(option);
  });
}

function showEmptyState(tbody, emptyNode, hasRows, message) {
  tbody.closest("table").hidden = !hasRows;
  emptyNode.hidden = hasRows;
  emptyNode.textContent = message;
}

// ---- הנתונים, עם תאריכים אמיתיים לפי היום שבו פתחו את הדף ----
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
const sixMonthsFromToday = addMonths(TODAY, 6);
const twelveMonthsFromToday = addMonths(TODAY, 12);
const retirements = HR_DATA.retirements
  .map((employee) => {
    const retireDate = addDays(TODAY, employee.retiresInDays);
    return { ...employee, retireDate, withinSixMonths: retireDate <= sixMonthsFromToday };
  })
  .sort((a, b) => a.retireDate - b.retireDate);

// ---- ראש התוכן ----
function renderHeader() {
  const hour = NOW.getHours();
  let greeting = "ערב טוב";
  if (hour >= 5 && hour < 12) greeting = "בוקר טוב";
  else if (hour >= 12 && hour < 17) greeting = "צהריים טובים";
  document.getElementById("greeting").textContent = greeting;

  const weekday = TODAY.toLocaleDateString("he-IL", { weekday: "long" });
  document.getElementById("today").textContent = `${weekday}, ${formatDate(TODAY)}`;
}

// ---- 4 המספרים ושורות ההסבר (SPEC.md, סעיף 6) ----
function renderKpis() {
  const working = onboarding.filter((employee) => daysFromToday(employee.startDate) < 0).length;
  const upcoming = onboarding.length - working;
  const retiringSoon = retirements.filter((employee) => employee.withinSixMonths).length;
  const retiringYear = retirements.filter((employee) => employee.retireDate <= twelveMonthsFromToday).length;

  const set = (id, text) => { document.getElementById(id).textContent = text; };
  set("kpi-onboarding", onboarding.length);
  set("kpi-onboarding-note", `${working} כבר בעבודה, ${upcoming} עוד יתחילו`);
  set("kpi-published", publishedAds.length);
  set("kpi-published-note", `עוד ${plannedAds.length} מודעות מתוכננות`);
  set("kpi-invited", sum(publishedAds, "invited"));
  set("kpi-invited-note", `${sum(publishedAds, "passed")} עברו את הראיון`);
  set("kpi-retiring", retiringSoon);
  set("kpi-retiring-note", `${retiringYear} ב-12 החודשים הקרובים`);
}

// ---- קליטת עובדים ----
const onboardingDepartment = document.getElementById("onboarding-department");
const onboardingSearch = document.getElementById("onboarding-search");

function onboardingStatus(startDate) {
  const days = daysFromToday(startDate);
  if (days < 0) return pill("בעבודה", "working");
  return pill(inDaysText(days), "upcoming");
}

function renderOnboarding() {
  const department = onboardingDepartment.value;
  const search = onboardingSearch.value.trim();

  const rows = onboarding.filter((employee) =>
    (department === ALL_DEPARTMENTS || employee.department === department) &&
    employee.name.includes(search)
  );

  const tbody = document.getElementById("onboarding-rows");
  tbody.replaceChildren(...rows.map((employee) => buildRow([
    { label: "עובד", value: personBlock(employee.name, employee.role), className: "person-cell" },
    { label: "מחלקה", value: employee.department },
    { label: "תאריך קליטה", value: formatDate(employee.startDate), className: "num" },
    { label: "מנהל ישיר", value: employee.manager },
    { label: "סטטוס", value: onboardingStatus(employee.startDate) }
  ])));

  showEmptyState(
    tbody,
    document.getElementById("onboarding-empty"),
    rows.length > 0,
    search ? "לא נמצאו עובדים בקליטה בשם הזה" : "אין עובדים בקליטה במחלקה זו"
  );
}

// גרף עוגה: עובדים בקליטה לפי מחלקה. מחלקה בלי עובדים לא מוצגת.
function renderDonut() {
  const groups = HR_DATA.departments
    .map((department) => ({
      department,
      count: onboarding.filter((employee) => employee.department === department).length
    }))
    .filter((group) => group.count > 0);

  const total = onboarding.length;
  const radius = 76;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;
  const svg = document.getElementById("donut");
  const ns = "http://www.w3.org/2000/svg";
  svg.replaceChildren();

  let offset = 0;
  groups.forEach((group, index) => {
    const length = (group.count / total) * circumference;
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", "100");
    circle.setAttribute("cy", "100");
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", DONUT_COLORS[index]);
    circle.setAttribute("stroke-width", "26");
    circle.setAttribute("stroke-dasharray", `${length - gap} ${circumference - length + gap}`);
    circle.setAttribute("stroke-dashoffset", -offset);
    circle.setAttribute("transform", "rotate(-90 100 100)");
    svg.appendChild(circle);
    offset += length;
  });

  const center = document.getElementById("donut-label");
  center.replaceChildren(el("strong", "", total), el("span", "", "עובדים בקליטה"));

  document.getElementById("donut-legend").replaceChildren(...groups.map((group, index) => {
    const li = el("li");
    const dot = el("span", "dot");
    dot.style.background = DONUT_COLORS[index];
    li.append(
      dot,
      el("span", "", group.department),
      el("span", "count", group.count),
      el("span", "share", `${percent(group.count, total)}%`)
    );
    return li;
  }));
}

// ---- גיוס ----
function renderFunnel() {
  const applications = sum(publishedAds, "applications");
  const invited = sum(publishedAds, "invited");
  const passed = sum(publishedAds, "passed");

  const steps = [
    { label: "פניות", value: applications, className: "applications", rate: null },
    { label: "הוזמנו לראיון", value: invited, className: "invited", rate: `${percent(invited, applications)}% מהפניות` },
    { label: "עברו את הראיון", value: passed, className: "passed", rate: `${percent(passed, invited)}% מהמוזמנים` }
  ];

  document.getElementById("funnel").replaceChildren(...steps.map((step) => {
    const row = el("div", "funnel-row");

    const label = el("div", "funnel-label");
    label.append(el("strong", "funnel-value", step.value), el("span", "", step.label));

    const track = el("div", "funnel-track");
    const shape = el("div", `funnel-shape ${step.className}`);
    shape.setAttribute("aria-hidden", "true");
    track.appendChild(shape);

    const rate = el("div", "funnel-rate");
    if (step.rate) rate.appendChild(pill(step.rate, "upcoming"));

    row.append(label, track, rate);
    return row;
  }));
}

function renderPlannedAds() {
  document.getElementById("planned-list").replaceChildren(...plannedAds.map((ad) => {
    const li = el("li");

    const tile = el("span", "icon-tile");
    tile.innerHTML = '<svg class="icon"><use href="#i-briefcase"/></svg>';

    const info = el("div", "planned-info");
    info.append(el("span", "person-name", ad.role), el("span", "person-role", ad.department));

    const meta = el("div", "planned-meta");
    meta.append(el("span", "planned-date", formatDate(ad.date)), pill(inDaysText(daysFromToday(ad.date)), "upcoming"));

    li.append(tile, info, meta);
    return li;
  }));
}

function renderPublishedAds() {
  document.getElementById("published-rows").replaceChildren(...publishedAds.map((ad) => buildRow([
    { label: "תפקיד", value: ad.role },
    { label: "מחלקה", value: ad.department },
    { label: "תאריך פרסום", value: formatDate(ad.date), className: "num" },
    { label: "פניות", value: ad.applications, className: "num" },
    { label: "הוזמנו לראיון", value: ad.invited, className: "num" },
    { label: "עברו את הראיון", value: ad.passed, className: "num" }
  ])));
}

// ---- יציאה לפנסיה ----
const retirementDepartment = document.getElementById("retirement-department");

function retirementDateCell(employee) {
  const cell = el("div", "date-cell");
  cell.appendChild(el("span", "num", formatDate(employee.retireDate)));
  if (employee.withinSixMonths) cell.appendChild(pill("בתוך 6 חודשים", "soon"));
  return cell;
}

function renderRetirements() {
  const department = retirementDepartment.value;
  const rows = retirements.filter((employee) =>
    department === ALL_DEPARTMENTS || employee.department === department
  );

  const tbody = document.getElementById("retirement-rows");
  tbody.replaceChildren(...rows.map((employee) => buildRow([
    { label: "עובד", value: personBlock(employee.name, employee.role), className: "person-cell" },
    { label: "מחלקה", value: employee.department },
    { label: "תאריך פרישה", value: retirementDateCell(employee) },
    { label: "שנות ותק", value: employee.seniorityYears, className: "num" }
  ])));

  showEmptyState(
    tbody,
    document.getElementById("retirement-empty"),
    rows.length > 0,
    "אין עובדים שיוצאים לפנסיה במחלקה זו"
  );
}

// ---- הדגשת הקישור של החלק שמוצג כרגע ----
function watchSections() {
  const links = [...document.querySelectorAll(".nav-link")];
  const setActive = (id) => links.forEach((link) =>
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`)
  );

  const sections = [...document.querySelectorAll("main .section")];

  // החלק המודגש הוא האחרון שהכותרת שלו כבר הגיעה לראש המסך.
  // בתחתית הדף מודגש החלק האחרון, גם אם הוא קצר.
  const TOP_OFFSET = 140; // מתחת לפס העליון בטלפון
  function update() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= TOP_OFFSET) current = section;
    });
    setActive(atBottom ? sections[sections.length - 1].id : current.id);
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// ---- הפעלה ----
fillDepartmentSelect(onboardingDepartment);
fillDepartmentSelect(retirementDepartment);
onboardingDepartment.addEventListener("change", renderOnboarding);
onboardingSearch.addEventListener("input", renderOnboarding);
retirementDepartment.addEventListener("change", renderRetirements);

renderHeader();
renderKpis();
renderOnboarding();
renderDonut();
renderFunnel();
renderPlannedAds();
renderPublishedAds();
renderRetirements();
watchSections();
