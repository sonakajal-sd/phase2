import z from "zod";

export const ticketSchema = z.object({
  title: z.string().trim().min(3, "title must be at least 2 chars"),
  description: z
    .string()
    .trim()
    .min(6, "description must be at least 6 characters"),
  priority: z.enum(["low", "medium", "high"]),
  category_id: z.number().int(),
});

export const ticketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in_progress", "resolve", "closed"]).optional(),
  assignee: z.coerce.number().int().min(1).optional(),
  search: z.string().trim().min(1, "search can't be empty").optional(),
  sortField: z
    .enum(["createdAt", "updatedAt", "priority", "status"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export const idSchema = z.coerce.number().int().positive();

export type CreateTicket = z.infer<typeof ticketSchema>;
export type TicketQuery = z.infer<typeof ticketQuerySchema>;
