import type { PublicUser } from "../utils/publicUser";

// Tell TypeScript that requireAuth adds `req.user` to every request it lets through.
declare global {
    namespace Express {
        interface Request {
            user?: PublicUser;
        }
    }
}

export {};
