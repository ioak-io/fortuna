import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "staging"]),
  NEXT_PUBLIC_AUTH_CLIENT_ID: z.string(),
  NEXT_PUBLIC_AUTH_CLIENT_SECRET: z.string(),
  NEXT_PUBLIC_APP_BASE_URL: z.string().url(),
  NEXT_PUBLIC_TENANT: z.string(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,
  NEXT_PUBLIC_AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
  NEXT_PUBLIC_AUTH_CLIENT_SECRET: process.env.NEXT_PUBLIC_AUTH_CLIENT_SECRET,
  NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  NEXT_PUBLIC_TENANT: process.env.NEXT_PUBLIC_TENANT,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");

  const tree = z.treeifyError(parsed.error);

  if (tree.properties?.NEXT_PUBLIC_API_URL?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_API_URL:",
      tree.properties.NEXT_PUBLIC_API_URL.errors.join(", ")
    );
  }

  if (tree.properties?.NEXT_PUBLIC_APP_ENV?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_APP_ENV:",
      tree.properties.NEXT_PUBLIC_APP_ENV.errors.join(", ")
    );
  }

  if (tree.properties?.NEXT_PUBLIC_AUTH_CLIENT_ID?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_AUTH_CLIENT_ID:",
      tree.properties.NEXT_PUBLIC_AUTH_CLIENT_ID.errors.join(", ")
    );
  }

  if (tree.properties?.NEXT_PUBLIC_AUTH_CLIENT_SECRET?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_AUTH_CLIENT_SECRET:",
      tree.properties.NEXT_PUBLIC_AUTH_CLIENT_SECRET.errors.join(", ")
    );
  }

  if (tree.properties?.NEXT_PUBLIC_APP_BASE_URL?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_APP_BASE_URL:",
      tree.properties.NEXT_PUBLIC_APP_BASE_URL.errors.join(", ")
    );
  }

  if (tree.properties?.NEXT_PUBLIC_TENANT?.errors?.length) {
    console.error(
      "NEXT_PUBLIC_TENANT:",
      tree.properties.NEXT_PUBLIC_TENANT.errors.join(", ")
    );
  }

  throw new Error("Invalid environment configuration — check your .env files.");
}

export const env = parsed.data;
