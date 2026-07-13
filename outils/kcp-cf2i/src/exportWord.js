import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType, ImageRun, PageBreak,
  Header, VerticalAlign,
} from "docx";
import { lines, parseProgramme } from "./store.js";
import { triggerDownload } from "./download.js";

// Palette et gabarit repris à l'identique du template Word CF2i (FD-*.docx)
const NAVY = "1A3566";
const DARKNAVY = "002060";
const ORANGE = "FF6600";
const GREY = "7A7A7A";
const WHITE = "FFFFFF";
const FONT = "Arial";
const FONT_TITLE = "Arial Black";

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noCellBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const tableLine = { style: BorderStyle.SINGLE, size: 4, color: NAVY };
const tableBorders = { top: tableLine, bottom: tableLine, left: tableLine, right: tableLine, insideHorizontal: tableLine, insideVertical: tableLine };

function dataUrlToUint8Array(dataUrl) {
  return fetch(dataUrl).then((r) => r.arrayBuffer()).then((b) => new Uint8Array(b));
}

function loadImageSize(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 100, h: img.naturalHeight || 100 });
    img.onerror = () => resolve({ w: 100, h: 100 });
    img.src = dataUrl;
  });
}

// "FD - Bleu" / "FD - Orange" / "FD - Gris" : titre de section coloré, sans bandeau
function sectionHeading(text, color) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    indent: { left: 200 },
    children: [new TextRun({ text, bold: true, color, size: 20, font: FONT })],
  });
}

// "FD - Titre Contenu" / "FD - Jour contenu" : bandeau plein fond coloré, texte blanc centré
function band(text, { fill, size = 22, before = 240 }) {
  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill },
    alignment: AlignmentType.CENTER,
    spacing: { before, after: 120 },
    children: [new TextRun({ text: (text || "").toUpperCase(), bold: true, color: WHITE, size, font: FONT })],
  });
}

// "FD - Puces Page 1" / "FD - Puces contenu" : puce justifiée
function bulletP(text, after = 80) {
  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after },
    children: [new TextRun({ text, size: 20, font: FONT })],
  });
}

function bulletList(items, after = 80) {
  if (!items || items.length === 0) return [bulletP("—", after)];
  return items.map((it) => bulletP(it, after));
}

function metaHeaderCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, color: WHITE, size: 20, font: FONT })] })],
  });
}
function metaDataCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: text || "—", size: 20, font: FONT })] })],
  });
}

function contactLine(text, bold) {
  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: NAVY },
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text, bold: !!bold, color: WHITE, size: 20, font: FONT })],
  });
}

// grille 2 colonnes : chaque entrée de `items` est un tableau de Paragraph
// (titre + puces d'une section), placé côte à côte par paire.
function gridCell(paragraphs, { withGutter }) {
  return new TableCell({
    width: { size: 50, type: WidthType.PERCENTAGE },
    borders: noCellBorders,
    verticalAlign: VerticalAlign.TOP,
    margins: withGutter ? { right: 200 } : undefined,
    children: paragraphs,
  });
}
function emptyCell() {
  return new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: noCellBorders, children: [new Paragraph({ text: "" })] });
}
function twoColGrid(items) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    const left = gridCell(items[i], { withGutter: true });
    const right = items[i + 1] ? gridCell(items[i + 1], { withGutter: false }) : emptyCell();
    rows.push(new TableRow({ children: [left, right] }));
  }
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: noCellBorders, rows });
}

export async function exportFicheDescriptiveWord(fd, constants, filename) {
  const days = parseProgramme(fd.programme);
  const prereq = lines(fd.prerequis || constants.prerequis);
  const modeval = lines(fd.modalitesEval || constants.modalitesEval);

  // ---- en-tête (logo + eyebrow + titre), répété sur chaque page ----
  let logoRun = null;
  if (constants.logo) {
    try {
      const [data, size] = await Promise.all([dataUrlToUint8Array(constants.logo), loadImageSize(constants.logo)]);
      const h = 60, w = Math.round(h * (size.w / size.h || 1));
      const type = constants.logo.startsWith("data:image/jpeg") ? "jpg" : "png";
      logoRun = new ImageRun({ type, data, transformation: { width: w, height: h } });
    } catch { /* logo illisible : en-tête sans logo */ }
  }

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noCellBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 80, type: WidthType.PERCENTAGE },
            borders: noCellBorders,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Fiche descriptive", bold: true, color: ORANGE, font: FONT_TITLE, size: 32 }),
                  new TextRun({ text: fd.code ? `  ${fd.code}` : "", bold: true, color: ORANGE, font: FONT_TITLE, size: 32 }),
                ],
              }),
              new Paragraph({
                children: [new TextRun({ text: fd.titre || "Intitulé de la formation", bold: true, color: NAVY, font: FONT_TITLE, size: 32 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: noCellBorders,
            verticalAlign: VerticalAlign.TOP,
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: logoRun ? [logoRun] : [] })],
          }),
        ],
      }),
    ],
  });

  const header = new Header({ children: [headerTable] });

  const children = [];

  if (fd.accroche) {
    children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: fd.accroche, size: 20, font: FONT })] }));
  }

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({ children: [metaHeaderCell("Durée totale", 21), metaHeaderCell("Type", 32), metaHeaderCell("Niveau d'entrée", 47)] }),
        new TableRow({ children: [metaDataCell(fd.duree, 21), metaDataCell(fd.format, 32), metaDataCell(fd.niveau, 47)] }),
      ],
    })
  );
  children.push(new Paragraph({ text: "" }));

  children.push(
    twoColGrid([
      [sectionHeading("Objectifs opérationnels", NAVY), ...bulletList(lines(fd.objectifs))],
      [sectionHeading("Prérequis", NAVY), ...bulletList(prereq)],
      [sectionHeading("Modalité et délai d'accès", NAVY), ...bulletList(lines(constants.acces))],
      [sectionHeading("Méthodes mobilisées", ORANGE), ...bulletList(lines(constants.methodes))],
      [sectionHeading("Modalités d'évaluation", ORANGE), ...bulletList(modeval)],
      [sectionHeading("Accessibilité", ORANGE), ...bulletList(lines(constants.accessibilite))],
      [sectionHeading("Dates des sessions de formation", GREY), ...bulletList(lines(constants.sessionsInfo))],
      [sectionHeading("Moyens humains et matériels", GREY), ...bulletList(lines(constants.moyens))],
    ])
  );

  // bandeau contact (fond navy plein largeur, texte blanc centré)
  children.push(
    contactLine("Pour toute question administrative, pédagogique et/ou handicap :", true),
    contactLine("Service commercial", true),
    contactLine(constants.tel, false),
    contactLine(constants.email, false)
  );

  // page 2 — contenu de la formation
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [new TextRun({ text: "Contenu de la formation", bold: true, color: NAVY, font: FONT_TITLE, size: 24 })],
    })
  );

  if (days.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "Le programme s'affichera ici.", color: GREY, size: 20, font: FONT })] }));
  }
  days.forEach((d, i) => {
    children.push(band(d.title || `Jour ${i + 1}`, { fill: NAVY, size: 22, before: i === 0 ? 0 : 360 }));
    children.push(
      twoColGrid(
        d.sections.map((s) => [
          ...(s.title ? [band(s.title, { fill: DARKNAVY, size: 23, before: 0 })] : []),
          ...bulletList(s.bullets, 34),
        ])
      )
    );
  });

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1500, bottom: 850, left: 850, right: 850 },
        },
      },
      headers: { default: header },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, filename);
  return blob;
}
