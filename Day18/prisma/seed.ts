import "dotenv/config";
import {
  PrismaClient,
  TicketPriority,
  TicketStatus,
  UserRole,
} from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Anjal",
        email: "anjal@vonnue.com",
        passwordHash,
        role: UserRole.admin,
      },
      {
        name: "Yasin",
        email: "yasin@vonnue.com",
        passwordHash,
        role: UserRole.agent,
      },
      {
        name: "Christo",
        email: "christo@vonnue.com",
        passwordHash,
        role: UserRole.agent,
      },

      // Customers
      {
        name: "Gauresh",
        email: "gauresh@vonnue.com",
        passwordHash,
        role: UserRole.customer,
      },
      {
        name: "Akshay",
        email: "akshay@vonnue.com",
        passwordHash,
        role: UserRole.customer,
      },
      {
        name: "Hawas",
        email: "hawas@vonnue.com",
        passwordHash,
        role: UserRole.customer,
      },
    ],
  });

  const categories = await prisma.category.createManyAndReturn({
    data: [{ name: "Technical" }, { name: "Billing" }, { name: "Account" }],
  });

  const customers = users.filter((user) => user.role === UserRole.customer);

  const staff = users.filter(
    (user) => user.role === UserRole.admin || user.role === UserRole.agent,
  );

  const tickets = await prisma.ticket.createManyAndReturn({
    data: [
      {
        customerId: customers[0].id,
        categoryId: categories[0].id,
        title: "login problem",
        description: "cannot login",
        priority: TicketPriority.high,
        status: TicketStatus.open,
      },
      {
        customerId: customers[1].id,
        categoryId: categories[1].id,
        title: "wrong invoice",
        description: "invoice amount is incorrect",
        priority: TicketPriority.high,
        status: TicketStatus.in_progress,
      },
      {
        customerId: customers[2].id,
        categoryId: categories[2].id,
        title: "update account",
        description: "need to update the account details",
        priority: TicketPriority.low,
        status: TicketStatus.resolve,
      },
      {
        customerId: customers[0].id,
        categoryId: categories[0].id,
        title: "api error",
        description: "api returns 500",
        priority: TicketPriority.low,
        status: TicketStatus.resolve,
      },
      {
        customerId: customers[1].id,
        categoryId: categories[2].id,
        title: "password reset",
        description: "password reset not working",
        priority: TicketPriority.low,
        status: TicketStatus.open,
      },
    ],
  });

  await prisma.assignment.createMany({
    data: tickets.map((ticket, index) => ({
      ticketId: ticket.id,
      userId: staff[index % staff.length].id,
    })),
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
