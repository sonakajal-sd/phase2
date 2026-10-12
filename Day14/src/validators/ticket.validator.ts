import { ValidationError } from "../errors/app-error";
import {
  CreateTicketInput,
  ListTicketsQuery,
  Pagination,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  TicketFilters,
  UpdateTicketInput,
} from "../types/ticket.types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const requireNonEmptyString = (value: unknown, field: string): string => {
  if (!isNonEmptyString(value)) {
    throw new ValidationError(`${field} is required`);
  }
  return value.trim();
};

const optionalOneOf = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): T | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (!allowed.includes(value as T)) {
    throw new ValidationError(`${field} must be one of: ${allowed.join(", ")}`);
  }
  return value as T;
};

const optionalString = (value: unknown, field: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (!isNonEmptyString(value)) {
    throw new ValidationError(`${field} must be a non-empty string`);
  }
  return value.trim();
};

const positiveInteger = (
  value: unknown,
  field: string,
  fallback: number,
): number => {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError(`${field} must be a positive integer`);
  }
  return parsed;
};

const withoutUndefined = <T extends object>(input: T): T =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T;

export const validateTicketId = (id: unknown): number => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError("Invalid ticket ID");
  }
  return parsed;
};

export const validateCreateTicket = (body: unknown): CreateTicketInput => {
  if (!isObject(body)) {
    throw new ValidationError("Request body must be an object");
  }

  return withoutUndefined({
    title: requireNonEmptyString(body.title, "Title"),
    description: requireNonEmptyString(body.description, "Description"),
    priority: optionalOneOf(body.priority, TICKET_PRIORITIES, "Priority"),
    status: optionalOneOf(body.status, TICKET_STATUSES, "Status"),
    assignee: optionalString(body.assignee, "Assignee"),
  });
};

export const validateUpdateTicket = (body: unknown): UpdateTicketInput => {
  if (!isObject(body)) {
    throw new ValidationError("Request body must be an object");
  }

  const update = withoutUndefined({
    title: optionalString(body.title, "Title"),
    description: optionalString(body.description, "Description"),
    priority: optionalOneOf(body.priority, TICKET_PRIORITIES, "Priority"),
    status: optionalOneOf(body.status, TICKET_STATUSES, "Status"),
    assignee: optionalString(body.assignee, "Assignee"),
  });

  if (Object.keys(update).length === 0) {
    throw new ValidationError("At least one field must be provided");
  }

  return update;
};

export const validateListQuery = (
  query: ListTicketsQuery,
): { filters: TicketFilters; pagination: Pagination } => {
  const limit = positiveInteger(query.limit, "Limit", DEFAULT_LIMIT);
  if (limit > MAX_LIMIT) {
    throw new ValidationError(`Limit must not exceed ${MAX_LIMIT}`);
  }

  return {
    pagination: {
      page: positiveInteger(query.page, "Page", DEFAULT_PAGE),
      limit,
    },
    filters: withoutUndefined({
      status: optionalOneOf(query.status, TICKET_STATUSES, "Status"),
      priority: optionalOneOf(query.priority, TICKET_PRIORITIES, "Priority"),
      assignee: optionalString(query.assignee, "Assignee"),
    }),
  };
};
