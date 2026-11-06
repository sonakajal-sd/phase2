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

    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: {},
        create: { name: "Normal User", email: "user@example.com", passwordHash: password, role: "user" },
    });

    // A few demo issues (only added once)
    if ((await prisma.issue.count()) === 0) {
        await prisma.issue.createMany({
            data: [
                { title: "Login button is too small", status: "open", authorId: user.id },
                { title: "Add dark mode", status: "in_progress", authorId: user.id },
                { title: "Fix typo on dashboard", status: "closed", authorId: user.id },
            ],
        });
    }

    console.log("Seeded admin@example.com and user@example.com (password: password123) and demo issues");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
