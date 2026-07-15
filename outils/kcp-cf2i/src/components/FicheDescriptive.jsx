import { useState } from "react";
import { FileText, Sparkles, Loader2, SlidersHorizontal, ImagePlus, X } from "lucide-react";
import {
  NAVY, NAVY2, ORANGE, LIGHT, GREY, LINE, SUBTLE, CATEGORIES, lines, parseProgramme, imgToDataURL,
} from "../store.js";
import {
  Panel, Toggle, Field, Select, Area, Uploader, Bullets, AccentCard, DayLabel, Logo, PreviewHeader, PreviewFooter,
} from "../ui.jsx";
import { callClaude } from "../ai.js";

export default function FicheDescriptive({ fd, setFd, constants, setConstants }) {
  const [showAI, setShowAI] = useState(true);
  const [showImg, setShowImg] = useState(false);
  const [showConst, setShowConst] = useState(false);
  const [brief, setBrief] = useState("");
  const [ai, setAi] = useState({ loading: false, msg: "" });

  const set = (k, v) => setFd((p) => ({ ...p, [k]: v }));
  const setC = (next) => setConstants(next);

  async function onLogo(e) { const f = e.target.files[0]; if (!f) return; setC({ ...constants, logo: await imgToDataURL(f, 360, "image/png", 1) }); e.target.value = ""; }
  async function onHero(e) { const f = e.target.files[0]; if (!f) return; set("hero", await imgToDataURL(f, 900, "image/jpeg", 0.82)); e.target.value = ""; }
  async function onSoftware(e) {
    const files = Array.from(e.target.files || []); if (!files.length) return;
    const outs = []; for (const f of files) outs.push(await imgToDataURL(f, 280, "image/png", 1));
    setFd((p) => ({ ...p, softwareLogos: [...(p.softwareLogos || []), ...outs] })); e.target.value = "";
  }
  const removeSoftware = (i) => setFd((p) => ({ ...p, softwareLogos: p.softwareLogos.filter((_, j) => j !== i) }));

  async function aiSheet() {
    if (!brief.trim()) return setAi({ loading: false, msg: "Décrivez la formation en quelques mots." });
    setAi({ loading: true, msg: "Rédaction…" });
    const prompt = `Tu rédiges une fiche de formation CF2i (drone/agricole). Renvoie UNIQUEMENT un JSON valide :
{"titre":string,"accroche":string,"niveau":"Débutant"|"Intermédiaire"|"Avancé","duree":string,"format":string,"objectifs":string[],"logiciels":string[]}
Terminologie réglementaire exacte si pertinent (STS-01, ZGU, DSAC, SORA). BRIEF : ${brief}`;
    try {
      const j = JSON.parse(await callClaude(prompt));
      setFd((p) => ({ ...p, titre: j.titre || p.titre, accroche: j.accroche || p.accroche, niveau: j.niveau || p.niveau, duree: j.duree || p.duree, format: j.format || p.format, objectifs: (j.objectifs || []).join("\n") || p.objectifs, logiciels: (j.logiciels || []).join("\n") || p.logiciels }));
      setAi({ loading: false, msg: "Fiche rédigée." });
    } catch (e) { setAi({ loading: false, msg: e.message }); }
  }
  async function aiProg() {
    if (!fd.titre && !brief.trim()) return setAi({ loading: false, msg: "Renseignez un titre ou un brief." });
    setAi({ loading: true, msg: "Programme…" });
    const prompt = `Génère le PROGRAMME d'une formation CF2i en texte brut :
JOUR 1 — <titre>
## <Section>
- <point>
(répète, ligne vide avant chaque JOUR). Adapte au nombre de jours.
TITRE : ${fd.titre}  DURÉE : ${fd.duree}  OBJECTIFS : ${fd.objectifs}  BRIEF : ${brief}`;
    try { set("programme", (await callClaude(prompt)).replace(/^```[a-z]*/gi, "").replace(/```$/g, "").trim()); setAi({ loading: false, msg: "Programme généré." }); }
    catch (e) { setAi({ loading: false, msg: e.message }); }
  }

  const days = parseProgramme(fd.programme);
  const prereq = lines(fd.prerequis || constants.prerequis);
  const modeval = lines(fd.modalitesEval || constants.modalitesEval);
  const stats = (constants.satisfactionStats || {})[fd.categorie] || {};
  const A = ORANGE, N = NAVY; // accents alternés

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* ----------------- ÉDITEUR ----------------- */}
      <div className="no-print space-y-4">
        <Panel>
          <Toggle open={showAI} onClick={() => setShowAI(v => !v)} icon={<Sparkles size={17} style={{ color: ORANGE }} />} title="Rédaction assistée" hint="brief → fiche" />
          {showAI && (
            <div className="mt-3 space-y-2">
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={3} placeholder="Ex. : 2 jours d'initiation télépilotage STS-01 pour exploitants viticoles…" className="w-full text-sm rounded-md border p-2.5" style={{ borderColor: LINE }} />
              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={aiSheet} disabled={ai.loading} className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-2 rounded-md disabled:opacity-60" style={{ background: NAVY }}>{ai.loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Rédiger la fiche</button>
                <button onClick={aiProg} disabled={ai.loading} className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md disabled:opacity-60" style={{ background: "#fff", color: NAVY, border: `1px solid ${LINE}` }}>{ai.loading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />} Générer le programme</button>
                {ai.msg && <span className="text-xs" style={{ color: GREY }}>{ai.msg}</span>}
              </div>
            </div>
          )}
        </Panel>

        <Panel>
          <Toggle open={showImg} onClick={() => setShowImg(v => !v)} icon={<ImagePlus size={17} style={{ color: ORANGE }} />} title="Visuels" hint="logo · en-tête · logos logiciels" />
          {showImg && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Uploader label="Logo CF2i" hint="PNG transparent" img={constants.logo} onPick={onLogo} onClear={() => setC({ ...constants, logo: "" })} thumbBg={NAVY} />
              <Uploader label="Image d'en-tête" hint="photo couverture" img={fd.hero} onPick={onHero} onClear={() => set("hero", "")} />
              <div className="sm:col-span-2">
                <div className="text-[11px] font-semibold mb-1" style={{ color: GREY }}>Logos logiciels</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {(fd.softwareLogos || []).map((s, i) => (
                    <div key={i} className="relative rounded-md p-1.5" style={{ border: `1px solid ${LINE}`, background: "#fff" }}>
                      <img src={s} alt="" className="h-11 object-contain" />
                      <button onClick={() => removeSoftware(i)} className="absolute -top-2 -right-2 rounded-full p-0.5" style={{ background: "#fff", border: `1px solid ${LINE}` }}><X size={12} color="#c0392b" /></button>
                    </div>
                  ))}
                  <label className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md cursor-pointer" style={{ background: "#fff", color: NAVY, border: `1px dashed ${GREY}` }}>
                    <ImagePlus size={15} /> Ajouter<input type="file" accept="image/*" multiple className="hidden" onChange={onSoftware} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Identité">
          <div className="grid grid-cols-3 gap-2">
            <Field label="Code" v={fd.code} onChange={(v) => set("code", v)} placeholder="DP-DAG-A" />
            <Field label="Durée" v={fd.duree} onChange={(v) => set("duree", v)} placeholder="3 jours · 21 h" />
            <Select label="Niveau" v={fd.niveau} onChange={(v) => set("niveau", v)} options={["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"]} />
            <Field label="Modalité" v={fd.modalite} onChange={(v) => set("modalite", v)} placeholder="Présentiel / distanciel" />
            <Field label="Format" v={fd.format} onChange={(v) => set("format", v)} placeholder="Inter · 3 à 5 pers." />
            <Select label="Catégorie (stats stagiaires)" v={fd.categorie} onChange={(v) => set("categorie", v)} options={CATEGORIES} />
          </div>
          <Field label="Titre" v={fd.titre} onChange={(v) => set("titre", v)} placeholder="Intitulé" />
          <Area label="Accroche" v={fd.accroche} onChange={(v) => set("accroche", v)} rows={3} />
        </Panel>

        <Panel title="Contenu">
          <Area label="Objectifs opérationnels (1 / ligne)" v={fd.objectifs} onChange={(v) => set("objectifs", v)} rows={5} />
          <Area label="Logiciels (Nom — description)" v={fd.logiciels} onChange={(v) => set("logiciels", v)} rows={2} />
          <Area label="Prérequis — vide = défaut" v={fd.prerequis} onChange={(v) => set("prerequis", v)} rows={2} placeholder={constants.prerequis} />
          <Area label="Modalités d'évaluation — vide = défaut" v={fd.modalitesEval} onChange={(v) => set("modalitesEval", v)} rows={2} placeholder={constants.modalitesEval} />
        </Panel>

        <Panel title="Programme (partagé avec déroulé & support)">
          <p className="text-xs mb-1.5" style={{ color: GREY }}>Format : <code>JOUR 1 — titre</code> · <code>## Section</code> · <code>- point</code></p>
          <Area label="" v={fd.programme} onChange={(v) => set("programme", v)} rows={12} mono />
        </Panel>

        <Panel>
          <Toggle open={showConst} onClick={() => setShowConst(v => !v)} icon={<SlidersHorizontal size={16} style={{ color: ORANGE }} />} title="Constantes" hint="communes · enregistrées" />
          {showConst && (
            <div className="mt-3 space-y-2">
              <Area label="Accès, délais & accessibilité" v={constants.acces} onChange={(v) => setC({ ...constants, acces: v })} rows={3} />
              <Area label="Méthodes mobilisées" v={constants.methodes} onChange={(v) => setC({ ...constants, methodes: v })} rows={3} />
              <Area label="Moyens humains & matériels" v={constants.moyens} onChange={(v) => setC({ ...constants, moyens: v })} rows={3} />
              <Area label="Prérequis par défaut" v={constants.prerequis} onChange={(v) => setC({ ...constants, prerequis: v })} rows={2} />
              <Area label="Modalités d'évaluation par défaut" v={constants.modalitesEval} onChange={(v) => setC({ ...constants, modalitesEval: v })} rows={2} />
              <Area label="Accessibilité" v={constants.accessibilite} onChange={(v) => setC({ ...constants, accessibilite: v })} rows={2} />
              <Area label="Dates des sessions" v={constants.sessionsInfo} onChange={(v) => setC({ ...constants, sessionsInfo: v })} rows={1} />

              <div className="text-[11px] font-semibold pt-1" style={{ color: GREY }}>Satisfaction stagiaires — par catégorie</div>
              {CATEGORIES.map((cat) => {
                const s = (constants.satisfactionStats || {})[cat] || {};
                const setStat = (k, v) => setC({ ...constants, satisfactionStats: { ...constants.satisfactionStats, [cat]: { ...s, [k]: v } } });
                return (
                  <div key={cat} className="rounded-md p-2" style={{ border: `1px solid ${LINE}` }}>
                    <div className="text-[11px] font-bold mb-1" style={{ color: NAVY }}>{cat}</div>
                    <div className="grid grid-cols-4 gap-2">
                      <Field label="Stagiaires" v={s.nbStagiaires} onChange={(v) => setStat("nbStagiaires", v)} />
                      <Field label="Objectifs" v={s.tauxObjectifs} onChange={(v) => setStat("tauxObjectifs", v)} />
                      <Field label="Satisfaction" v={s.satisfaction} onChange={(v) => setStat("satisfaction", v)} />
                      <Field label="Certification" v={s.certification} onChange={(v) => setStat("certification", v)} />
                    </div>
                    <Area label="Note / période de référence" v={s.note} onChange={(v) => setStat("note", v)} rows={2} />
                  </div>
                );
              })}

              <div className="grid grid-cols-2 gap-2">
                <Field label="Téléphone" v={constants.tel} onChange={(v) => setC({ ...constants, tel: v })} />
                <Field label="Email" v={constants.email} onChange={(v) => setC({ ...constants, email: v })} />
              </div>
              <Area label="Mention légale" v={constants.legal} onChange={(v) => setC({ ...constants, legal: v })} rows={2} />
            </div>
          )}
        </Panel>
      </div>

      {/* ----------------- APERÇU ----------------- */}
      <div>
        <div className="print-area lg:sticky lg:top-6 space-y-5">
          {/* PAGE 1 */}
          <div className="fd-page bg-white rounded-lg overflow-hidden shadow-sm" style={{ border: `1px solid ${LINE}` }}>
            {/* en-tête avec encart photo */}
            <div style={{ background: LIGHT }}>
              <div className="px-7 pt-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span style={{ width: 16, height: 2, background: ORANGE }} />
                  <span className="font-bold uppercase" style={{ color: ORANGE, fontSize: 10, letterSpacing: "0.22em" }}>FICHE DESCRIPTIVE{fd.code ? ` · ${fd.code}` : ""}</span>
                </div>
                <div className="shrink-0"><Logo constants={constants} /></div>
              </div>
              <div className="px-7 pb-5 pt-3 flex gap-5 items-stretch">
                <div className="flex-1 min-w-0">
                  <h1 className="font-extrabold leading-tight" style={{ color: NAVY, fontSize: 25 }}>{fd.titre || "Intitulé de la formation"}</h1>
                  {fd.accroche && <p className="mt-2" style={{ color: GREY, fontSize: 12, lineHeight: 1.5 }}>{fd.accroche}</p>}
                </div>
                {fd.hero && <div className="w-[36%] shrink-0"><img src={fd.hero} alt="" className="w-full h-full object-cover rounded-lg" style={{ maxHeight: 160, border: `1px solid ${LINE}` }} /></div>}
              </div>
            </div>
            {/* bandeau méta */}
            <div className="grid grid-cols-4" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
              {[["DURÉE", fd.duree], ["MODALITÉ", fd.modalite], ["FORMAT", fd.format], ["NIVEAU", fd.niveau]].map(([k, v], i) => (
                <div key={k} className="px-3 py-2.5" style={{ borderLeft: i ? `1px solid ${LINE}` : "none" }}>
                  <div className="font-semibold uppercase" style={{ color: GREY, fontSize: 8, letterSpacing: "0.14em" }}>{k}</div>
                  <div className="font-bold mt-0.5" style={{ color: NAVY, fontSize: 11 }}>{v || "—"}</div>
                </div>
              ))}
            </div>
            {/* corps : cartes à barre d'accent */}
            <div className="p-5 grid grid-cols-2 gap-3" style={{ background: LIGHT }}>
              <AccentCard accent={A} title="Objectifs opérationnels"><Bullets items={lines(fd.objectifs)} /></AccentCard>
              <AccentCard accent={N} title="Logiciels">
                {(fd.softwareLogos || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-2 justify-center">
                    {fd.softwareLogos.map((s, i) => <img key={i} src={s} alt="" className="h-16 object-contain" />)}
                  </div>
                )}
                <div className="space-y-1">
                  {lines(fd.logiciels).map((it, i) => {
                    const [name, ...rest] = it.split("—");
                    return <div key={i} className="text-[10px] leading-snug" style={{ color: "#374350" }}><span className="font-bold" style={{ color: NAVY }}>{name.trim()}</span>{rest.length ? <span style={{ color: GREY }}> — {rest.join("—").trim()}</span> : null}</div>;
                  })}
                </div>
              </AccentCard>
              <AccentCard accent={A} title="Prérequis"><Bullets items={prereq} /></AccentCard>
              <AccentCard accent={N} title="Modalités d'évaluation"><Bullets items={modeval} /></AccentCard>
              <AccentCard accent={A} title="Accès, délais & accessibilité"><Bullets items={lines(constants.acces)} /></AccentCard>
              <AccentCard accent={N} title="Méthodes mobilisées"><Bullets items={lines(constants.methodes)} /></AccentCard>
              <AccentCard accent={A} full title="Moyens humains & matériels"><Bullets items={lines(constants.moyens)} /></AccentCard>

              {/* encadré satisfaction */}
              <div className="col-span-2" style={{ background: "#fff", border: `1px solid ${LINE}`, borderLeft: `3px solid ${ORANGE}`, borderRadius: 4, padding: 14 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold" style={{ color: NAVY, fontSize: 12 }}>Satisfaction stagiaires — {fd.categorie}</span>
                  <span style={{ color: ORANGE, letterSpacing: 2 }}>★★★★★</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <Stat n={stats.nbStagiaires} l="Stagiaires formés" />
                  <Stat n={stats.tauxObjectifs} l="Atteinte des objectifs" />
                  <Stat n={stats.satisfaction} l="Satisfaction stagiaires" />
                  <Stat n={stats.certification} l="Réussite certification" />
                </div>
                {lines(stats.note).map((l, i) => <p key={i} className="text-[8px] mt-1" style={{ color: GREY }}>{l}</p>)}
              </div>
            </div>
            <PreviewFooter constants={constants} doc="Fiche descriptive" />
          </div>

          {/* PAGE 2 — PROGRAMME */}
          <div className="fd-page bg-white rounded-lg overflow-hidden shadow-sm" style={{ border: `1px solid ${LINE}` }}>
            <PreviewHeader constants={constants} eyebrow="PROGRAMME" code={fd.code} title={fd.titre || "Programme de la formation"} sub={fd.duree} />
            <div className="px-7 py-4 space-y-4" style={{ background: LIGHT }}>
              {days.length === 0 && <p className="text-sm" style={{ color: GREY }}>Le programme s'affichera ici.</p>}
              {days.map((d, i) => (
                <div key={i}>
                  <DayLabel>{d.title || `Jour ${i + 1}`}</DayLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {d.sections.map((s, j) => (
                      <AccentCard key={j} accent={j % 2 ? NAVY : ORANGE} title={s.title}><Bullets items={s.bullets} /></AccentCard>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <PreviewFooter constants={constants} doc="Programme" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }) {
  return <div className="bg-white rounded" style={{ border: `1px solid ${LINE}`, padding: "8px 4px" }}><div className="font-extrabold" style={{ color: ORANGE, fontSize: 17 }}>{n}</div><div className="mt-0.5" style={{ color: GREY, fontSize: 8, lineHeight: 1.2 }}>{l}</div></div>;
}
