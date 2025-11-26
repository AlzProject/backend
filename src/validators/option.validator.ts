/**
 * Option validation schemas using Zod.
 *
 * Includes validators for:
 * - Option creation (OptionCreate)
 * - Option updates (OptionUpdate)
 */

import { z } from "zod";

/**
 * Schema for option creation
 */
export const OptionCreateSchema = z.object({
  text: z.string().max(5000, "Option text too long").optional().nullable(),
  isCorrect: z.boolean().default(false),
  weight: z.number().nonnegative("Weight cannot be negative").default(0),
});

export type OptionCreateRequest = z.infer<typeof OptionCreateSchema>;

/**
 * Schema for option updates (partial)
 */
export const OptionUpdateSchema = z.object({
  text: z.string().max(5000, "Option text too long").optional().nullable(),
  isCorrect: z.boolean().optional(),
  weight: z.number().nonnegative("Weight cannot be negative").optional(),
});

export type OptionUpdateRequest = z.infer<typeof OptionUpdateSchema>;
