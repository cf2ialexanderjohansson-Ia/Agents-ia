// Appel optionnel à l'API Anthropic. La clé est saisie par l'utilisateur dans
// Réglages et stockée localement (localStorage). En production, préférez un
// petit backend proxy pour ne pas exposer la clé côté navigateur.

export function getApiKey() {
  try { return localStorage.getItem("kcp:apikey") || ""; } catch { return ""; }
}
export function setApiKey(k) {
  try { localStorage.setItem("kcp:apikey", k || ""); } catch (e) { console.warn(e); }
}

export async function callClaude(prompt, { maxTokens = 1200 } = {}) {
  const key = getApiKey();
  if (!key) throw new Error("Aucune clé API renseignée (Réglages).");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error("Erreur API " + res.status);
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}
