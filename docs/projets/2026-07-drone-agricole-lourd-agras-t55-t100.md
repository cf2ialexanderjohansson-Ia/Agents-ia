# Fiche de cadrage — Extension "drone agricole lourd" (Agras T55/T100)

**Statut** : cadrage en cours — validation réglementaire à confirmer avant tout brief pédago/production
**Date de cadrage** : 2026-07-02
**Origine** : note de veille du 2 juillet 2026 (lancement mondial DJI Agras T55/T100)
**Porteur** : agent projet CF2I

---

## 1. Contexte et déclencheur

- DJI lance mondialement les **Agras T55 et T100**, drones agricoles lourds (jusqu'à 150 kg), catégorie **Specific obligatoire** (hors Open de par la masse).
- **Flying Eye**, partenaire matériel déjà en place chez CF2I (cf. `docs/strategie-globale-cf2i.md`, section 1.2 bis), est **revendeur officiel DJI Enterprise/Agras** : l'accès au matériel ne nécessite pas de nouveau partenariat, seulement une extension du périmètre produit avec un partenaire existant.
- La **loi du 23 avril 2025 sur l'épandage par drone** crée (ou clarifie) un cadre légal national pour cet usage, ce qui rend le sujet exploitable commercialement alors qu'il ne l'était pas nécessairement avant.
- Cette convergence (matériel disponible + partenaire déjà intégré + cadre légal récent) constitue une **opportunité d'extension de gamme** du pack "Prêt à voler" vers le segment agricole lourd, complémentaire à l'offre matériel/formation existante.

## 2. Cible et besoin réel

| Élément | Détail |
|---|---|
| Cible visée | Exploitants agricoles et entreprises de prestation de services agricoles (épandage, semis, traitement phytosanitaire) — cohérent avec la priorité B2B de la stratégie commerciale CF2I |
| Besoin réel identifié | Les exploitants qui achètent un Agras T55/T100 chez Flying Eye ont besoin d'une formation pilotage + réglementation Specific + probablement d'un accompagnement conformité spécifique épandage (produits phytosanitaires, zones de sécurité, riverains) |
| Valeur pour CF2I | Complète le triptyque formation/logiciel/matériel sur un nouveau segment, avec un partenaire déjà contractualisé — coût d'entrée relativement bas |
| Point de vigilance | Le besoin doit être confirmé par un signal marché réel (demandes entrantes, retours Flying Eye) avant d'investir en développement de contenu — à ce stade c'est une opportunité détectée par la veille, pas une demande client avérée |

## 3. Faisabilité réglementaire — À VALIDER, NE PAS ANTICIPER LE CONTENU

**Statut réglementaire actuel : non clarifié précisément — ce projet ne doit pas avancer vers le pédago/production tant que ce point n'est pas confirmé.**

Éléments connus :
- Catégorie **Specific** obligatoire (masse > 25 kg, jusqu'à 150 kg pour les T55/T100).
- La loi du 23 avril 2025 encadre l'épandage par drone au niveau national, mais son articulation précise avec :
  - le scénario/autorisation Specific applicable (scénario standard national épandage vs. autorisation d'exploitation spécifique individuelle),
  - les exigences croisées avec la réglementation phytosanitaire existante (agrément Certiphyto, distances riverains/points d'eau, etc.),
  - les éventuelles conditions de formation ou de certification du télépilote spécifiques à l'épandage introduites par cette loi,

  **n'est pas confirmée dans ce cadrage** et doit être vérifiée avant d'engager du contenu pédagogique.

**Action requise avant la suite du projet** : brief à `cf2i-veille` (voir section 5).

## 4. Scénario de test pilote (à activer seulement après validation réglementaire)

- Format envisagé : session pilote avec 3 à 5 exploitants/entreprises agricoles déjà clients ou prospects Flying Eye, associant formation réglementaire Specific + épandage, prise en main T55/T100, et test du pack "Prêt à voler" adapté.
- Objectif du pilote : valider le contenu, la durée, le prix, et la pertinence du bundle avant généralisation.
- Le pilote ne peut être planifié qu'après (a) confirmation réglementaire et (b) accord commercial précis avec Flying Eye sur ce périmètre produit.

## 5. Dépendances vers les autres agents

| Agent | Brief | Urgence |
|---|---|---|
| `cf2i-veille` | Confirmer précisément le cadre réglementaire applicable à l'épandage agricole par drone lourd (>25 kg) : scénario/autorisation Specific concerné, articulation avec la loi du 23 avril 2025, exigences phytosanitaires croisées (Certiphyto, distances de sécurité), et toute exigence de formation spécifique introduite par la loi. | Bloquant — à traiter avant tout autre jalon |
| `cf2i-production` | Ne pas engager de brief commercial/supports tant que le point réglementaire n'est pas confirmé. Une fois confirmé : brief sur le positionnement du pack "Prêt à voler agricole lourd" (drone Agras + formation + logiciel), en cohérence avec le pack existant décrit en section 1.2 bis de la stratégie globale. | Après jalon 2 |
| `cf2i-pedago` | Ne pas engager de conception de contenu tant que le point réglementaire n'est pas confirmé. Une fois confirmé : brief sur le contenu métier épandage (dosage/produits phytosanitaires, sécurité riverains, cartographie de parcelles, spécificités de pilotage d'un drone de 150 kg). | Après jalon 2 |
| Commercial / Flying Eye | Clarifier les conditions commerciales précises de revente Agras T55/T100 (marge, disponibilité, SAV, exclusivité éventuelle) — distinct du cadrage réglementaire, peut avancer en parallèle. | Parallèle au jalon 2 |

## 6. Rétroplanning à jalons

| Jalon | Contenu | Échéance indicative | Statut |
|---|---|---|---|
| J1 — Cadrage | Cette fiche | 2026-07-02 | Fait |
| J2 — Validation réglementaire | Retour de `cf2i-veille` sur le cadre exact épandage/Specific applicable | 2026-07 (S3-S4) | À faire — bloquant |
| J2 bis — Cadrage partenariat Flying Eye | Conditions commerciales précises sur le périmètre Agras T55/T100 | 2026-07 (S3-S4), en parallèle | À faire |
| J3 — Brief pédago + production | Contenu métier épandage + positionnement commercial du pack | 2026-08, conditionné à J2 | Non démarré |
| J4 — Conception des supports | Contenus e-learning/présentiel + supports commerciaux | 2026-09 | Non démarré |
| J5 — Pilote | Session test avec 3-5 exploitants/entreprises agricoles | 2026-10 | Non démarré |
| J6 — Bilan de pilote | Résultats, ajustements, décision de généralisation | 2026-11 | Non démarré |
| J7 — Lancement généralisé | Ouverture de l'offre au catalogue | 2026-12 / T1 2027 | Non démarré |

## 7. Points de vigilance

- **Ne pas confondre disponibilité matérielle et faisabilité réglementaire** : le fait que Flying Eye vende déjà les T55/T100 ne dit rien sur le cadre de formation/exploitation applicable en France — c'est précisément le point à faire vérifier par la veille.
- Vérifier qu'il existe une **demande marché réelle** (au-delà de l'opportunité détectée) avant d'engager les jalons 3-4.
- Anticiper que le pilote nécessite un accès physique à un Agras T55/T100 (via Flying Eye) — à sécuriser en amont du jalon 5.
