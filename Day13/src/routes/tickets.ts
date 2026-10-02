import { Router } from "express";
import { prisma } from "../db/prisma.js";
import {
  parseTicketQuery,
  buildTicketWhere,
  buildTicketOrderBy,
} from "../utils/ticketQuery.js";

const router = Router();

router.get("/", async (req, res) => {
  // 1. Validate query parameters
  const parsed = parseTicketQuery(req.query);

  if (!parsed.ok) {
    return res.status(400).json({
      error: "Invalid query parameters",
      details: parsed.errors,
    });
  }

  const query = parsed.value;

  // 2. Build validated filter + sort objects
  const where = buildTicketWhere(query);
  const orderBy = buildTicketOrderBy(query);
  const skip = (query.page - 1) * query.pageSize;

  // 3. Count and data queries — pagination happens in the database
  const [total, tickets] = await prisma.$transaction([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take: query.pageSize,
    }),
  ]);

  const totalPages = Math.ceil(total / query.pageSize);

  // 4. Return metadata
  res.json({
    data: tickets,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
    filters: {
      status: query.statuses,
      priority: query.priority ?? null,
      assignee: query.assignee ?? null,
      search: query.search ?? null,
    },
    sort: {
      field: query.sortField,
      direction: query.sortDirection,
    },
  });
});

export default router;
