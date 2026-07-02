// Modèle de données partagé par les 3 documents du kit KCP + persistance locale.

export const NAVY = "#15293F";
export const NAVY2 = "#111C2C";
export const ORANGE = "#ED6F08";
export const LIGHT = "#F4F6F8";
export const GREY = "#6B7A8D";
export const LINE = "#E5E9EF";
export const SUBTLE = "#96A9BE";

export const DEFAULT_CONSTANTS = {
  logo: "",
  prerequis:
    "Être âgé de 16 ans ou plus\nConnaissances informatiques de base (PC/Mac)\nMaîtrise de la langue française",
  modalitesEval:
    "Évaluation progressive « étape par étape » via un livret de progression renseigné avec le formateur\nÉvaluation d'une mise en situation professionnelle",
  acces:
    "Entretien téléphonique obligatoire puis envoi du devis ; formation accessible sous 2 à 6 semaines\nPlanning par centre sur www.cf2i-formation.fr ; date et lieu formalisés dans la convention\nAménagements possibles pour les personnes en situation de handicap (loi du 11/02/2005)",
  methodes:
    "Matériel drone complet pour l'apprentissage et la découverte\nEspaces de vol pour exercices d'apprentissage et d'entraînement\nTravaux pratiques : prise en main et mise en situation réelle",
  moyens:
    "Formateur CF2i télépilote avec expérience significative ; support stagiaire remis en début de stage\nDrones écoles, drones d'entraînement, simulateurs de vol et plateforme de révision en ligne\nCf. Fiche Modalité Pratique de Formation Drone (FMPFD)",
  nbStagiaires: "360",
  periode: "Période de référence : du 1ᵉʳ janvier 2024 au 31 mai 2026.",
  tauxObjectifs: "100 %",
  satisfaction: "96 %",
  certification: "91 %",
  tel: "09 72 10 74 94",
  email: "drone@cf2i.fr",
  legal:
    "CF2i · SARL Clic & Bat · Capital 10 000 € · SIRET 794 691 402 00042 · N° déclar. d'activité 72 33 09201 33 · 5 rue du Golf, 33700 Mérignac · www.cf2i-formation.fr",
};

export const EXAMPLE_PROGRAMME = `JOUR 1 — Formation théorique
## Rappels réglementaires & machine
- Scénarios STS-01, STS-02 et catégorie Spécifique (autorisation DGAC / DSAC)
- Machine et composants : châssis, contrôleur de vol, navigation GNSS, capteurs, module de traitement
- Batteries (LiPo, Li-Ion, LiHV) : SOC, autonomie, cycles de charge, détection de défaillance
## Plan de vol
- Supports : DJI Pilot 2, SmartFarm, Mission Planner, QGroundControl, import RPG, Géoportail
- Détourage parcellaire, buffer de sécurité, formats KML / KMZ (projection WGS84)
- Zones de contingence, tampon, adjacente, géographique (ZGU) ; geofencing
## Radiocommande
- Fonctions : modes 1 et 2, switchs programmables, modes de vol, fail-safe, télémétrie
- Intégration d'un plan de vol : point de retour (RTH), simulation, mission automatique
## Traitement phytosanitaire
- Paramètres de traitement : débit kg/ha et L/ha, calibration de la pompe
- Buses (anti-dérive, rotatives) et pompes : pression, gouttelettes (VMD), débit
- Impact météo (vent, température, humidité, inversion) ; réglementation et traçabilité

JOUR 2 — Pratique : prise en main & vol
## Appréhension de la machine
- Tailles, poids, comportement en vol : MTOW, centre de gravité, inertie
- Composants : démontage / remontage, remplacement des pièces d'usure
## Module de traitement — liquide
- Réservoir, pompe, buses, capteur de débit : montage, étalonnage, contrôle
- Nettoyage et stockage du module ; exercices pratiques (×4)
## Préparation du vol & sécurité
- Briefing pré-vol : météo, ZGU, NOTAM, rôles de l'équipage, procédures d'urgence
- Décollage : check-list, signal GPS, test liaison et débit
## Vol sous contrôle
- Prise en main progressive : stationnaire, translations, rotations, montées / descentes
- Mission automatique, surveillance continue, gestion du vent et de l'autonomie

JOUR 3 — Pratique avancée & évaluation
## Module de traitement — solide (granulés)
- Trémie, diffuseur centrifuge, capteur de masse : réglage et étalonnage
- Nettoyage et stockage du module ; exercices pratiques (×4)
## Atterrissage, analyse & traçabilité
- Atterrissage normal et d'urgence, rinçage du circuit
- Analyse des logs : trajectoire, anomalies, consommations énergie / produit
- Traçabilité : registre de vol, audit DSAC (3 ans), cahier phytosanitaire
## Conclusion & évaluation
- Évaluation théorique : QCM réglementation SORA et rédaction d'un ConOps simplifié
- Évaluation pratique : vol de démonstration autonome, calibration pompe et traitement, analyse de logs post-vol`;

export const EXAMPLE = {
  code: "DP-DAG-A",
  titre: "Pratique du drone pour la pulvérisation agricole",
  accroche:
    "Formation dédiée à la maîtrise des drones professionnels et à la spécialisation en pulvérisation par drone. Elle s'adresse aux professionnels du secteur agricole souhaitant intégrer la pulvérisation par drone dans leurs pratiques, en toute sécurité et conformité réglementaire.",
  duree: "3 jours · 21 h",
  modalite: "Présentiel / distanciel",
  format: "Inter · 3 à 5 pers.",
  niveau: "Débutant",
  hero: "",
  softwareLogos: [],
  objectifs:
    "Préparer et sécuriser une mission de pulvérisation par drone\nÉlaborer et charger un plan de vol conforme (détourage parcellaire, geofencing, ZGU)\nRégler le matériel de traitement (buses, pompe, débit) selon la culture et la météo\nPiloter le drone en mission automatique et gérer les situations d'urgence\nAssurer la traçabilité réglementaire (registre de vol, cahier phytosanitaire, audit DSAC)",
  logiciels:
    "Pix4Dfields — cartographie et cartes de prescription\nDJI SmartFarm — planification et supervision de vol",
  prerequis: "",
  modalitesEval: "",
  programme: EXAMPLE_PROGRAMME,
  // documents dérivés (générés depuis le programme, puis éditables)
  deroule: null,
  support: null,
};

export const blankFD = () => ({
  code: "", titre: "", accroche: "", duree: "", modalite: "Présentiel / distanciel",
  format: "", niveau: "Débutant", hero: "", softwareLogos: [], objectifs: "",
  logiciels: "", prerequis: "", modalitesEval: "", programme: "", deroule: null, support: null,
});

export const lines = (s) => (s || "").split("\n").map((x) => x.trim()).filter(Boolean);

export function parseProgramme(text) {
  const days = [];
  let day = null, section = null;
  (text || "").split("\n").forEach((raw) => {
    const l = raw.trim();
    if (!l) return;
    if (/^jour\b/i.test(l)) { day = { title: l, sections: [] }; days.push(day); section = null; }
    else if (l.startsWith("##")) {
      if (!day) { day = { title: "", sections: [] }; days.push(day); }
      section = { title: l.replace(/^##\s*/, ""), bullets: [] }; day.sections.push(section);
    } else if (l.startsWith("-")) {
      if (!section) { if (!day) { day = { title: "", sections: [] }; days.push(day); } section = { title: "", bullets: [] }; day.sections.push(section); }
      section.bullets.push(l.replace(/^-\s*/, ""));
    }
  });
  return days;
}

const PRACTICE = /(pratique|vol|exercice|atterrissage|décollage|prise en main|module|étalonnage|calibrat|montage|nettoyage)/i;
const EVAL = /(évaluation|qcm|examen|debrief|analyse des logs)/i;

// Construit un déroulé pédagogique à partir du programme
// Journée type : 09h00–17h00, pause déjeuner fixe 12h30–14h00.
export function buildDeroule(programme) {
  const days = parseProgramme(programme);
  const DAY_START = 9 * 60;      // 09:00
  const LUNCH_START = 12 * 60 + 30; // 12:30
  const LUNCH_END = 14 * 60;     // 14:00
  const DAY_END = 17 * 60;       // 17:00
  const MORNING = LUNCH_START - DAY_START;   // 210 min
  const AFTERNOON = DAY_END - LUNCH_END;     // 180 min

  const methodeFor = (s, dayTitle) =>
    EVAL.test(s.title) ? "Évaluation"
      : PRACTICE.test(s.title + dayTitle) ? "Pratique / atelier"
        : "Apport théorique";
  const supportFor = (methode) =>
    methode === "Pratique / atelier" ? "Drone école, module traitement"
      : methode === "Évaluation" ? "Grille d'évaluation"
        : "Diaporama, fiches";

  const lunch = () => ({
    horaire: `${fmt(LUNCH_START)} – ${fmt(LUNCH_END)}`,
    sequence: "Pause déjeuner", contenu: "", methode: "Pause déjeuner", support: "", duree: "1 h 30",
  });

  const distribute = (sections, start, total, dayTitle, out) => {
    const n = sections.length;
    if (!n) return;
    let clock = start;
    sections.forEach((s, i) => {
      const end = start + Math.round((total * (i + 1)) / n);
      const dur = end - clock;
      const methode = methodeFor(s, dayTitle);
      out.push({
        horaire: `${fmt(clock)} – ${fmt(end)}`,
        sequence: s.title || `Séquence ${i + 1}`,
        contenu: s.bullets.join(" · "),
        methode,
        support: supportFor(methode),
        duree: fmtDur(dur),
      });
      clock = end;
    });
  };

  return days.map((d, di) => {
    const secs = d.sections;
    const N = secs.length;
    const slots = [];
    if (N === 0) { slots.push(lunch()); return { title: d.title || `Jour ${di + 1}`, slots }; }

    let k = Math.round((N * MORNING) / (MORNING + AFTERNOON)); // nb de séquences le matin
    k = Math.max(1, Math.min(N, k));
    if (N >= 2) k = Math.min(N - 1, k); // au moins une séquence l'après-midi

    distribute(secs.slice(0, k), DAY_START, MORNING, d.title, slots);
    slots.push(lunch());
    distribute(secs.slice(k), LUNCH_END, AFTERNOON, d.title, slots);

    return { title: d.title || `Jour ${di + 1}`, slots };
  });
}

function fmt(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;
}

function fmtDur(min) {
  if (min <= 0) return "";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

// Construit un squelette de support de formation à partir du programme
export function buildSupport(programme) {
  const days = parseProgramme(programme);
  const modules = [];
  days.forEach((d) => {
    d.sections.forEach((s) => {
      modules.push({
        jour: d.title,
        titre: s.title,
        objectif: `À l'issue de ce module, le stagiaire sait : ${(s.bullets[0] || s.title || "").toLowerCase()}.`,
        pointsCles: s.bullets.slice(),
        exercice: PRACTICE.test(s.title) ? "Mise en situation pratique encadrée par le formateur." : "Quiz de validation des acquis.",
        images: [],
      });
    });
  });
  return modules;
}

/* ---------------- persistance (localStorage) ---------------- */
const K = {
  constants: "kcp:constants",
  current: "kcp:current",
  lib: "kcp:lib", // index { id: meta }
  fd: (id) => `kcp:fd:${id}`,
};

export const store = {
  getConstants() {
    try { const v = localStorage.getItem(K.constants); return v ? { ...DEFAULT_CONSTANTS, ...JSON.parse(v) } : DEFAULT_CONSTANTS; }
    catch { return DEFAULT_CONSTANTS; }
  },
  setConstants(c) { try { localStorage.setItem(K.constants, JSON.stringify(c)); } catch (e) { console.warn(e); } },
  getCurrent() { try { const v = localStorage.getItem(K.current); return v ? JSON.parse(v) : null; } catch { return null; } },
  setCurrent(fd) { try { localStorage.setItem(K.current, JSON.stringify(fd)); } catch (e) { console.warn(e); } },
  list() {
    try { const v = localStorage.getItem(K.lib); return v ? JSON.parse(v) : []; } catch { return []; }
  },
  save(fd) {
    const id = (fd.id) || ((fd.code || "fd").replace(/[^a-zA-Z0-9-]/g, "_") + "_" + Date.now());
    const rec = { ...fd, id, ts: Date.now() };
    try {
      localStorage.setItem(K.fd(id), JSON.stringify(rec));
      const lib = store.list().filter((m) => m.id !== id);
      lib.unshift({ id, code: rec.code, titre: rec.titre, duree: rec.duree, niveau: rec.niveau, ts: rec.ts });
      localStorage.setItem(K.lib, JSON.stringify(lib));
      return rec;
    } catch (e) { throw e; }
  },
  load(id) { try { const v = localStorage.getItem(K.fd(id)); return v ? JSON.parse(v) : null; } catch { return null; } },
  remove(id) {
    try {
      localStorage.removeItem(K.fd(id));
      localStorage.setItem(K.lib, JSON.stringify(store.list().filter((m) => m.id !== id)));
    } catch (e) { console.warn(e); }
  },
};

export function imgToDataURL(file, maxW, type, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        const ctx = c.getContext("2d");
        if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL(type, quality));
      };
      img.onerror = reject; img.src = e.target.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}
