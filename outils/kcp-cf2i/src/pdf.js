import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

// Capture le rendu réel (couleurs/fonds compris) et le compose en PDF A4.
// Chaque bloc ".fd-page" devient sa propre page ; sinon le document est paginé.
export async function downloadPDF(sourceEl, filename) {
  const A4_W = 794; // px @96dpi
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed", left: "-10000px", top: "0",
    width: A4_W + "px", background: "#ffffff", padding: "0",
  });
  const clone = sourceEl.cloneNode(true);
  clone.style.position = "static";
  clone.style.width = A4_W + "px";
  clone.style.maxWidth = "none";
  clone.style.boxSizing = "border-box";
  // les contrôles d'édition (corbeilles, boutons « ajouter ») ne doivent pas
  // apparaître dans le PDF : on les retire du clone (le CSS @media print ne
  // s'applique pas pendant la capture).
  clone.querySelectorAll(".no-print").forEach((n) => n.remove());
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  // attendre le chargement des images embarquées
  await Promise.all(
    Array.from(wrap.querySelectorAll("img")).map(
      (img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
    )
  );

  // recalculer la hauteur des cellules auto-extensibles à la largeur réelle du PDF
  wrap.querySelectorAll("textarea").forEach((t) => {
    t.style.height = "auto";
    t.style.height = t.scrollHeight + "px";
  });

  try {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();

    const blocks = clone.querySelectorAll(".fd-page");
    const targets = blocks.length ? Array.from(blocks) : [clone];

    let first = true;
    for (const node of targets) {
      const canvas = await html2canvas(node, {
        scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: A4_W,
      });
      const imgW = pw;
      const imgH = (canvas.height * imgW) / canvas.width;
      const img = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = imgH;
      let pos = 0;
      if (!first) pdf.addPage();
      first = false;
      pdf.addImage(img, "JPEG", 0, pos, imgW, imgH);
      heightLeft -= ph;
      while (heightLeft > 1) {
        pos -= ph;
        pdf.addPage();
        pdf.addImage(img, "JPEG", 0, pos, imgW, imgH);
        heightLeft -= ph;
      }
    }
    const blob = pdf.output("blob");
    pdf.save(filename);
    return blob;
  } finally {
    document.body.removeChild(wrap);
  }
}
