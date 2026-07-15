import XLSX from "xlsx-js-style";
import { triggerDownload } from "./download.js";

// Palette et hiérarchie reprises du modèle CF2i "Déroulé pédagogique" fourni :
// bandeau navy (jour / demi-journée), bloc pêche/orange (séquence + durée),
// sous-points en clair (contenu détaillé de la séquence).
const NAVY = "1A3566";
const PEACH = "FBE4D5";
const ORANGE = "FF6600";
const LINE = "D9D9D9";
const WHITE = "FFFFFF";

const COLS = ["Séquence", "Durée (min)", "Modalité de mise en œuvre", "Modalité d'évaluation", "Support"];
const WIDTHS = [46, 11, 24, 20, 22];

const thin = { style: "thin", color: { rgb: LINE } };
const allBorders = { top: thin, bottom: thin, left: thin, right: thin };

function cell(value, { bg, color, bold, center, wrap = true, size = 9 } = {}) {
  const isNum = typeof value === "number";
  return {
    v: isNum ? value : (value || ""),
    t: isNum ? "n" : "s",
    s: {
      font: { bold: !!bold, color: { rgb: color || "333333" }, sz: size },
      fill: bg ? { fgColor: { rgb: bg } } : undefined,
      alignment: { vertical: "center", horizontal: center ? "center" : "left", wrapText: wrap },
      border: allBorders,
    },
  };
}

const headerRow = () => COLS.map((c) => cell(c, { bg: NAVY, color: WHITE, bold: true, center: true }));
const bandRow = (label, minutes) => [
  cell(label, { bg: NAVY, color: WHITE, bold: true }),
  cell(minutes, { bg: NAVY, color: WHITE, bold: true, center: true }),
  cell("", { bg: NAVY }), cell("", { bg: NAVY }), cell("", { bg: NAVY }),
];
const blockRow = (seq, minutes, evalMod, support) => [
  cell(seq, { bg: PEACH, color: ORANGE, bold: true }),
  cell(minutes, { bg: PEACH, color: ORANGE, bold: true, center: true }),
  cell("", { bg: PEACH }),
  cell(evalMod, { bg: PEACH, color: ORANGE, bold: true, center: true }),
  cell(support, { bg: PEACH, color: ORANGE, bold: true }),
];
const subRow = (text) => [cell(text), cell(""), cell(""), cell(""), cell("")];
const blankRow = () => [cell("", { wrap: false }), cell(""), cell(""), cell(""), cell("")];

// Reconstitue les minutes à partir du texte généré par fmtDur() ("45 min", "1 h", "1 h 45").
function parseDureeToMinutes(s) {
  if (!s) return 0;
  const minOnly = s.match(/^(\d+)\s*min$/);
  if (minOnly) return parseInt(minOnly[1], 10);
  const hMin = s.match(/(\d+)\s*h\s*(\d+)?/);
  if (hMin) return parseInt(hMin[1], 10) * 60 + (hMin[2] ? parseInt(hMin[2], 10) : 0);
  return 0;
}

export function exportDerouleExcel(fd, filename) {
  const deroule = fd.deroule || [];
  const rows = [headerRow()];

  deroule.forEach((day, di) => {
    const dayLabel = (day.title || `Jour ${di + 1}`).toUpperCase();
    const slots = day.slots || [];
    const lunchIdx = slots.findIndex((s) => s.methode === "Pause déjeuner");
    const halves = lunchIdx === -1
      ? [{ label: "", slots }]
      : [
          { label: "MATIN", slots: slots.slice(0, lunchIdx) },
          { label: "PAUSE", slots: [slots[lunchIdx]] },
          { label: "APRÈS-MIDI", slots: slots.slice(lunchIdx + 1) },
        ];

    halves.forEach((half) => {
      if (!half.slots.length) return;
      if (half.label === "PAUSE") {
        const s = half.slots[0];
        rows.push(blockRow(s.sequence || "Pause déjeuner", parseDureeToMinutes(s.duree), "", s.support));
        return;
      }
      const total = half.slots.reduce((sum, s) => sum + parseDureeToMinutes(s.duree), 0);
      const label = half.label ? `${dayLabel} — ${half.label} = ${total}'` : `${dayLabel} = ${total}'`;
      rows.push(bandRow(label, total));
      half.slots.forEach((s) => {
        const evalMod = s.methode === "Pause déjeuner" ? "" : "Évaluation formateur";
        rows.push(blockRow(s.sequence, parseDureeToMinutes(s.duree), evalMod, s.support));
        (s.contenu || "").split(" · ").map((x) => x.trim()).filter(Boolean).forEach((it) => rows.push(subRow(it)));
      });
    });
    rows.push(blankRow());
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows.length > 1 ? rows : [headerRow(), [cell("Aucun déroulé généré.")]]);
  ws["!cols"] = WIDTHS.map((w) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws, "Déroulé");

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  triggerDownload(blob, filename);
  return blob;
}
