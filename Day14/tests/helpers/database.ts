import { prisma } from "../../src/lib/prisma";

export const resetDatabase = async () => {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "Ticket" RESTART IDENTITY CASCADE');
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
