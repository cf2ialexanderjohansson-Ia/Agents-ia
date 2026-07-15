import { useEffect, useState } from "react";
import {
  FileText, CalendarClock, BookOpen, Library, Settings, Save, Plus,
  Download, Check, Trash2, X, Loader2, FileType2, FolderOpen, HardDrive,
} from "lucide-react";
import {
  NAVY, ORANGE, LIGHT, GREY, LINE, EXAMPLE, blankFD, store,
} from "./store.js";
import { getApiKey, setApiKey } from "./ai.js";
import { downloadPDF } from "./pdf.js";
import { exportFicheDescriptiveWord } from "./exportWord.js";
import { exportDerouleExcel } from "./exportExcel.js";
import { exportSupportPptx } from "./exportPpt.js";
import * as localFolder from "./localFolder.js";
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
  const [archiveConfig, setArchiveConfig] = useState(() => store.getArchiveConfig());
  const [folderHandle, setFolderHandle] = useState(null);
  const [folderPerm, setFolderPerm] = useState("unavailable"); // granted | prompt | denied | unavailable
  const [archiveMsg, setArchiveMsg] = useState("");

  useEffect(() => { store.setCurrent(fd); }, [fd]);
  useEffect(() => { store.setConstants(constants); }, [constants]);
  useEffect(() => { store.setArchiveConfig(archiveConfig); }, [archiveConfig]);

  useEffect(() => {
    (async () => {
      const handle = await localFolder.getSavedHandle();
      if (!handle) return;
      setFolderHandle(handle);
      setFolderPerm(await localFolder.checkPermission(handle));
    })();
  }, []);

  async function chooseArchiveFolder() {
    try {
      const handle = await localFolder.pickFolder();
      setFolderHandle(handle);
      setFolderPerm("granted");
      setArchiveConfig((c) => ({ ...c, folderName: handle.name }));
    } catch (e) { if (e.name !== "AbortError") alert("Impossible d'ouvrir le sélecteur de dossier : " + e.message); }
  }
  async function reauthorizeFolder() {
    const perm = await localFolder.requestPermission(folderHandle);
    setFolderPerm(perm);
  }
  async function forgetArchiveFolder() {
    await localFolder.forgetFolder();
    setFolderHandle(null);
    setFolderPerm("unavailable");
    setArchiveConfig((c) => ({ ...c, folderName: "", autoSave: false }));
  }
  async function archiveIfNeeded(blob, filename) {
    if (!archiveConfig.autoSave || !blob) return;
    if (!folderHandle) { setArchiveMsg("Aucun dossier NAS configuré (Réglages)."); return; }
    if (folderPerm !== "granted") { setArchiveMsg("Accès au dossier NAS à réactiver (Réglages)."); return; }
    try { await localFolder.saveFile(folderHandle, blob, filename); setArchiveMsg(`Archivé sur le NAS : ${filename}`); }
    catch (e) { setArchiveMsg(""); alert("Archivage NAS impossible : " + e.message); }
  }

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
    const filename = `${(fd.code || "formation")}_${labels[tab] || tab}.pdf`;
    setPdfBusy(true);
    try { const blob = await downloadPDF(el, filename); await archiveIfNeeded(blob, filename); }
    catch (e) { alert("Échec de génération du PDF : " + e.message); }
    finally { setPdfBusy(false); }
  }

  const OFFICE_EXPORT = {
    fd: { label: "Export Word", filename: `${fd.code || "formation"}_fiche-descriptive.docx`, run: (fn) => exportFicheDescriptiveWord(fd, constants, fn) },
    deroule: { label: "Export Excel", filename: `${fd.code || "formation"}_deroule.xlsx`, run: (fn) => exportDerouleExcel(fd, fn) },
    support: { label: "Export PowerPoint", filename: `${fd.code || "formation"}_support.pptx`, run: (fn) => exportSupportPptx(fd, constants, fn) },
  }[tab];

  async function doOfficeExport() {
    if (!OFFICE_EXPORT) return;
    setOfficeBusy(true);
    try { const blob = await OFFICE_EXPORT.run(OFFICE_EXPORT.filename); await archiveIfNeeded(blob, OFFICE_EXPORT.filename); }
    catch (e) { alert("Échec de l'export : " + e.message); }
    finally { setOfficeBusy(false); }
  }

  function saveKey() { setApiKey(apiKey); setSettings(false); }

  const NAV = [...TABS, { id: "library", label: "Bibliothèque", icon: Library, count: lib.length }];
  const pageTitle = tab === "library" ? "Bibliothèque de formations" : (fd.titre || "Nouvelle formation");

  return (
    <div className="min-h-screen w-full flex" style={{ background: LIGHT }}>
      {/* SIDEBAR (desktop) */}
      <aside className="no-print hidden lg:flex flex-col w-64 shrink-0" style={{ background: "#ffffff", borderRight: `1px solid ${LINE}` }}>
        <div className="h-16 flex items-center gap-2 px-5 shrink-0" style={{ borderBottom: `1px solid ${LINE}` }}>
          {constants.logo ? <img src={constants.logo} alt="CF2i" className="h-7 object-contain" /> : <span className="font-black tracking-tight text-lg" style={{ color: NAVY }}>CF2<span style={{ color: ORANGE }}>i</span></span>}
          <div className="leading-none">
            <div className="text-[10px] tracking-[0.18em] font-bold" style={{ color: GREY }}>KIT KCP</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="relative w-full flex items-center gap-2.5 text-[13.5px] font-semibold px-3 py-2.5 rounded-lg transition-colors duration-150"
                style={active ? { background: "#FFF3EA", color: NAVY } : { background: "transparent", color: "#4B5768" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#F3F5F8"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span className="relative shrink-0">
                  <t.icon size={17} color={active ? ORANGE : "#8592A3"} />
                </span>
                <span className="flex-1 text-left truncate">{t.label}</span>
                {typeof t.count === "number" && t.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: active ? ORANGE : "#E7EAEF", color: active ? "#fff" : "#4B5768" }}>{t.count}</span>
                )}
                {active && <span className="absolute right-0 w-1 h-5 rounded-full" style={{ background: ORANGE }} />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 shrink-0" style={{ borderTop: `1px solid ${LINE}` }}>
          <button onClick={() => setSettings(true)} className="w-full flex items-center gap-2.5 text-[13.5px] font-semibold px-3 py-2.5 rounded-lg transition-colors duration-150" style={{ color: "#4B5768" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F5F8")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            <Settings size={17} color="#8592A3" /> Réglages
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* HEADER */}
        <header className="no-print sticky top-0 z-30 h-16 shrink-0 flex items-center gap-3 px-4 lg:px-6" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${LINE}` }}>
          <div className="flex items-center gap-2 lg:hidden">
            {constants.logo ? <img src={constants.logo} alt="CF2i" className="h-6 object-contain" /> : <span className="font-black tracking-tight" style={{ color: NAVY }}>CF2<span style={{ color: ORANGE }}>i</span></span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: GREY }}>{tab === "library" ? "Bibliothèque" : (fd.code || "Formation")}</div>
            <div className="font-bold truncate text-[15px]" style={{ color: NAVY }}>{pageTitle}</div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Action onClick={doSave} icon={saved ? <Check size={15} color={ORANGE} /> : <Save size={15} />} label={saved ? "Enregistré" : "Enregistrer"} />
            <Action onClick={newFD} icon={<Plus size={15} />} label="Nouvelle" />
            <Action onClick={doPDF} disabled={pdfBusy} icon={pdfBusy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} label={pdfBusy ? "Génération…" : "PDF"} primary />
            {OFFICE_EXPORT && (
              <Action onClick={doOfficeExport} disabled={officeBusy} icon={officeBusy ? <Loader2 size={15} className="animate-spin" /> : <FileType2 size={15} />} label={officeBusy ? "Génération…" : OFFICE_EXPORT.label} />
            )}
          </div>
          <button onClick={() => setSettings(true)} className="sm:hidden p-2 rounded-lg" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }} title="Réglages"><Settings size={16} /></button>
        </header>

        {/* TABS (mobile fallback) */}
        <div className="no-print flex lg:hidden gap-1 px-4 pt-2 overflow-x-auto" style={{ background: "#ffffff", borderBottom: `1px solid ${LINE}` }}>
          {NAV.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 whitespace-nowrap" style={{ color: tab === t.id ? NAVY : GREY, borderBottom: `2px solid ${tab === t.id ? ORANGE : "transparent"}` }}>
              <t.icon size={15} /> {t.label}{typeof t.count === "number" && t.count ? ` (${t.count})` : ""}
            </button>
          ))}
        </div>

        {/* mobile action row */}
        <div className="no-print flex sm:hidden gap-2 px-4 py-2 overflow-x-auto" style={{ background: "#ffffff", borderBottom: `1px solid ${LINE}` }}>
          <Action onClick={doSave} icon={saved ? <Check size={15} color={ORANGE} /> : <Save size={15} />} label={saved ? "Enregistré" : "Enregistrer"} />
          <Action onClick={newFD} icon={<Plus size={15} />} label="Nouvelle" />
          <Action onClick={doPDF} disabled={pdfBusy} icon={<Download size={15} />} label="PDF" primary />
          {OFFICE_EXPORT && <Action onClick={doOfficeExport} disabled={officeBusy} icon={<FileType2 size={15} />} label={OFFICE_EXPORT.label} />}
        </div>

        <main className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
          {tab === "fd" && <FicheDescriptive fd={fd} setFd={setFd} constants={constants} setConstants={setConstants} />}
          {tab === "deroule" && <Deroule fd={fd} setFd={setFd} constants={constants} />}
          {tab === "support" && <Support fd={fd} setFd={setFd} constants={constants} />}
          {tab === "library" && <LibraryView lib={lib} onLoad={loadFD} onDelete={delFD} onNew={newFD} />}
        </main>
      </div>

      {settings && (
        <div className="no-print fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }} onClick={() => setSettings(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto" style={{ border: `1px solid ${LINE}`, boxShadow: "0 20px 60px rgba(15,23,42,0.25)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: NAVY }}>Réglages</h3>
              <button onClick={() => setSettings(false)} className="p-1.5 rounded-lg transition-colors" onMouseEnter={(e) => (e.currentTarget.style.background = LIGHT)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}><X size={18} color={GREY} /></button>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: GREY }}>Rédaction assistée</div>
            <p className="text-xs mb-2" style={{ color: GREY }}>Clé API Anthropic pour la rédaction assistée. Stockée uniquement dans ce navigateur. Pour un usage partagé, passez plutôt par un backend proxy.</p>
            <input value={apiKey} onChange={(e) => setKey(e.target.value)} type="password" placeholder="sk-ant-..." className="w-full text-sm rounded-lg border px-3 py-2 mb-3 outline-none" style={{ borderColor: LINE }} />
            <button onClick={saveKey} className="w-full text-sm font-semibold text-white py-2.5 rounded-lg transition-transform active:scale-[0.98]" style={{ background: NAVY }}>Enregistrer la clé</button>

            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: "#FFF3EA" }}><HardDrive size={14} color={ORANGE} /></span>
                <span className="font-bold text-[13.5px]" style={{ color: NAVY }}>Archivage automatique (dossier NAS)</span>
              </div>
              {!localFolder.isSupported() ? (
                <p className="text-xs" style={{ color: GREY }}>Fonctionnalité disponible sur Chrome ou Edge (ordinateur) uniquement.</p>
              ) : (
                <>
                  <p className="text-xs mb-2" style={{ color: GREY }}>Choisissez un dossier (ex. votre lecteur réseau NAS monté) : chaque export PDF/Word/Excel/PowerPoint y sera aussi enregistré automatiquement.</p>
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs rounded-lg px-3 py-2.5" style={{ background: LIGHT, border: `1px solid ${LINE}` }}>
                    <span style={{ color: NAVY }} className="font-semibold truncate">{archiveConfig.folderName || "Aucun dossier sélectionné"}</span>
                    {folderHandle && (
                      <span className="shrink-0 font-semibold px-1.5 py-0.5 rounded-full" style={{ color: folderPerm === "granted" ? "#15803d" : "#fff", background: folderPerm === "granted" ? "#DCFCE7" : ORANGE }}>
                        {folderPerm === "granted" ? "Autorisé" : "À réactiver"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Action onClick={chooseArchiveFolder} icon={<FolderOpen size={13} />} label="Choisir un dossier…" />
                    {folderHandle && folderPerm !== "granted" && <Action onClick={reauthorizeFolder} icon={null} label="Réactiver l'accès" primary />}
                    {folderHandle && (
                      <button onClick={forgetArchiveFolder} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors" style={{ color: "#c0392b" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>Oublier ce dossier</button>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer" style={{ color: folderHandle ? NAVY : GREY }}>
                    <input type="checkbox" checked={archiveConfig.autoSave} disabled={!folderHandle} onChange={(e) => setArchiveConfig((c) => ({ ...c, autoSave: e.target.checked }))} />
                    Archiver automatiquement mes exports dans ce dossier
                  </label>
                  {archiveMsg && <p className="text-[11px] mt-2" style={{ color: GREY }}>{archiveMsg}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LibraryView({ lib, onLoad, onDelete, onNew }) {
  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: NAVY }}>Bibliothèque de formations</h2>
          <p className="text-xs mt-0.5" style={{ color: GREY }}>{lib.length} formation{lib.length > 1 ? "s" : ""} enregistrée{lib.length > 1 ? "s" : ""}</p>
        </div>
        <Action onClick={onNew} icon={<Plus size={15} />} label="Nouvelle formation" primary />
      </div>
      {lib.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center" style={{ border: `1px dashed #C7CFDA` }}>
          <div className="inline-flex items-center justify-center rounded-full mb-3" style={{ width: 48, height: 48, background: LIGHT }}>
            <FileText size={22} style={{ color: GREY }} />
          </div>
          <p style={{ color: GREY }}>Aucune formation enregistrée. Cliquez sur « Enregistrer » en haut.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {lib.map((r) => (
            <div key={r.id} className="bg-white rounded-xl p-4 flex flex-col transition-shadow duration-150"
              style={{ border: `1px solid ${LINE}`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)")}>
              <div className="flex items-center justify-between mb-1.5">
                {r.code && <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: ORANGE }}>{r.code}</span>}
                <span className="text-[10px]" style={{ color: GREY }}>{new Date(r.ts).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="font-bold text-sm flex-1" style={{ color: NAVY }}>{r.titre || "Sans titre"}</div>
              <div className="text-[11px] mt-1 mb-3" style={{ color: GREY }}>{r.duree} · {r.niveau}</div>
              <div className="flex gap-2">
                <button onClick={() => onLoad(r.id)} className="flex-1 text-sm font-semibold text-white py-1.5 rounded-lg transition-transform active:scale-[0.98]" style={{ background: NAVY }}>Ouvrir</button>
                <button onClick={() => onDelete(r.id)} className="px-2.5 rounded-lg transition-colors" style={{ border: `1px solid ${LINE}`, color: "#c0392b" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
