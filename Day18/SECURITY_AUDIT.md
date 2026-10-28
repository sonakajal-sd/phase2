added helment for securing HTTP headers. it setup various HTTP headers to prevent attacks like XSS, clickjacking, etc.

because we are using prisma we can avoid sql injection

added the frontend link as cors orgin so that it don't accept request from others

added a global limiter and authLimiter for limit the request per window

limited the body size to 10kb

added zod validation to request body, request query and request params id

added a error middleware for invalid routes
