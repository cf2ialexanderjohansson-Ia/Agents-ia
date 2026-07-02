# Fiche de cadrage conditionnelle — Nouveau drone enterprise DJI (successeur M30) x module CATS/STS-01

**Statut : HYPOTHÈSE NON CONFIRMÉE — aucun développement à engager avant vérification**
**Date de cadrage** : 2026-07-02
**Origine** : note de veille du 2 juillet 2026 (teasing DJI d'un nouveau drone enterprise, révélation prévue le 8 juillet 2026)
**Porteur** : agent projet CF2I

---

## 1. Avertissement méthodologique

Ce document cadre une **piste conditionnelle**, à ne pas traiter au même niveau de certitude que l'extension Agras T55/T100 (voir `docs/projets/2026-07-drone-agricole-lourd-agras-t55-t100.md`).

L'élément déclencheur est une **impression du fondateur de CF2I** ("pourrait être certifié classe C5"), **non confirmée par DJI**. Aucune spécification officielle n'est disponible à ce jour (2026-07-02) : le drone n'est pas encore révélé. Ce cadrage sert uniquement à préparer la vérification et à éviter que le sujet ne soit oublié ou, à l'inverse, engagé prématurément.

**Consigne explicite : aucun brief vers `cf2i-pedago` ou `cf2i-production` ne doit être envoyé sur ce sujet tant que le jalon de vérification (section 4, J2) n'est pas franchi avec une confirmation positive.**

## 2. Contexte

- DJI a teasé un nouveau drone enterprise, probable successeur du Matrice 30, avec révélation officielle annoncée pour le **8 juillet 2026**.
- Le fondateur de CF2I émet l'hypothèse que ce drone pourrait être **certifié classe C5**, ce qui le rendrait éligible au **scénario STS-01** (opérations standard en catégorie Specific).
- Si cette hypothèse se confirmait, il existerait un lien direct avec l'offre **CATS/STS-01** déjà cadrée précédemment par CF2I (fiche "Préparation & simulateur CATS"), ainsi qu'avec le pack commercial "Prêt à voler" (matériel + formation + logiciel, cf. stratégie globale section 1.2 bis).

## 3. Ce qui est confirmé vs. ce qui ne l'est pas

| Élément | Statut |
|---|---|
| DJI va révéler un nouveau drone enterprise le 8 juillet 2026 | Confirmé (teasing officiel) |
| Ce drone est un successeur probable du Matrice 30 | Probable, non officiellement confirmé |
| Ce drone sera certifié classe C5 | **Non confirmé — simple hypothèse/impression du fondateur** |
| Ce drone serait éligible au scénario STS-01 | **Conséquence hypothétique de l'hypothèse précédente, donc également non confirmée** |
| Lien avec le module CATS/STS-01 déjà cadré | Pertinent **uniquement si** la certification C5 est confirmée |

## 4. Rétroplanning à jalons — avec jalon de vérification obligatoire

| Jalon | Contenu | Échéance | Statut |
|---|---|---|---|
| J0 — Cadrage conditionnel | Cette fiche, posée en amont de la révélation pour préparer la vérification | 2026-07-02 | Fait |
| **J1 — Révélation officielle DJI** | Collecte des spécifications officielles publiées par DJI (fiche technique, classe de certification déclarée, marquage CE/UE le cas échéant) | 2026-07-08 | À venir |
| **J2 — Jalon de vérification (GO/NO GO)** | Brief explicite à `cf2i-veille` : confirmer ou infirmer, sur base des spécifications officielles DJI et/ou de la déclaration UE de conformité, si le drone est effectivement certifié classe C5 et donc éligible au scénario STS-01. **Aucune suite du projet sans ce jalon franchi positivement.** | 2026-07-08 → 2026-07-15 | Bloquant — condition de tout le reste |
| J3a — Si GO (C5 confirmé) | Cadrage de l'intégration au pack "Prêt à voler" + articulation avec le module CATS/STS-01 déjà cadré ; briefs vers `cf2i-pedago` (adaptation du contenu STS-01 au nouveau matériel) et `cf2i-production` (positionnement commercial, mise à jour des supports du pack) | À définir après J2 | Conditionnel |
| J3b — Si NO GO (C5 non confirmé ou infirmé) | Sujet classé en veille passive dans le tableau de bord des projets ; pas de développement d'offre ; réévaluation seulement si DJI publie une clarification ultérieure ou si un organisme notifié confirme la classe a posteriori | À définir après J2 | Conditionnel |

## 5. Dépendances vers les autres agents

| Agent | Brief | Condition |
|---|---|---|
| `cf2i-veille` | Vérifier après le 8 juillet 2026 la classe de certification officielle du nouveau drone (C5 ou autre) à partir de sources DJI officielles/déclaration de conformité UE, et son éligibilité effective au scénario STS-01. C'est le jalon J2, bloquant pour toute la suite. | Immédiat après J1 |
| `cf2i-pedago` | Aucun brief à ce stade. Si J2 = GO : évaluer les ajustements du module CATS/STS-01 déjà cadré (matériel de référence, éventuelles spécificités du nouveau drone). | Uniquement si J2 = GO |
| `cf2i-production` | Aucun brief à ce stade. Si J2 = GO : évaluer l'intégration au pack "Prêt à voler" et la mise à jour des supports commerciaux existants liés à CATS/STS-01. | Uniquement si J2 = GO |

## 6. Cible et faisabilité (à titre indicatif, non engageant)

- Cible pressentie (si confirmé) : entreprises déjà intéressées par le module CATS/STS-01, opérateurs recherchant du matériel Specific certifié C5 pour des opérations standard STS-01.
- Faisabilité réglementaire : **entièrement dépendante du jalon J2**. Tant que la certification n'est pas confirmée, ce projet doit être considéré comme **sans validation réglementaire claire** et ne doit pas avancer, conformément à la méthodologie de l'agent projet.

## 7. Rappel de gouvernance

Ce cadrage ne constitue pas une autorisation d'engager des ressources pédagogiques ou commerciales. Il s'agit d'un document de préparation destiné à garantir qu'une vérification factuelle soit faite rapidement après le 8 juillet 2026, sans que le sujet ne soit ni oublié, ni engagé sur la seule base d'une impression non confirmée.
