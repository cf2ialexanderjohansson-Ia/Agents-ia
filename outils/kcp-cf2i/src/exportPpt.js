import pptxgen from "pptxgenjs";

const NAVY = "15293F";
const ORANGE = "ED6F08";
const GREY = "6B7A8D";
const LIGHT = "F4F6F8";

export async function exportSupportPptx(fd, constants, filename) {
  const modules = fd.support || [];
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CF2I_16x9", width: 10, height: 5.63 });
  pptx.layout = "CF2I_16x9";

  // slide de garde
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  if (constants.logo) {
    try { cover.addImage({ data: constants.logo, x: 0.5, y: 0.4, h: 0.5, sizing: { type: "contain", w: 1.6, h: 0.5 } }); } catch { /* logo illisible */ }
  }
  cover.addText("SUPPORT DE FORMATION", { x: 0.5, y: 2.0, w: 9, fontSize: 13, color: ORANGE, bold: true, charSpacing: 2 });
  cover.addText(fd.titre || "Support stagiaire", { x: 0.5, y: 2.4, w: 9, fontSize: 30, color: "FFFFFF", bold: true });
  cover.addText([fd.code, fd.duree].filter(Boolean).join("  ·  "), { x: 0.5, y: 3.3, w: 9, fontSize: 14, color: "AAB6C4" });

  modules.forEach((m, i) => {
    const slide = pptx.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 5.63, fill: { color: ORANGE } });

    slide.addText(String(i + 1).padStart(2, "0"), {
      x: 0.4, y: 0.3, w: 0.6, h: 0.35, fontSize: 11, bold: true, color: "FFFFFF",
      fill: { color: NAVY }, align: "center", valign: "middle",
    });
    slide.addText(m.titre || `Module ${i + 1}`, { x: 1.1, y: 0.28, w: 8.3, fontSize: 20, bold: true, color: NAVY });
    if (m.jour) slide.addText(m.jour, { x: 1.1, y: 0.72, w: 8.3, fontSize: 11, color: GREY });

    let y = 1.25;
    if (m.objectif) {
      slide.addText("OBJECTIF DU MODULE", { x: 0.5, y, w: 9, fontSize: 10, bold: true, color: ORANGE, charSpacing: 1 });
      y += 0.32;
      slide.addText(m.objectif, { x: 0.5, y, w: 9, fontSize: 13, color: "333333", fill: { color: LIGHT }, margin: 8 });
      y += 0.3 + Math.ceil((m.objectif.length || 0) / 95) * 0.22;
    }

    if ((m.pointsCles || []).length) {
      slide.addText("POINTS CLÉS", { x: 0.5, y, w: 9, fontSize: 10, bold: true, color: ORANGE, charSpacing: 1 });
      y += 0.32;
      slide.addText(
        m.pointsCles.map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, breakLine: true } })),
        { x: 0.5, y, w: 9, fontSize: 12, color: "333333" }
      );
      y += 0.28 * m.pointsCles.length + 0.15;
    }

    if (m.exercice) {
      const ey = Math.min(y, 4.55);
      slide.addText("EXERCICE / VALIDATION", { x: 0.5, y: ey, w: 9, fontSize: 10, bold: true, color: ORANGE, charSpacing: 1 });
      slide.addText(m.exercice, { x: 0.5, y: ey + 0.3, w: 9, fontSize: 12, color: "333333", italic: true });
    }

    if ((m.images || []).length) {
      try { slide.addImage({ data: m.images[0], x: 6.3, y: 1.25, w: 3.2, h: 2.2, sizing: { type: "contain", w: 3.2, h: 2.2 } }); } catch { /* image illisible */ }
    }
  });

  await pptx.writeFile({ fileName: filename });
}
