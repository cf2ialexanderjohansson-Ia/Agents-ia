import { useEffect, useRef } from "react";
import { RefreshCw, Plus, Trash2, Clock } from "lucide-react";
import { NAVY, ORANGE, LIGHT, GREY, LINE, buildDeroule } from "../store.js";
import { Action, PreviewHeader, PreviewFooter } from "../ui.jsx";

const METHODES = ["Organisation", "Apport théorique", "Pratique / atelier", "Démonstration", "Évaluation", "Pause", "Pause déjeuner"];
const PAUSE_METHODES = ["Pause déjeuner", "Pause"];
// largeurs en % (somme = 100) -> le tableau tient toujours dans la page
const COLS = [
  ["Horaire", "9%"], ["Séquence / objectif", "17%"], ["Contenu", "33%"],
  ["Méthode", "13%"], ["Support", "16%"], ["Durée", "12%"],
];

export default function Deroule({ fd, setFd, constants }) {
  const deroule = fd.deroule;
  const generate = () => setFd((p) => ({ ...p, deroule: buildDeroule(p.programme) }));

  function update(di, si, key, val) {
    setFd((p) => { const d = structuredClone(p.deroule); d[di].slots[si][key] = val; return { ...p, deroule: d }; });
  }
  function addSlot(di) {
    setFd((p) => { const d = structuredClone(p.deroule); d[di].slots.push({ horaire: "", sequence: "", contenu: "", methode: "Apport théorique", support: "", duree: "" }); return { ...p, deroule: d }; });
  }
  function removeSlot(di, si) {
    setFd((p) => { const d = structuredClone(p.deroule); d[di].slots.splice(si, 1); return { ...p, deroule: d }; });
  }
  function updateDayTitle(di, val) {
    setFd((p) => { const d = structuredClone(p.deroule); d[di].title = val; return { ...p, deroule: d }; });
  }

  if (!deroule) {
    return (
      <div className="bg-white rounded-xl p-12 text-center max-w-2xl mx-auto" style={{ border: `1px dashed #C7CFDA` }}>
        <div className="inline-flex items-center justify-center rounded-full mb-3" style={{ width: 52, height: 52, background: LIGHT }}>
          <Clock size={22} style={{ color: GREY }} />
        </div>
        <p className="mb-4" style={{ color: GREY }}>Le déroulé pédagogique se construit automatiquement à partir du programme saisi dans la fiche descriptive (horaires, séquences, méthodes), puis reste entièrement modifiable.</p>
        <button onClick={generate} disabled={!(fd.programme || "").trim()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2.5 rounded-lg disabled:opacity-50 transition-transform active:scale-[0.98]" style={{ background: ORANGE, boxShadow: "0 1px 2px rgba(237,111,8,0.35)" }}>
          <RefreshCw size={15} /> Générer le déroulé
        </button>
        {!(fd.programme || "").trim() && <p className="text-xs mt-3" style={{ color: GREY }}>Saisissez d'abord un programme dans la fiche descriptive.</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="no-print flex flex-wrap gap-2 mb-4">
        <Action onClick={generate} icon={<RefreshCw size={15} />} label="Régénérer depuis le programme" />
        <span className="text-xs self-center" style={{ color: GREY }}>La régénération écrase les modifications manuelles.</span>
      </div>

      <div className="print-area bg-white rounded-lg overflow-hidden shadow-sm" style={{ border: `1px solid ${LINE}` }}>
        <PreviewHeader constants={constants} eyebrow="DÉROULÉ PÉDAGOGIQUE" code={fd.code} title={fd.titre || "Déroulé de la formation"} sub={fd.duree} />
        <div className="p-5 space-y-4" style={{ background: LIGHT }}>
          {deroule.map((day, di) => (
            <div key={di} className="rounded-lg" style={{ background: "#fff", border: `1px solid ${LINE}`, padding: 14 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="shrink-0" style={{ width: 16, height: 2, background: ORANGE }} />
                <input value={day.title} onChange={(e) => updateDayTitle(di, e.target.value)}
                  className="bg-transparent font-bold uppercase outline-none"
                  style={{ color: NAVY, fontSize: 11, letterSpacing: "0.1em", width: Math.min(460, Math.max(160, (day.title || "").length * 7.4)) }} />
              </div>
              <table className="w-full border-collapse" style={{ tableLayout: "fixed", fontSize: 10 }}>
                <colgroup>{COLS.map((c, i) => <col key={i} style={{ width: c[1] }} />)}</colgroup>
                <thead>
                  <tr style={{ background: NAVY }}>
                    {COLS.map((c, i) => (
                      <th key={i} className="text-left font-semibold p-1.5 align-top" style={{ color: "#fff", border: `1px solid ${NAVY}`, wordBreak: "break-word" }}>{c[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {day.slots.map((s, si) => (
                    <tr key={si} style={{ background: PAUSE_METHODES.includes(s.methode) ? "#FFF7EF" : "#fff" }}>
                      <Td><AutoArea v={s.horaire} on={(v) => update(di, si, "horaire", v)} /></Td>
                      <Td><AutoArea v={s.sequence} on={(v) => update(di, si, "sequence", v)} bold /></Td>
                      <Td><AutoArea v={s.contenu} on={(v) => update(di, si, "contenu", v)} /></Td>
                      <Td>
                        <select value={s.methode} onChange={(e) => update(di, si, "methode", e.target.value)} className="w-full bg-transparent outline-none" style={{ fontSize: 10, color: "#333" }}>
                          {METHODES.map((m) => <option key={m}>{m}</option>)}
                        </select>
                      </Td>
                      <Td><AutoArea v={s.support} on={(v) => update(di, si, "support", v)} /></Td>
                      <Td>
                        <div className="flex items-start gap-1">
                          <AutoArea v={s.duree} on={(v) => update(di, si, "duree", v)} />
                          <button onClick={() => removeSlot(di, si)} className="no-print shrink-0 mt-0.5"><Trash2 size={11} color="#c0392b" /></button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => addSlot(di)} className="no-print mt-1.5 flex items-center gap-1 text-[11px] font-semibold" style={{ color: NAVY }}>
                <Plus size={13} /> Ajouter une séquence
              </button>
            </div>
          ))}
        </div>
        <PreviewFooter constants={constants} doc="Déroulé pédagogique" />
      </div>
    </div>
  );
}

function Td({ children }) {
  return <td className="p-1.5 align-top" style={{ border: `1px solid ${LINE}`, wordBreak: "break-word" }}>{children}</td>;
}

function AutoArea({ v, on, bold }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  }, [v]);
  return (
    <textarea ref={ref} value={v} onChange={(e) => on(e.target.value)} rows={1}
      className="w-full bg-transparent outline-none resize-none overflow-hidden block"
      style={{ fontSize: 10, lineHeight: "1.35", color: bold ? NAVY : "#333", fontWeight: bold ? 700 : 400 }} />
  );
}
