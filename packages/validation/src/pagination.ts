/**
 * @vidyafloww/validation — Pagination Schema
 *
 * Zod schema for validating pagination query parameters.
 */

import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  ordering: z.string().optional(),
  search: z.string().optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
