# Agents IA — CF2I

Ce dossier décrit les agents IA envisagés pour outiller les trois piliers de CF2I (formation, logiciel, commercial — voir [`../strategie-globale-cf2i.md`](../strategie-globale-cf2i.md)).

Chaque fiche suit la même structure : rôle, mission, périmètre, sources/entrées, livrables/sorties, déclencheurs, prompt système proposé, outils nécessaires, KPIs. L'objectif est que chaque fiche soit directement exploitable pour provisionner l'agent sur une plateforme (Monday.com, Claude, etc.) sans reformulation supplémentaire.

| Agent | Rôle en une phrase | Fiche |
|---|---|---|
| Veille | Surveille la réglementation drone/machines et les événements innovation, alerte sur les impacts | [veille.md](veille.md) |
| Production | Produit et maintient les kits commerciaux et pédagogiques | [production.md](production.md) |
| Projet | Pilote le développement de nouvelles offres de formation drone | [projet.md](projet.md) |
| Pédago | Conçoit les programmes de formation (Qualiopi), anime les groupes et les sessions de formation de formateurs | [pedago.md](pedago.md) |

## Interactions entre agents

```
Veille ──(alertes réglementaires/marché)──> Projet ──(cadrage validé)──> Production ──(kits prêts)──> Pédago
   │                                            │                                                        │
   └──────────────(mise à jour continue)────────┴────────────────(retours terrain, besoins)──────────────┘
```

- **Veille** alimente **Projet** (nouvelles contraintes ou opportunités déclenchant une nouvelle offre) et **Pédago** (mise à jour des contenus de formation existants).
- **Projet** commande à **Production** les kits nécessaires au lancement d'une nouvelle offre.
- **Pédago** remonte à **Projet** et **Veille** les retours terrain (difficultés stagiaires, questions récurrentes, signaux faibles du secteur).

*Fiches à valider et ajuster avec les responsables opérationnels avant provisionnement effectif des agents.*
