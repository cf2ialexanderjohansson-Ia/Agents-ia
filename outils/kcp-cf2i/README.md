# CF2i — Générateur de kit KCP (drone)

Application web pour produire les trois documents du kit KCP d'une formation, à partir d'un **programme saisi une seule fois** :

- **Fiche descriptive** (format DP-DAG-A, 2 pages)
- **Déroulé pédagogique** (planning formateur, horaires/séquences/méthodes)
- **Support de formation** (livret stagiaire par module)

Stack : Vite + React + Tailwind v4. Aucune base de données : tout est stocké localement dans le navigateur (localStorage). Export **PDF fidèle au design** (le rendu est capturé tel quel, couleurs et bandeaux compris) via le bouton « Télécharger PDF ».

Chaque document dispose aussi d'un export bureautique éditable, via le bouton contextuel affiché à côté de « Télécharger PDF » selon l'onglet ouvert :
- **Fiche descriptive → Word (.docx)**
- **Déroulé pédagogique → Excel (.xlsx)**, une feuille par jour
- **Support de formation → PowerPoint (.pptx)**, une slide par module

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrez l'URL affichée (généralement http://localhost:5173).

## Construire / héberger

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build
```

Le dossier `dist/` est 100 % statique : déployez-le sur n'importe quel hébergeur (Netlify, Vercel, GitHub Pages, un simple serveur nginx, un partage interne…).

## Développer avec Claude Code

Ouvrez ce dossier dans Claude Code et demandez par exemple :
- « ajoute un export Word (.docx) du support de formation »
- « ajoute un onglet Convention de formation »
- « remplace localStorage par une vraie base partagée (Supabase) »
- « branche l'authentification pour mes collègues »

Fichiers clés :
- `src/store.js` — modèle de données partagé, exemple, persistance, générateurs (déroulé / support) depuis le programme
- `src/components/FicheDescriptive.jsx` — éditeur + aperçu de la FD
- `src/components/Deroule.jsx` — tableau du déroulé pédagogique
- `src/components/Support.jsx` — modules du support stagiaire
- `src/ui.jsx` — composants d'interface partagés
- `src/ai.js` — appel optionnel à l'API Anthropic
- `src/pdf.js` — export PDF (capture du rendu)
- `src/exportWord.js` — export Word (.docx) de la fiche descriptive
- `src/exportExcel.js` — export Excel (.xlsx) du déroulé pédagogique
- `src/exportPpt.js` — export PowerPoint (.pptx) du support de formation

## Rédaction assistée (optionnelle)

Les boutons « Rédiger la fiche », « Générer le programme » et « Enrichir » appellent l'API Anthropic. Renseignez votre clé dans **Réglages** (icône engrenage). La clé reste dans votre navigateur.

⚠️ Appeler l'API directement depuis le navigateur expose la clé. Pour un usage partagé en production, créez un petit backend proxy (une route serveur qui détient la clé et relaie la requête), et faites pointer `src/ai.js` dessus.

## Charte

Bleu marine `#16284E` · Orange `#EC7A2D`. Logo CF2i et visuels se chargent dans l'onglet Fiche descriptive › Visuels (le logo est réutilisé sur les trois documents).
