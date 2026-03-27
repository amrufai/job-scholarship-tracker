/**
 * Builds the CORS allowlist: defaults for this app plus optional comma-separated ALLOWED_ORIGINS.
 */
function parseOrigins(envValue) {
  if (!envValue || typeof envValue !== "string") return [];
  return envValue
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "https://job-scholarship-tracker.vercel.app",
];

function getAllowedOrigins() {
  const fromEnv = parseOrigins(process.env.ALLOWED_ORIGINS);
  const merged = [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
  return merged;
}

module.exports = { getAllowedOrigins };
