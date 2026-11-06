import type { User } from "../generated/prisma/client.js";

// The shape of a user we send to the frontend.
// It leaves out passwordHash on purpose.
export type PublicUser = Pick<User, "id" | "name" | "email" | "role">;

export function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
