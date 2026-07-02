import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ShadingType, ImageRun, PageBreak,
} from "docx";
import { lines, parseProgramme } from "./store.js";
import { triggerDownload } from "./download.js";

const NAVY = "15293F";
const ORANGE = "ED6F08";
const GREY = "6B7A8D";
const LINE = "E5E9EF";
const LIGHT = "F4F6F8";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const cellBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function eyebrow(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: ORANGE, size: 16, characterSpacing: 20 })],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 160 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 34 })],
  });
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, color: NAVY, size: 22 })],
  });
}

function bulletList(items) {
  if (!items || items.length === 0) {
    return [new Paragraph({ children: [new TextRun({ text: "—", color: GREY, size: 20 })] })];
  }
  return items.map(
    (it) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: it, size: 20 })] })
  );
}

function metaRow(cells) {
  return new TableRow({
    children: cells.map(
      ([k, v]) =>
        new TableCell({
          borders: cellBorders,
          shading: { type: ShadingType.CLEAR, fill: LIGHT },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({ children: [new TextRun({ text: k.toUpperCase(), bold: true, color: GREY, size: 14, characterSpacing: 10 })] }),
            new Paragraph({ children: [new TextRun({ text: v || "—", bold: true, color: NAVY, size: 20 })] }),
          ],
        })
    ),
  });
}

function statCell(n, l) {
  return new TableCell({
    borders: cellBorders,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: n || "—", bold: true, color: ORANGE, size: 26 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: l, color: GREY, size: 14 })] }),
    ],
  });
}

export async function exportFicheDescriptiveWord(fd, constants, filename) {
  const days = parseProgramme(fd.programme);
  const prereq = lines(fd.prerequis || constants.prerequis);
  const modeval = lines(fd.modalitesEval || constants.modalitesEval);

  const logicielsParas = lines(fd.logiciels).map((it) => {
    const [name, ...rest] = it.split("—");
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [
        new TextRun({ text: name.trim(), bold: true, color: NAVY, size: 20 }),
        ...(rest.length ? [new TextRun({ text: " — " + rest.join("—").trim(), color: GREY, size: 20 })] : []),
      ],
    });
  });

  const children = [
    eyebrow(`Fiche descriptive${fd.code ? " · " + fd.code : ""}`),
    h1(fd.titre || "Intitulé de la formation"),
  ];

  if (fd.accroche) {
    children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: fd.accroche, color: "374350", size: 20 })] }));
  }

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [metaRow([["Durée", fd.duree], ["Modalité", fd.modalite], ["Format", fd.format], ["Niveau", fd.niveau]])],
    })
  );

  children.push(sectionTitle("Objectifs opérationnels"), ...bulletList(lines(fd.objectifs)));
  children.push(sectionTitle("Logiciels"), ...(logicielsParas.length ? logicielsParas : bulletList([])));
  children.push(sectionTitle("Prérequis"), ...bulletList(prereq));
  children.push(sectionTitle("Modalités d'évaluation"), ...bulletList(modeval));
  children.push(sectionTitle("Accès, délais & accessibilité"), ...bulletList(lines(constants.acces)));
  children.push(sectionTitle("Méthodes mobilisées"), ...bulletList(lines(constants.methodes)));
  children.push(sectionTitle("Moyens humains & matériels"), ...bulletList(lines(constants.moyens)));

  children.push(sectionTitle("Satisfaction client"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            statCell(constants.nbStagiaires, "Stagiaires formés"),
            statCell(constants.tauxObjectifs, "Atteinte des objectifs"),
            statCell(constants.satisfaction, "Satisfaction stagiaires"),
            statCell(constants.certification, "Réussite certification"),
          ],
        }),
      ],
    })
  );
  if (constants.periode) {
    children.push(new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: constants.periode, color: GREY, size: 16 })] }));
  }

  // Page 2 — programme
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(eyebrow(`Programme${fd.code ? " · " + fd.code : ""}`));
  children.push(h1(fd.titre || "Programme de la formation"));
  if (fd.duree) children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: fd.duree, color: GREY, size: 20 })] }));

  if (days.length === 0) {
    children.push(new Paragraph({ children: [new TextRun({ text: "Le programme s'affichera ici.", color: GREY, size: 20 })] }));
  }
  days.forEach((d, i) => {
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 100 },
        children: [new TextRun({ text: (d.title || `Jour ${i + 1}`).toUpperCase(), bold: true, color: NAVY, size: 22, characterSpacing: 10 })],
      })
    );
    d.sections.forEach((s) => {
      if (s.title) children.push(sectionTitle(s.title));
      children.push(...bulletList(s.bullets));
    });
  });

  // pied de page
  children.push(
    new Paragraph({
      spacing: { before: 300 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE } },
      children: [new TextRun({ text: `Contact : ${constants.tel} · ${constants.email}`, bold: true, color: NAVY, size: 16 })],
    }),
    new Paragraph({ children: [new TextRun({ text: constants.legal, color: GREY, size: 14 })] })
  );

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, filename);
  return blob;
}
