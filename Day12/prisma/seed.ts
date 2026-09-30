import { prisma } from "../src/db/prisma.js";
import type { Prisma } from "../src/generated/prisma/client.js";

const tickets: Prisma.TicketCreateInput[] = [
  {
    title: "Login issue",
    description: "Customer cannot log in to the application",
    priority: "high",
    status: "open",
    assignee: "Arun",
    comments: {
      create: [{ author: "Arun", body: "Checking the auth service logs." }],
    },
  },
  {
    title: "Payment failed",
    description: "Payment transaction failed for the customer",
    priority: "high",
    status: "open",
    assignee: "Priya",
    comments: {
      create: [
        { author: "Priya", body: "Gateway returned a timeout." },
        { author: "Rahul", body: "Retry succeeded in staging." },
      ],
    },
  },
  {
    title: "Update profile",
    description: "Customer requested a profile update",
    priority: "medium",
    status: "in_progress",
    assignee: "Rahul",
  },
  {
    title: "Password reset",
    description: "Customer requested a password reset",
    priority: "low",
    status: "resolved",
    assignee: "Arun",
  },
];

async function main() {
  // Start from a clean slate so the seed can be re-run safely.
  // Deleting tickets also deletes their comments (ON DELETE CASCADE).
  await prisma.ticket.deleteMany();

  for (const data of tickets) {
    await prisma.ticket.create({ data });
  }

  console.log(`Seeded ${tickets.length} tickets`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
