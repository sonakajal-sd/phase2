import bcrypt from "bcryptjs";

// Never store plain passwords. Store a hash instead.
export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function checkPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
}
