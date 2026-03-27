/**
 * Fail fast when required secrets/config are missing (avoids signing JWTs with undefined).
 */
function requireEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === null || String(value).trim() === "") {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function assertRequiredEnv() {
  requireEnv("JWT_SECRET");
  requireEnv("DB_HOST");
  requireEnv("DB_USER");
  requireEnv("DB_PASSWORD");
  requireEnv("DB_NAME");
}

module.exports = { assertRequiredEnv, requireEnv };
