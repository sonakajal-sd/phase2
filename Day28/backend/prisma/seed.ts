// Creates two demo users so you can test login.
// Run with: npm run seed
import prisma from "../src/lib/prisma";
import { hashPassword } from "../src/utils/password";

async function main() {
    const password = await hashPassword("password123");

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: { name: "Admin", email: "admin@example.com", passwordHash: password, role: "admin" },
    });

    await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: { name: "Normal User", email: "user@example.com", passwordHash: password, role: "user" },
    });

    console.log("Seeded admin@example.com and user@example.com (password: password123)");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
