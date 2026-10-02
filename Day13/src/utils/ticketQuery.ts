import type { Prisma } from "../generated/prisma/client.js";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;
export const MAX_SEARCH_LENGTH = 100;

export const ALLOWED_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export const ALLOWED_PRIORITIES = ["low", "medium", "high"] as const;

// Whitelist of fields the client is allowed to sort by.
// Never pass a raw query value straight into orderBy.
export const SORTABLE_FIELDS = [
  "id",
  "title",
  "priority",
  "status",
  "assignee",
  "createdAt",
  "updatedAt",
] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;

type SortField = (typeof SORTABLE_FIELDS)[number];
type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface TicketQuery {
  page: number;
  pageSize: number;
  statuses: string[];
  priority?: string;
  assignee?: string;
  search?: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export type ParseResult =
  | { ok: true; value: TicketQuery }
  | { ok: false; errors: string[] };

export function parsePositiveInteger(value: unknown): number | null {
  if (value === undefined) {
    return null;
  }

  // Reject things like "1.5", "1e2", " 3" and arrays (?page=1&page=2)
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number) || number <= 0) {
    return null;
  }

  return number;
}

function isOneOf<T extends string>(list: readonly T[], value: string): value is T {
  return (list as readonly string[]).includes(value);
}

// Accepts ?status=open,closed and ?status=open&status=closed
function parseList(value: unknown): string[] | null {
  const raw = Array.isArray(value) ? value : [value];

  if (!raw.every((item) => typeof item === "string")) {
    return null;
  }

  return (raw as string[])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseOptionalString(value: unknown): string | undefined | null {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseTicketQuery(query: Record<string, unknown>): ParseResult {
  const errors: string[] = [];

  // page
  const page = parsePositiveInteger(query.page);
  if (page === null && query.page !== undefined) {
    errors.push("page must be a positive integer");
  }

  // pageSize
  const pageSize = parsePositiveInteger(query.pageSize);
  if (pageSize === null && query.pageSize !== undefined) {
    errors.push("pageSize must be a positive integer");
  } else if (pageSize !== null && pageSize > MAX_PAGE_SIZE) {
    errors.push(`pageSize cannot be greater than ${MAX_PAGE_SIZE}`);
  }

  // status (stretch: multiple values)
  let statuses: string[] = [];
  if (query.status !== undefined) {
    const list = parseList(query.status);
    if (list === null) {
      errors.push("Invalid status");
    } else {
      const invalid = list.filter((s) => !isOneOf(ALLOWED_STATUSES, s));
      if (invalid.length > 0) {
        errors.push(
          `Invalid status: ${invalid.join(", ")}. Allowed: ${ALLOWED_STATUSES.join(", ")}`,
        );
      }
      statuses = [...new Set(list)];
    }
  }

  // priority
  const priority = parseOptionalString(query.priority);
  if (priority === null || (priority !== undefined && !isOneOf(ALLOWED_PRIORITIES, priority))) {
    errors.push(`Invalid priority. Allowed: ${ALLOWED_PRIORITIES.join(", ")}`);
  }

  // assignee
  const assignee = parseOptionalString(query.assignee);
  if (assignee === null) {
    errors.push("Invalid assignee");
  }

  // search
  const search = parseOptionalString(query.search);
  if (search === null) {
    errors.push("Invalid search");
  } else if (search !== undefined && search.length > MAX_SEARCH_LENGTH) {
    errors.push(`search cannot be longer than ${MAX_SEARCH_LENGTH} characters`);
  }

  // sortField
  const sortFieldValue = parseOptionalString(query.sortField);
  let sortField: SortField = "id";
  if (sortFieldValue === null) {
    errors.push("Invalid sortField");
  } else if (sortFieldValue !== undefined) {
    if (isOneOf(SORTABLE_FIELDS, sortFieldValue)) {
      sortField = sortFieldValue;
    } else {
      errors.push(`Invalid sortField. Allowed: ${SORTABLE_FIELDS.join(", ")}`);
    }
  }

  // sortDirection
  const sortDirectionValue = parseOptionalString(query.sortDirection);
  let sortDirection: SortDirection = "asc";
  if (sortDirectionValue === null) {
    errors.push("Invalid sortDirection");
  } else if (sortDirectionValue !== undefined) {
    const lower = sortDirectionValue.toLowerCase();
    if (isOneOf(SORT_DIRECTIONS, lower)) {
      sortDirection = lower;
    } else {
      errors.push("sortDirection must be asc or desc");
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      page: page ?? DEFAULT_PAGE,
      pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
      statuses,
      priority: priority ?? undefined,
      assignee: assignee ?? undefined,
      search: search ?? undefined,
      sortField,
      sortDirection,
    },
  };
}

export function buildTicketWhere(query: TicketQuery): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {};

  if (query.statuses.length === 1) {
    where.status = query.statuses[0];
  } else if (query.statuses.length > 1) {
    where.status = { in: query.statuses };
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.assignee) {
    where.assignee = { equals: query.assignee, mode: "insensitive" };
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export function buildTicketOrderBy(query: TicketQuery): Prisma.TicketOrderByWithRelationInput[] {
  const orderBy: Prisma.TicketOrderByWithRelationInput[] = [
    { [query.sortField]: query.sortDirection },
  ];

  // Tie-breaker so pages are stable when many rows share the same sort value
  if (query.sortField !== "id") {
    orderBy.push({ id: "asc" });
  }

  return orderBy;
}
