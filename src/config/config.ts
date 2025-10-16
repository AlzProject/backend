/**
 * Type-safe configuration loader.
 *
 * Reads environment variables, applies basic validation/defaults and exports
 * a frozen `config` object for application use.
 */

export interface AppConfig {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string; // e.g. '1h', '7d'
  DATABASE_URL?: string;
}

function required(name: string, val: string | undefined): string {
  if (!val) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return val;
}

const NODE_ENV = (process.env.NODE_ENV as AppConfig["NODE_ENV"]) ||
  "development";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const JWT_SECRET = required("JWT_SECRET", process.env.JWT_SECRET);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const DATABASE_URL = process.env.DATABASE_URL;

const config: AppConfig = Object.freeze({
  NODE_ENV,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  DATABASE_URL,
});

export default config;
