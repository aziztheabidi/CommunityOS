import { z } from "zod";

export const cuidSchema = z.string().min(1);

export const societySlugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case");

export const createSocietySchema = z.object({
  name: z.string().min(2).max(120),
  slug: societySlugSchema,
  timezone: z.string().default("UTC"),
});

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type CreateSocietyInput = z.infer<typeof createSocietySchema>;
