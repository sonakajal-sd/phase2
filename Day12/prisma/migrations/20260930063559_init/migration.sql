-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "assignee" VARCHAR(100),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
