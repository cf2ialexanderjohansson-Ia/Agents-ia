import { useEffect, useState } from "react";
import {
  FileText, CalendarClock, BookOpen, Library, Settings, Save, Plus, Printer,
  Download, Check, Trash2, X, Loader2, FileType2,
} from "lucide-react";
import {
  NAVY, ORANGE, LIGHT, GREY, LINE, EXAMPLE, blankFD, store,
} from "./store.js";
import { getApiKey, setApiKey } from "./ai.js";
import { downloadPDF } from "./pdf.js";
import { exportFicheDescriptiveWord } from "./exportWord.js";
import { exportDerouleExcel } from "./exportExcel.js";
import { exportSupportPptx } from "./exportPpt.js";
import { Action } from "./ui.jsx";
import FicheDescriptive from "./components/FicheDescriptive.jsx";
import Deroule from "./components/Deroule.jsx";
import Support from "./components/Support.jsx";

const TABS = [
  { id: "fd", label: "Fiche descriptive", icon: FileText },
  { id: "deroule", label: "Déroulé pédagogique", icon: CalendarClock },
  { id: "support", label: "Support de formation", icon: BookOpen },
];

export default function App() {
  const [fd, setFd] = useState(() => store.getCurrent() || EXAMPLE);
  const [constants, setConstants] = useState(() => store.getConstants());
  const [tab, setTab] = useState("fd");
  const [lib, setLib] = useState(() => store.list());
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(false);
  const [apiKey, setKey] = useState(() => getApiKey());
  const [pdfBusy, setPdfBusy] = useState(false);
  const [officeBusy, setOfficeBusy] = useState(false);

  useEffect(() => { store.setCurrent(fd); }, [fd]);
  useEffect(() => { store.setConstants(constants); }, [constants]);

  function doSave() {
    try { const rec = store.save(fd); setFd(rec); setLib(store.list()); setSaved(true); setTimeout(() => setSaved(false), 1600); }
    catch (e) { alert("Sauvegarde impossible (espace local plein ou visuels trop lourds)."); }
  }
  function newFD() { setFd(blankFD()); setTab("fd"); }
  function loadFD(id) { const r = store.load(id); if (r) { setFd(r); setTab("fd"); } }
  function delFD(id) { store.remove(id); setLib(store.list()); }

  async function doPDF() {
    const el = document.querySelector(".print-area");
    if (!el) { alert("Ouvrez un document (Fiche, Déroulé ou Support) avant de télécharger."); return; }
    const labels = { fd: "fiche-descriptive", deroule: "deroule", support: "support" };
    setPdfBusy(true);
    try { await downloadPDF(el, `${(fd.code || "formation")}_${labels[tab] || tab}.pdf`); }
    catch (e) { alert("Échec de génération du PDF : " + e.message); }
    finally { setPdfBusy(false); }
  }

  const OFFICE_EXPORT = {
    fd: { label: "Export Word", run: () => exportFicheDescriptiveWord(fd, constants, `${fd.code || "formation"}_fiche-descriptive.docx`) },
    deroule: { label: "Export Excel", run: () => exportDerouleExcel(fd, `${fd.code || "formation"}_deroule.xlsx`) },
    support: { label: "Export PowerPoint", run: () => exportSupportPptx(fd, constants, `${fd.code || "formation"}_support.pptx`) },
  }[tab];

  async function doOfficeExport() {
    if (!OFFICE_EXPORT) return;
    setOfficeBusy(true);
    try { await OFFICE_EXPORT.run(); }
    catch (e) { alert("Échec de l'export : " + e.message); }
    finally { setOfficeBusy(false); }
  }

  function saveKey() { setApiKey(apiKey); setSettings(false); }

  return (
    <div className="min-h-screen w-full" style={{ background: LIGHT }}>
      {/* TOP BAR */}
      <header className="no-print sticky top-0 z-30" style={{ background: "#ffffff", borderBottom: `1px solid ${LINE}` }}>
        <div className="max-w-[1500px] mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {constants.logo ? <img src={constants.logo} alt="CF2i" className="h-6 object-contain" /> : <span className="font-black tracking-tight text-lg" style={{ color: NAVY }}>CF2<span style={{ color: ORANGE }}>i</span></span>}
            <span className="text-[10px] tracking-[0.2em] font-semibold" style={{ color: GREY }}>KIT KCP</span>
          </div>
          <div className="flex-1" />
          <button onClick={doSave} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }}>{saved ? <Check size={15} color={ORANGE} /> : <Save size={15} />} {saved ? "Enregistré" : "Enregistrer"}</button>
          <button onClick={newFD} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }}><Plus size={15} /> Nouvelle</button>
          <button onClick={doPDF} disabled={pdfBusy} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md text-white disabled:opacity-60" style={{ background: ORANGE }}>{pdfBusy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} {pdfBusy ? "Génération…" : "Télécharger PDF"}</button>
          {OFFICE_EXPORT && (
            <button onClick={doOfficeExport} disabled={officeBusy} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-md disabled:opacity-60" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }}>
              {officeBusy ? <Loader2 size={15} className="animate-spin" /> : <FileType2 size={15} />} {officeBusy ? "Génération…" : OFFICE_EXPORT.label}
            </button>
          )}
          <button onClick={() => setSettings(true)} className="flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1.5 rounded-md" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }} title="Réglages"><Settings size={15} /></button>
        </div>
        {/* TABS */}
        <div className="max-w-[1500px] mx-auto px-4 flex gap-1 flex-wrap">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2" style={{ color: tab === t.id ? NAVY : GREY, borderBottom: `2px solid ${tab === t.id ? ORANGE : "transparent"}` }}>
              <t.icon size={15} /> {t.label}
            </button>
          ))}
          <button onClick={() => setTab("library")} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2" style={{ color: tab === "library" ? NAVY : GREY, borderBottom: `2px solid ${tab === "library" ? ORANGE : "transparent"}` }}>
            <Library size={15} /> Bibliothèque {lib.length ? `(${lib.length})` : ""}
          </button>
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 py-5">
        {tab === "fd" && <FicheDescriptive fd={fd} setFd={setFd} constants={constants} setConstants={setConstants} />}
        {tab === "deroule" && <Deroule fd={fd} setFd={setFd} constants={constants} />}
        {tab === "support" && <Support fd={fd} setFd={setFd} constants={constants} />}
        {tab === "library" && <LibraryView lib={lib} onLoad={loadFD} onDelete={delFD} onNew={newFD} />}
      </main>

      {settings && (
        <div className="no-print fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "#0009" }} onClick={() => setSettings(false)}>
          <div className="bg-white rounded-lg p-5 w-full max-w-md" style={{ border: `1px solid ${LINE}` }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold" style={{ color: NAVY }}>Réglages</h3>
              <button onClick={() => setSettings(false)}><X size={18} color={GREY} /></button>
            </div>
            <p className="text-xs mb-2" style={{ color: GREY }}>Clé API Anthropic pour la rédaction assistée. Stockée uniquement dans ce navigateur. Pour un usage partagé, passez plutôt par un backend proxy.</p>
            <input value={apiKey} onChange={(e) => setKey(e.target.value)} type="password" placeholder="sk-ant-..." className="w-full text-sm rounded-md border px-2.5 py-2 mb-3" style={{ borderColor: LINE }} />
            <button onClick={saveKey} className="w-full text-sm font-semibold text-white py-2 rounded-md" style={{ background: NAVY }}>Enregistrer la clé</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryView({ lib, onLoad, onDelete, onNew }) {
  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold" style={{ color: NAVY }}>Bibliothèque de formations</h2>
        <Action onClick={onNew} icon={<Plus size={15} />} label="Nouvelle formation" primary />
      </div>
      {lib.length === 0 ? (
        <div className="bg-white rounded-lg p-10 text-center shadow-sm" style={{ border: `1px solid ${LINE}` }}>
          <FileText size={32} style={{ color: GREY }} className="mx-auto mb-2" />
          <p style={{ color: GREY }}>Aucune formation enregistrée. Cliquez sur « Enregistrer » en haut.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lib.map((r) => (
            <div key={r.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col" style={{ border: `1px solid ${LINE}` }}>
              <div className="flex items-center justify-between mb-1">
                {r.code && <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: ORANGE }}>{r.code}</span>}
                <span className="text-[10px]" style={{ color: GREY }}>{new Date(r.ts).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="font-bold text-sm flex-1" style={{ color: NAVY }}>{r.titre || "Sans titre"}</div>
              <div className="text-[11px] mt-1 mb-3" style={{ color: GREY }}>{r.duree} · {r.niveau}</div>
              <div className="flex gap-2">
                <button onClick={() => onLoad(r.id)} className="flex-1 text-sm font-semibold text-white py-1.5 rounded-md" style={{ background: NAVY }}>Ouvrir</button>
                <button onClick={() => onDelete(r.id)} className="px-2.5 rounded-md" style={{ border: `1px solid ${LINE}`, color: "#c0392b" }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
