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

---

## 8. Piste parallèle — DJI Matrice 400 + kit C5 tiers (Kronos M400)

**Statut : élément factuel confirmé, distinct du teaser du 8 juillet — à traiter séparément et plus vite.**

En creusant l'hypothèse C5 du fondateur, la veille a identifié un produit **déjà existant et disponible en France**, sans lien avec le teaser du 8 juillet :

| Élément | Statut |
|---|---|
| Le DJI Matrice 400 (M400) existe et est commercialisé en France depuis juin 2025 | Confirmé |
| Le M400 est certifié **classe C3** en sortie d'usine chez DJI | Confirmé |
| Un **kit de conversion C5 tiers existe : "Kronos M400" (Dronavia)**, ajoutant parachute (PRS) + Flight Termination System (FTS), conforme EASA MOC M2/MOC 2511 | Confirmé |
| Avec ce kit, le M400 devient éligible **classe C5 → scénario STS-01** | Confirmé (mais porté par le kit, pas par DJI) |
| Disponibilité via les partenaires CF2I | Le M400 est distribué par **Flying Eye** et **Innov8** ; le kit Kronos C5 est un produit **Dronavia**, tiers non lié aux deux partenaires actuels — à vérifier s'ils le distribuent aussi ou s'il faut un 3e fournisseur |
| Prix indicatif M400 seul (non officiel, à confirmer par devis) | ~10 800 – 11 300 € HT, hors kit C5 |

**Point de vigilance réglementaire important** : avec le kit Kronos, c'est **Dronavia (l'intégrateur), pas DJI**, qui devient "fabricant" au sens du règlement UE 2019/945 pour l'ensemble modifié, et qui doit fournir la déclaration UE de conformité correspondante. Avant toute promesse commerciale à un client sur une éligibilité STS-01, il faut faire vérifier cette documentation par un expert réglementaire — ce n'est pas un marquage DJI natif.

**Différence avec la section 1-7 de cette fiche** : cette piste M400 + Kronos ne dépend pas de la révélation DJI du 8 juillet et peut être instruite dès maintenant, en parallèle du jalon J2. Elle est cependant moins "clé en main" qu'un drone nativement C5, car elle ajoute un fournisseur et une chaîne de conformité tierce.

**Jalon proposé (indépendant de J1/J2)** :

| Jalon | Contenu | Condition |
|---|---|---|
| Ja — Vérification fournisseur | Contacter Flying Eye et Innov8 pour savoir s'ils distribuent le M400 en configuration C3 uniquement ou peuvent fournir/orienter vers le kit Kronos C5 ; demander un devis M400 + kit | À lancer dès maintenant, sans attendre le 8 juillet |
| Jb — Vérification conformité | Faire confirmer par un expert réglementaire la validité de la déclaration UE de conformité Dronavia pour l'ensemble M400 + Kronos avant toute offre packagée | Après Ja |
| Jc — Si Ja/Jb positifs | Brief vers `cf2i-production` pour évaluer l'intégration au pack "Prêt à voler STS-01" ; brief vers `cf2i-pedago` pour le contenu matériel du module CATS/STS-01 | Après Jb |

Cette piste ne remplace pas la vérification J2 sur le nouveau drone teasé (section 4) : les deux pistes sont suivies en parallèle, indépendamment l'une de l'autre.
