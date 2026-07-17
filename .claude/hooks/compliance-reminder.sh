#!/bin/bash
# Rappelle une checklist de conformité après la production d'un livrable sous docs/livrables/.
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0
[[ "$file_path" != *.md ]] && exit 0
[[ "$file_path" != *"/docs/livrables/"* ]] && exit 0

cat <<'EOF'
Rappel conformité avant livraison (à vérifier manuellement) :
- [ ] Contenu réglementaire à jour (source DGAC/EASA datée)
- [ ] Mentions Qualiopi si support de formation (objectifs pédagogiques, prérequis, modalités d'évaluation, public visé)
- [ ] Identité de marque respectée (ton, positionnement par cible)
- [ ] Aucune affirmation réglementaire non sourcée
EOF

exit 0
