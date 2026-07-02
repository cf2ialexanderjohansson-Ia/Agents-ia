import XLSX from "xlsx-js-style";

const NAVY = "15293F";
const ORANGE = "ED6F08";
const LUNCH_BG = "FFF7EF";
const LINE = "E5E9EF";

const COLS = ["Horaire", "Séquence / objectif", "Contenu", "Méthode", "Support", "Durée"];
const KEYS = ["horaire", "sequence", "contenu", "methode", "support", "duree"];
const WIDTHS = [12, 26, 44, 18, 22, 12];

const thin = { style: "thin", color: { rgb: LINE } };
const allBorders = { top: thin, bottom: thin, left: thin, right: thin };

function headerCell(text) {
  return {
    v: text,
    t: "s",
    s: {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: NAVY } },
      alignment: { vertical: "center", horizontal: "left", wrapText: true },
      border: allBorders,
    },
  };
}

function bodyCell(text, isLunch, bold) {
  return {
    v: text || "",
    t: "s",
    s: {
      font: { bold: !!bold, color: { rgb: "333333" } },
      fill: { fgColor: { rgb: isLunch ? LUNCH_BG : "FFFFFF" } },
      alignment: { vertical: "top", horizontal: "left", wrapText: true },
      border: allBorders,
    },
  };
}

function titleCell(text) {
  return {
    v: text,
    t: "s",
    s: { font: { bold: true, color: { rgb: NAVY }, sz: 13 } },
  };
}

export function exportDerouleExcel(fd, filename) {
  const deroule = fd.deroule || [];
  const wb = XLSX.utils.book_new();

  deroule.forEach((day, di) => {
    const rows = [];
    rows.push([titleCell((day.title || `Jour ${di + 1}`).toUpperCase())]);
    rows.push(COLS.map(headerCell));
    (day.slots || []).forEach((s) => {
      const isLunch = s.methode === "Pause déjeuner";
      rows.push(KEYS.map((k, i) => bodyCell(s[k], isLunch, i === 1)));
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = WIDTHS.map((w) => ({ wch: w }));
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: COLS.length - 1 } }];
    ws["!rows"] = [{ hpt: 20 }, { hpt: 18 }];

    let name = (day.title || `Jour ${di + 1}`).replace(/[\\/*?[\]:]/g, "").slice(0, 28) || `Jour ${di + 1}`;
    let unique = name, n = 2;
    while (wb.SheetNames.includes(unique)) unique = `${name} (${n++})`;
    XLSX.utils.book_append_sheet(wb, ws, unique || `Jour ${di + 1}`);
  });

  if (deroule.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([["Aucun déroulé généré."]]);
    XLSX.utils.book_append_sheet(wb, ws, "Déroulé");
  }

  XLSX.writeFile(wb, filename);
}
