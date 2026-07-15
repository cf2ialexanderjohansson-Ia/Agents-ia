import { useState } from "react";
import { RefreshCw, BookOpen, Sparkles, Loader2, Trash2, Plus, ImagePlus, X } from "lucide-react";
import { NAVY, ORANGE, LIGHT, GREY, LINE, buildSupport, lines, imgToDataURL } from "../store.js";
import { Action, AutoGrow, PreviewHeader, PreviewFooter } from "../ui.jsx";
import { callClaude } from "../ai.js";

export default function Support({ fd, setFd, constants }) {
  const support = fd.support;
  const [ai, setAi] = useState({ idx: -1, msg: "" });

  const generate = () => setFd((p) => ({ ...p, support: buildSupport(p.programme) }));

  function update(i, key, val) {
    setFd((p) => { const s = structuredClone(p.support); s[i][key] = val; return { ...p, support: s }; });
  }
  function remove(i) { setFd((p) => { const s = structuredClone(p.support); s.splice(i, 1); return { ...p, support: s }; }); }
  function add() { setFd((p) => ({ ...p, support: [...(p.support || []), { jour: "", titre: "Nouveau module", objectif: "", pointsCles: [], exercice: "", images: [] }] })); }

  async function addImages(i, e) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    const outs = []; for (const f of files) outs.push(await imgToDataURL(f, 900, "image/jpeg", 0.85));
    setFd((p) => { const s = structuredClone(p.support); s[i].images = [...(s[i].images || []), ...outs]; return { ...p, support: s }; });
    e.target.value = "";
  }
  function removeImage(i, j) {
    setFd((p) => { const s = structuredClone(p.support); s[i].images = (s[i].images || []).filter((_, k) => k !== j); return { ...p, support: s }; });
  }

  async function expand(i) {
    const m = support[i];
    setAi({ idx: i, msg: "Rédaction du contenu…" });
    const prompt = `Tu rédiges le contenu pédagogique d'un module de formation drone CF2i pour le LIVRET STAGIAIRE.
Module : "${m.titre}" (${m.jour}). Points clés actuels : ${(m.pointsCles || []).join(" ; ")}.
Renvoie UNIQUEMENT un JSON : {"objectif": string (1 phrase), "pointsCles": string[] (5-8 points développés, clairs), "exercice": string (consigne d'exercice ou quiz)}.
Style pédagogique, terminologie réglementaire exacte (STS-01, ZGU, DSAC, SORA) si pertinent.`;
    try {
      const j = JSON.parse(await callClaude(prompt, { maxTokens: 900 }));
      setFd((p) => { const s = structuredClone(p.support); s[i] = { ...s[i], objectif: j.objectif || s[i].objectif, pointsCles: j.pointsCles || s[i].pointsCles, exercice: j.exercice || s[i].exercice }; return { ...p, support: s }; });
      setAi({ idx: -1, msg: "" });
    } catch (e) { setAi({ idx: i, msg: e.message }); }
  }

  if (!support) {
    return (
      <div className="bg-white rounded-xl p-12 text-center max-w-2xl mx-auto" style={{ border: `1px dashed #C7CFDA` }}>
        <div className="inline-flex items-center justify-center rounded-full mb-3" style={{ width: 52, height: 52, background: LIGHT }}>
          <BookOpen size={22} style={{ color: GREY }} />
        </div>
        <p className="mb-4" style={{ color: GREY }}>Le support de formation génère un module par section du programme (objectif, points clés, exercice, visuels). Chaque module est ensuite éditable et peut être enrichi par l'IA.</p>
        <button onClick={generate} disabled={!(fd.programme || "").trim()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2.5 rounded-lg disabled:opacity-50 transition-transform active:scale-[0.98]" style={{ background: ORANGE, boxShadow: "0 1px 2px rgba(237,111,8,0.35)" }}>
          <RefreshCw size={15} /> Générer le support
        </button>
        {!(fd.programme || "").trim() && <p className="text-xs mt-3" style={{ color: GREY }}>Saisissez d'abord un programme dans la fiche descriptive.</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="no-print flex flex-wrap gap-2 mb-4">
        <Action onClick={generate} icon={<RefreshCw size={15} />} label="Régénérer depuis le programme" />
        <Action onClick={add} icon={<Plus size={15} />} label="Ajouter un module" />
        <span className="text-xs self-center" style={{ color: GREY }}>« Enrichir » nécessite une clé API (Réglages).</span>
      </div>

      <div className="print-area bg-white rounded-lg overflow-hidden shadow-sm" style={{ border: `1px solid ${LINE}` }}>
        <PreviewHeader constants={constants} eyebrow="SUPPORT DE FORMATION" code={fd.code} title={fd.titre || "Support stagiaire"} sub={fd.duree} />
        <div className="p-5 space-y-4" style={{ background: LIGHT }}>
          {support.map((m, i) => (
            <div key={i} style={{ border: `1px solid ${LINE}`, borderLeft: `3px solid ${ORANGE}`, borderRadius: 4, background: "#fff", padding: 16 }}>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded mt-0.5 shrink-0" style={{ background: NAVY }}>{String(i + 1).padStart(2, "0")}</span>
                <input value={m.titre} onChange={(e) => update(i, "titre", e.target.value)} className="flex-1 min-w-0 bg-transparent font-bold outline-none" style={{ color: NAVY, fontSize: 14 }} />
                <button onClick={() => expand(i)} className="no-print flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded" style={{ color: NAVY, border: `1px solid ${LINE}`, background: "#fff" }}>
                  {ai.idx === i ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Enrichir
                </button>
                <button onClick={() => remove(i)} className="no-print p-1"><Trash2 size={13} color="#c0392b" /></button>
              </div>

              <Lbl>Objectif du module</Lbl>
              <AutoGrow value={m.objectif} onChange={(v) => update(i, "objectif", v)} className="w-full rounded border p-2 text-[11px]" style={{ borderColor: LINE, background: LIGHT, color: "#333" }} />

              <Lbl>Points clés (1 / ligne)</Lbl>
              <AutoGrow value={(m.pointsCles || []).join("\n")} onChange={(v) => update(i, "pointsCles", lines(v))} className="w-full rounded border p-2 text-[11px]" style={{ borderColor: LINE, background: LIGHT, color: "#333", fontFamily: "ui-monospace, monospace" }} />

              <Lbl>Exercice / validation</Lbl>
              <AutoGrow value={m.exercice} onChange={(v) => update(i, "exercice", v)} className="w-full rounded border p-2 text-[11px]" style={{ borderColor: LINE, background: LIGHT, color: "#333" }} />

              <Lbl>Visuels</Lbl>
              <div className="flex flex-wrap gap-2 items-start">
                {(m.images || []).map((src, j) => (
                  <div key={j} className="relative rounded-md overflow-hidden bg-white" style={{ border: `1px solid ${LINE}` }}>
                    <img src={src} alt="" style={{ maxHeight: 150, maxWidth: 220, objectFit: "contain", display: "block" }} />
                    <button onClick={() => removeImage(i, j)} className="no-print absolute top-1 right-1 rounded-full p-0.5" style={{ background: "#fff", border: `1px solid ${LINE}` }}><X size={12} color="#c0392b" /></button>
                  </div>
                ))}
                <label className="no-print flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer text-[11px] font-semibold" style={{ border: `1px dashed ${GREY}`, color: NAVY, width: 90, height: 70 }}>
                  <ImagePlus size={16} /> Image
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addImages(i, e)} />
                </label>
              </div>

              {ai.idx === i && ai.msg && <p className="text-[11px] mt-1" style={{ color: GREY }}>{ai.msg}</p>}
            </div>
          ))}
        </div>
        <PreviewFooter constants={constants} doc="Support de formation" />
      </div>
    </div>
  );
}

function Lbl({ children }) {
  return <div className="text-[10px] font-semibold mt-2 mb-0.5" style={{ color: ORANGE }}>{children}</div>;
}
