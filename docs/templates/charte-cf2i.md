# Charte CF2I — Référence pour tous les documents produits

Source : outil interne CF2i de génération de fiches programme (`CF2i_kit_KCP.html`, appli React fournie par l'utilisateur le 2026-07-02). Ce document extrait la charte réelle pour que tous les futurs livrables (fiches programme, supports commerciaux, notes de veille) s'y conforment au lieu de réinventer un style à chaque fois.

## Couleurs officielles

| Rôle | Hex | Usage observé dans l'outil CF2i |
|---|---|---|
| Bleu marine (dominante) | `#15293F` | Fonds d'en-tête, titres, éléments structurants |
| Orange (accent vif) | `#ED6F08` | Accent, éléments à mettre en avant (correspond à l'accent "orange/vert" déjà prévu dans `docs/strategie-globale-cf2i.md` §3.3) |
| Gris très clair (fond de page) | `#F4F6F8` | Arrière-plan général des documents |
| Gris bleuté (texte secondaire) | `#6B7A8D` | Texte secondaire, légendes |
| Gris clair (bordures) | `#E5E9EF` | Séparateurs, bordures de cartes/tableaux |
| Bleu-gris moyen (accents secondaires) | `#96A9BE` | États désactivés, accents mineurs |

Ne pas introduire d'autres couleurs dominantes (pas de bleu profond/cyan différent, pas de palette d'AI générique) : ces 6 valeurs sont la seule palette à utiliser.

## Typographie

Décision explicite (2026-07-02) : **Arial** pour tous les titres et le texte courant, sur l'ensemble des documents CF2I.
- Titres et texte courant : `Arial, Helvetica, sans-serif`
- Code / données tabulaires (références réglementaires, chiffres alignés) : `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

→ Ne pas embarquer de police tierce (Google Fonts, etc.) : Arial est une police système disponible partout, aucun `@font-face` n'est nécessaire.

## Structure standard d'une fiche programme

Champs utilisés par l'outil CF2i pour chaque fiche (à reprendre systématiquement) :

| Champ | Description |
|---|---|
| `code` | Référence courte de la formation (ex. `DP-DAG-A`) |
| `titre` | Intitulé complet |
| `accroche` | Une phrase de présentation (public, objectif, contexte) |
| `duree` | Ex. « 3 jours · 21 h » |
| `modalite` | Ex. « Présentiel / distanciel » |
| `format` | Ex. « Inter · 3 à 5 pers. » |
| `niveau` | Débutant / Intermédiaire / Avancé |
| `objectifs` | Liste de phrases actionnables (verbe d'action en premier) |
| `logiciels` | Liste des logiciels/outils utilisés en formation |
| `prerequis` | Liste ou texte des prérequis |
| `modalitesEval` | Modalités d'évaluation |
| `programme` | Détail jour par jour, format : `JOUR X — <titre>` puis `## <section>` puis `- <point>`, ligne vide entre les jours |

### Bloc commun réutilisable (identique sur toutes les fiches, sauf mention contraire)

```
Prérequis   : Être âgé de 16 ans ou plus
              Connaissances informatiques de base (PC/Mac)
              Maîtrise de la langue française

Modalités d'évaluation :
  - Évaluation progressive « étape par étape » via un livret de progression renseigné avec le formateur
  - Évaluation d'une mise en situation professionnelle

Accès :     Entretien téléphonique obligatoire puis envoi du devis ; formation accessible sous 2 à 6 semaines
            Planning par centre sur www.cf2i-formation.fr ; date et lieu formalisés dans la convention
            Aménagements possibles pour les personnes en situation de handicap (loi du 11/02/2005)

Méthodes :  Matériel drone complet pour l'apprentissage et la découverte
            Espaces de vol pour exercices d'apprentissage et d'entraînement
            Travaux pratiques : prise en main et mise en situation réelle

Moyens :    Formateur CF2i télépilote avec expérience significative ; support stagiaire remis en début de stage
            Drones écoles, drones d'entraînement, simulateurs de vol et plateforme de révision en ligne
            Cf. Fiche Modalité Pratique de Formation Drone (FMPFD)
```

### Indicateurs qualité (kit qualité / Qualiopi) — valeurs de référence relevées dans l'outil

| Indicateur | Valeur |
|---|---|
| Nombre de stagiaires | 360 |
| Période de référence | du 1ᵉʳ janvier 2024 au 31 mai 2026 |
| Taux d'atteinte des objectifs | 100 % |
| Satisfaction stagiaires | 96 % |
| Taux de certification | 91 % |

**Ces chiffres datent de l'export de l'outil et devront être revérifiés/actualisés avant réutilisation dans un nouveau document** — ne pas les considérer comme à jour par défaut.

### Contact et mentions légales (à reprendre tel quel)

```
Tél.   : 09 72 10 74 94
Email  : drone@cf2i.fr
Mentions légales : CF2i · SARL Clic & Bat · Capital 10 000 € · SIRET 794 691 402 00042 ·
                    N° déclar. d'activité 72 33 09201 33 · 5 rue du Golf, 33700 Mérignac ·
                    www.cf2i-formation.fr
```

## Exemple réel observé (pour calibrer le ton et le niveau de détail)

Fiche `DP-DAG-A` — *Pratique du drone pour la pulvérisation agricole* :
- Accroche : « Formation dédiée à la maîtrise des drones professionnels et à la spécialisation en pulvérisation par drone. Elle s'adresse aux professionnels du secteur agricole souhaitant intégrer la pulvérisation par drone dans leurs pratiques, en toute sécurité et conformité réglementaire. »
- Durée : 3 jours · 21 h — Modalité : Présentiel / distanciel — Format : Inter · 3 à 5 pers. — Niveau : Débutant
- Logiciels cités : Pix4Dfields (cartographie et cartes de prescription), DJI SmartFarm (planification et supervision de vol)
- Programme type sur 3 jours : Jour 1 théorie (réglementation STS-01/STS-02/catégorie Spécifique, machine, plan de vol, radiocommande, traitement phytosanitaire) → Jour 2 pratique prise en main (module de traitement liquide, sécurité, vol sous contrôle) → Jour 3 pratique avancée + évaluation (module solide/granulés, traçabilité DSAC, QCM SORA + ConOps simplifié, vol de démonstration)
- Terminologie réglementaire à utiliser telle quelle quand pertinente : STS-01, STS-02, ZGU (zone géographique UAS), DSAC, SORA, ConOps.

## Application

À partir de maintenant, tout document produit (fiche programme, support commercial, note de veille) doit :
1. Utiliser exclusivement la palette des 6 couleurs ci-dessus.
2. Utiliser la pile de polices système (pas de police custom embarquée).
3. Reprendre les champs de la structure standard de fiche programme.
4. Réutiliser le bloc commun et les mentions légales tels quels, sauf instruction contraire explicite.
5. Signaler si des indicateurs qualité ou une donnée réglementaire semblent à vérifier plutôt que de les considérer comme figés.
