import { z } from "zod";

import { ITEM_TYPES } from "../constants";

const optionalTrimmedString = z
  .string()
  .trim()
  .min(1)
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

export const submissionSchema = z.object({
  type: z.enum(ITEM_TYPES),
  title: z.string().trim().min(1, "Title is required."),
  source_url: z.string().trim().url("Source URL must be a valid URL."),
  description: optionalTrimmedString.nullable().optional(),
  image_url: optionalTrimmedString.nullable().optional(),
  event_date: optionalTrimmedString.nullable().optional(),
  location: optionalTrimmedString.nullable().optional(),
  city: optionalTrimmedString.nullable().optional(),
  region: optionalTrimmedString.nullable().optional(),
  tags: z.array(z.string().trim().min(1)).optional().default([])
});

export type SubmissionSchemaInput = z.input<typeof submissionSchema>;
export type SubmissionSchemaOutput = z.output<typeof submissionSchema>;
