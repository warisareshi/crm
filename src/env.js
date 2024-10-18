import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.any(),
    TZ: z.any(),
    DATABASE_POSTGRES_URL: z.string(),
    DATABASE_POSTGRES_URL_DEV: z.string(),
    RESEND_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_URL: z.string(),
  },
  runtimeEnv: {
    DATABASE_POSTGRES_URL: process.env.DATABASE_POSTGRES_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    DATABASE_POSTGRES_URL_DEV: process.env.DATABASE_POSTGRES_URL_DEV,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TZ: process.env.TZ,
  },
});