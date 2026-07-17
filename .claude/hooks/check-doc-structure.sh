#!/bin/bash
# Vérifie la mise en forme de base d'un document Markdown venant d'être écrit/modifié sous docs/.
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0
[[ "$file_path" != *.md ]] && exit 0
[[ "$file_path" != *"/docs/"* ]] && exit 0
[[ ! -f "$file_path" ]] && exit 0

issues=()

first_line=$(grep -m1 -v '^[[:space:]]*$' "$file_path")
if [[ "$first_line" != \#\ * ]]; then
  issues+=("- Le document ne commence pas par un titre '# ...'")
fi

fence_count=$(grep -c '^```' "$file_path")
if (( fence_count % 2 != 0 )); then
  issues+=("- Nombre impair de balises \`\`\` : un bloc de code semble non fermé")
fi

if [[ ${#issues[@]} -gt 0 ]]; then
  echo "Vérification de mise en forme sur $(basename "$file_path") :"
  printf '%s\n' "${issues[@]}"
fi

exit 0
