import { pgSchema } from "drizzle-orm/pg-core";

export const appSchema = pgSchema("app");
export const dataSchema = pgSchema("data");
