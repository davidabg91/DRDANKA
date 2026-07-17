/**
 * Генериране на печатни (А4) версии на дневниците по самоконтрол.
 * Използва се от RegistersTab — печат на един дневник или на всички попълнени.
 */

import {
  RegisterDef,
  SAFETY_CULTURE_SURVEY,
  SAFETY_CULTURE_CHECKLIST,
  SURVEY_SCALE_LABELS,
  TRAINING_COVERED,
  TRAINING_EVAL_CRITERIA,
} from "@/data/storeRegisters";

export interface PrintFirmInfo {
  name: string;
  eik: string;
  address: string;
  manager: string;
  /** Нарисуван електронен подпис (PNG data URL) — вгражда се на местата за подпис. */
  signature?: string;
}

/** HTML за подпис: електронният подпис (ако има) над линия за подпис. */
function signatureImg(sig?: string): string {
  if (!sig) return `..............................`;
  return `<img src="${sig}" alt="подпис" style="height:34px;max-width:150px;object-fit:contain;display:inline-block;vertical-align:middle" />`;
}

export interface TempUnitData {
  type: "fridge" | "freezer";
  rows: Record<string, Record<string, string>>;
}

export interface RegisterDocData {
  entries?: Array<Record<string, any>>;
  rows?: Record<string, Record<string, string>>;
  units?: Record<string, TempUnitData>;
  updatedAt?: string;
}

const esc = (raw: any) =>
  String(raw ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const MONTHS_BG = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември",
];

export function monthLabelBg(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return `${MONTHS_BG[m - 1]} ${y} г.`;
}

function firmHeader(firm: PrintFirmInfo, periodLabel: string): string {
  return `
    <table class="head-tbl">
      <tr>
        <td><b>ОБЕКТ:</b> ${esc(firm.name || "................")}<br/>
            <b>АДРЕС:</b> ${esc(firm.address || "................")}</td>
        <td style="text-align:right"><b>ЕИК:</b> ${esc(firm.eik || "................")}<br/>
            <b>УПРАВИТЕЛ:</b> ${esc(firm.manager || "................")}</td>
      </tr>
    </table>
    <div class="period">${esc(periodLabel)}</div>`;
}

function signatureBlock(firm: PrintFirmInfo): string {
  const sig = signatureImg(firm.signature);
  return `
    <table class="sig-tbl">
      <tr>
        <td>Отговорно лице: ${esc(firm.manager || "..............................")}<br/><br/>Подпис: ${sig}</td>
        <td style="text-align:right">Управител: ${esc(firm.manager || "..............................")}<br/><br/>Подпис: ${sig}</td>
      </tr>
    </table>`;
}

function listBlock(title: string, items: string[]): string {
  return `
    <div class="info-block">
      <div class="info-title">${esc(title)}</div>
      <ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`;
}

function simpleTable(headers: string[], rowsHtml: string): string {
  return `
    <table class="data-tbl">
      <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;
}

/* ------------------------------------------------------------------ */

function buildRowsSection(def: RegisterDef, data: RegisterDocData): string {
  const cols = def.columns || [];
  const entries = data.entries || [];
  const headers = ["№", ...cols.map((c) => c.label)];
  const body =
    entries.length === 0
      ? `<tr><td colspan="${headers.length}" class="empty">Няма записани данни.</td></tr>`
      : entries
          .map(
            (e, i) =>
              `<tr><td class="c">${i + 1}</td>${cols
                .map((c) => `<td${c.type === "check" || c.narrow ? ' class="c"' : ""}>${esc(e[c.key])}</td>`)
                .join("")}</tr>`
          )
          .join("");
  return simpleTable(headers, body);
}

function buildGridSection(def: RegisterDef, data: RegisterDocData, rowKeys: string[], rowHeader: string): string {
  const cols = def.columns || [];
  const rows = data.rows || {};
  const headers = [rowHeader, ...cols.map((c) => c.label)];
  const body = rowKeys
    .map((rk) => {
      const r = rows[rk] || {};
      return `<tr><td class="c"><b>${esc(rk)}</b></td>${cols
        .map((c) => `<td${c.type === "check" ? ' class="c"' : ""}>${esc(r[c.key])}</td>`)
        .join("")}</tr>`;
    })
    .join("");
  return simpleTable(headers, body);
}

function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

function buildTempSection(data: RegisterDocData, month: string): string {
  const units = data.units || {};
  const names = Object.keys(units);
  if (names.length === 0) return `<p class="empty">Няма записани данни.</p>`;
  const days = daysInMonth(month);
  return names
    .map((name, idx) => {
      const u = units[name];
      const norm = u.type === "freezer" ? "Норма: ≤ −18°C" : "Норма: от 0 до +4°C";
      const body = Array.from({ length: days }, (_, i) => {
        const d = String(i + 1);
        const r = (u.rows || {})[d] || {};
        return `<tr><td class="c"><b>${d}</b></td><td class="c">${esc(r.t1h)}</td><td class="c">${esc(r.t1)}</td><td class="c">${esc(r.t2h)}</td><td class="c">${esc(r.t2)}</td><td>${esc(r.action)}</td><td class="c">${esc(r.result)}</td><td class="c">${esc(r.sign)}</td></tr>`;
      }).join("");
      return `
        ${idx > 0 ? '<div class="page-break"></div>' : ""}
        <h3 class="unit-title">Чек-лист за отчитане на температурата — ${esc(name)} <span class="norm">(${norm})</span></h3>
        <table class="data-tbl">
          <thead>
            <tr><th rowspan="2">Дата</th><th colspan="2">Измерване 1</th><th colspan="2">Измерване 2</th><th rowspan="2">Корективни мерки</th><th rowspan="2">Резултат</th><th rowspan="2">Подпис</th></tr>
            <tr><th>Час</th><th>Темп. °C</th><th>Час</th><th>Темп. °C</th></tr>
          </thead>
          <tbody>${body}</tbody>
        </table>`;
    })
    .join("");
}

function buildTrainingSection(data: RegisterDocData, firm: PrintFirmInfo): string {
  const entries = data.entries || [];
  if (entries.length === 0) return `<p class="empty">Няма записани обучения.</p>`;
  return entries
    .map((e, idx) => {
      const attendees: string[] = e.attendees || [];
      const attendeeRows = attendees
        .map((a, i) => `<tr><td class="c">${i + 1}</td><td>${esc(a)}</td><td></td><td></td></tr>`)
        .join("");
      return `
        ${idx > 0 ? '<div class="page-break"></div>' : ""}
        <h3 class="unit-title">ПРОТОКОЛ № ${esc(e.number || idx + 1)} ЗА ПРОВЕДЕНО ОБУЧЕНИЕ НА ПЕРСОНАЛА</h3>
        <p><b>Оператор:</b> ${esc(firm.name)} &nbsp;&nbsp; <b>Обект:</b> ${esc(firm.address)}</p>
        <p><b>Дата:</b> ${esc(e.date)} &nbsp;&nbsp; <b>Място на провеждане:</b> ${esc(e.place)}</p>
        <p><b>Тема на обучението:</b> ${esc(e.topic)}</p>
        <p><b>Лектор:</b> ${esc(e.lecturer)}</p>
        ${listBlock("По време на обучението бяха разгледани:", TRAINING_COVERED)}
        <div class="info-title" style="margin-top:8px">ПРИСЪСТВЕН СПИСЪК</div>
        ${simpleTable(["№", "Име и фамилия", "Длъжност", "Подпис"], attendeeRows || `<tr><td colspan="4" class="empty">—</td></tr>`)}
        <div class="info-title" style="margin-top:8px">КРИТЕРИИ ЗА ОЦЕНКА НА ОБУЧЕНИЕТО</div>
        ${simpleTable(
          ["Критерий", "Да", "Не", "Забележка"],
          TRAINING_EVAL_CRITERIA.map((c) => `<tr><td>${esc(c)}</td><td class="c">☐</td><td class="c">☐</td><td></td></tr>`).join("")
        )}
        <p><b>Резултат от оценката:</b> ${esc(e.result || "....................")}</p>
        <p class="small">Забележка: При неудовлетворителен резултат се провежда допълнително обучение и последваща оценка.</p>
        <div class="info-block">
          <div class="info-title">ЗАКЛЮЧЕНИЕ</div>
          <p>Обучението е проведено съгласно утвърдената програма. Всички участници са имали възможност да задават въпроси и да обсъждат практически ситуации. След проведената оценка се установи, че обучените лица са запознати с изискванията за безопасност на храните и могат да прилагат процедурите, свързани с изпълняваната от тях дейност.</p>
        </div>
        <div class="info-block">
          <div class="info-title">ДЕКЛАРАЦИЯ ЗА ПРЕМИНАТО ОБУЧЕНИЕ</div>
          <p>Ние, долуподписаните служители, декларираме, че участвахме в проведеното обучение и с подписа си удостоверяваме, че: присъствахме на обучението; запознати сме със съдържанието и предоставените материали; разбираме изискванията, свързани с изпълняваната от нас дейност; запознати сме с правилата за лична хигиена, добрите хигиенни практики и безопасността на храните; задължаваме се да спазваме всички въведени правила, процедури и инструкции; при установяване на несъответствие или риск незабавно ще уведомим отговорното лице.</p>
          ${simpleTable(
            ["№", "Име и фамилия", "Декларирам, че съм запознат/а", "Подпис"],
            attendees.map((a, i) => `<tr><td class="c">${i + 1}</td><td>${esc(a)}</td><td class="c">☐ Да</td><td></td></tr>`).join("") || `<tr><td colspan="4" class="empty">—</td></tr>`
          )}
        </div>
        <table class="sig-tbl"><tr>
          <td>Лектор: ${esc(e.lecturer || "..............................")}<br/><br/>Подпис: ..............................</td>
          <td style="text-align:right">Управител / Отговорно лице: ${esc(firm.manager || "..............................")}<br/><br/>Подпис: ${signatureImg(firm.signature)}</td>
        </tr></table>`;
    })
    .join("");
}

function buildSurveySection(data: RegisterDocData): string {
  const entries = data.entries || [];
  if (entries.length === 0) return `<p class="empty">Няма попълнени въпросници.</p>`;
  const flatQuestions: { code: string; text: string }[] = [];
  SAFETY_CULTURE_SURVEY.forEach((g) =>
    g.questions.forEach((q, i) => flatQuestions.push({ code: `${g.code}.${i + 1}`, text: q }))
  );
  return entries
    .map((e, idx) => {
      const groupsHtml = SAFETY_CULTURE_SURVEY.map((g) => {
        const rows = g.questions
          .map((q, i) => {
            const flatIndex = flatQuestions.findIndex((fq) => fq.code === `${g.code}.${i + 1}`);
            const val = (e.answers || {})[flatIndex];
            return `<tr><td class="c">${g.code}.${i + 1}</td><td>${esc(q)}</td>${[1, 2, 3, 4, 5]
              .map((n) => `<td class="c">${val === n ? "✗" : ""}</td>`)
              .join("")}</tr>`;
          })
          .join("");
        return `<tr class="grp"><td colspan="7"><b>${esc(g.title.toUpperCase())}</b></td></tr>${rows}`;
      }).join("");
      return `
        ${idx > 0 ? '<div class="page-break"></div>' : ""}
        <h3 class="unit-title">ВЪПРОСНИК — КУЛТУРА ПО БЕЗОПАСНОСТ НА ХРАНИТЕ</h3>
        <p><b>Име, фамилия, длъжност:</b> ${esc(e.name || "анонимно")} &nbsp;&nbsp; <b>Дата:</b> ${esc(e.date)}</p>
        <table class="data-tbl">
          <thead><tr><th>№</th><th>Въпрос</th>${SURVEY_SCALE_LABELS.map((l, i) => `<th>${i + 1}<br/><span class="small">${esc(l)}</span></th>`).join("")}</tr></thead>
          <tbody>${groupsHtml}</tbody>
        </table>
        <p class="small">* Съгласно допълнение 3 от Известие 2022/С 355/01 относно насоки за прилагането на системи за управление безопасността на храните.</p>`;
    })
    .join("");
}

function buildChecklist3Section(data: RegisterDocData): string {
  const entries = data.entries || [];
  if (entries.length === 0) return `<p class="empty">Няма попълнени чек-листове.</p>`;
  const flat: string[] = [];
  SAFETY_CULTURE_CHECKLIST.forEach((g) => g.questions.forEach((q) => flat.push(q)));
  return entries
    .map((e, idx) => {
      let counter = -1;
      const groupsHtml = SAFETY_CULTURE_CHECKLIST.map((g) => {
        const rows = g.questions
          .map((q) => {
            counter++;
            const val = (e.answers || {})[counter];
            return `<tr><td>${esc(q)}</td>${[1, 2, 3]
              .map((n) => `<td class="c">${val === n ? "✗" : ""}</td>`)
              .join("")}</tr>`;
          })
          .join("");
        return `<tr class="grp"><td colspan="4"><b>${esc(g.title)}</b></td></tr>${rows}`;
      }).join("");
      return `
        ${idx > 0 ? '<div class="page-break"></div>' : ""}
        <h3 class="unit-title">ЧЕК-ЛИСТ — КУЛТУРА НА БЕЗОПАСНОСТ НА ХРАНИТЕ</h3>
        <p><b>Име, фамилия:</b> ${esc(e.employee)} &nbsp;&nbsp; <b>Дата:</b> ${esc(e.date)}</p>
        <table class="data-tbl">
          <thead><tr><th>Въпрос</th><th>1</th><th>2</th><th>3</th></tr></thead>
          <tbody>${groupsHtml}</tbody>
        </table>
        <p class="small">Чек-листът се попълва за всеки работник един път на три месеца. При отговори 1 и 2 се провеждат повторни обучения на персонала.</p>`;
    })
    .join("");
}

/* ------------------------------------------------------------------ */

const ROMAN_WEEKS = ["I", "II", "III", "IV", "V"];

/** Построява печатната секция (без <html> обвивка) за един регистър. */
export function buildRegisterSection(
  def: RegisterDef,
  data: RegisterDocData,
  firm: PrintFirmInfo,
  month: string
): string {
  const periodLabel =
    def.period === "all"
      ? "Постоянен списък"
      : def.period === "year"
        ? `Година: ${month.slice(0, 4)} г.`
        : `Месец: ${monthLabelBg(month)}`;

  let body = "";
  switch (def.kind) {
    case "rows":
      body = buildRowsSection(def, data);
      break;
    case "grid-days": {
      const days = Array.from({ length: daysInMonth(month) }, (_, i) => String(i + 1));
      body = buildGridSection(def, data, days, "Дата");
      break;
    }
    case "grid-weeks":
      body = buildGridSection(def, data, ROMAN_WEEKS, "Седмица");
      break;
    case "temp-units":
      body = buildTempSection(data, month);
      break;
    case "training":
      body = buildTrainingSection(data, firm);
      break;
    case "survey":
      body = buildSurveySection(data);
      break;
    case "checklist3":
      body = buildChecklist3Section(data);
      break;
  }

  const info = (def.infoPanels || []).map((p) => listBlock(p.title, p.items)).join("");
  const legend = def.legend ? listBlock("Легенда", def.legend) : "";
  const instructions = def.instructions ? listBlock("Инструкция за попълване", def.instructions) : "";
  const corrective = def.corrective ? listBlock("Корективни действия при несъответствие", def.corrective) : "";

  return `
    <section class="register">
      <h2 class="reg-title">${esc(def.title.toUpperCase())}</h2>
      ${firmHeader(firm, periodLabel)}
      <p class="fill-when"><b>Кога се попълва:</b> ${esc(def.fillWhen)}</p>
      ${body}
      ${legend}${instructions}${corrective}${info}
      ${def.kind !== "training" ? signatureBlock(firm) : ""}
    </section>`;
}

/** Обвива секции в цялостен печатен документ и връща HTML. */
export function buildPrintDocument(title: string, sections: string[]): string {
  return `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Georgia, serif; color: #000; font-size: 11px; margin: 24px; }
  .register { page-break-after: always; }
  .register:last-child { page-break-after: auto; }
  .page-break { page-break-before: always; }
  .reg-title { text-align: center; font-size: 14px; margin: 0 0 10px; text-transform: uppercase; }
  .unit-title { font-size: 12px; margin: 12px 0 6px; }
  .norm { font-weight: normal; font-style: italic; }
  .period { text-align: right; font-style: italic; margin: 4px 0 8px; }
  .fill-when { background: #f2f2f2; border: 1px solid #999; padding: 5px 8px; margin: 6px 0 10px; }
  .head-tbl { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  .head-tbl td { border: 1px solid #000; padding: 5px 8px; vertical-align: top; }
  .data-tbl { width: 100%; border-collapse: collapse; margin: 6px 0; }
  .data-tbl th, .data-tbl td { border: 1px solid #000; padding: 3px 5px; vertical-align: top; }
  .data-tbl th { background: #e8e8e8; text-align: center; font-size: 10px; }
  .data-tbl td.c { text-align: center; }
  .data-tbl tr.grp td { background: #f0f0f0; }
  .data-tbl td.empty, p.empty { text-align: center; font-style: italic; color: #444; padding: 8px; }
  .info-block { margin: 10px 0; }
  .info-title { font-weight: bold; text-transform: uppercase; font-size: 10.5px; margin-bottom: 3px; }
  .info-block ul { margin: 2px 0 4px 18px; padding: 0; }
  .info-block li { margin-bottom: 1.5px; }
  .sig-tbl { width: 100%; margin-top: 26px; border-collapse: collapse; }
  .sig-tbl td { padding: 4px; }
  .small { font-size: 9px; color: #333; }
  @media print { body { margin: 8mm; } }
</style>
</head>
<body>${sections.join("\n")}</body>
</html>`;
}

/** Отпечатва HTML документ през скрит iframe. */
export function printHtml(html: string) {
  let iframe = document.getElementById("register-print-iframe") as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "register-print-iframe";
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
  }
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  setTimeout(() => {
    iframe!.contentWindow?.focus();
    iframe!.contentWindow?.print();
  }, 300);
}
