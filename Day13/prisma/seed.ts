import { prisma } from "../src/prisma";

async function main() {
  await prisma.ticket.createMany({
    data: [
      {
        title: "Login issue",
        description: "Customer cannot log in",
        priority: "high",
        status: "open",
        assignee: "Arun",
      },
      {
        title: "Payment failed",
        description: "Payment failed during checkout",
        priority: "high",
        status: "in_progress",
        assignee: "Priya",
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
      {
        title: "Email not received",
        description: "Customer did not receive confirmation email",
        priority: "medium",
        status: "open",
        assignee: "Priya",
      },
      {
        title: "Account locked",
        description: "Customer account is locked",
        priority: "high",
        status: "open",
        assignee: "Rahul",
      },
      {
        title: "Refund request",
        description: "Customer requested a refund",
        priority: "medium",
        status: "resolved",
        assignee: "Arun",
      },
      {
        title: "Wrong invoice",
        description: "Invoice contains incorrect amount",
        priority: "high",
        status: "in_progress",
        assignee: "Priya",
      },
      {
        title: "Change phone number",
        description: "Customer wants to update phone number",
        priority: "low",
        status: "closed",
        assignee: "Rahul",
      },
      {
        title: "Subscription issue",
        description: "Customer cannot access subscription",
        priority: "medium",
        status: "open",
        assignee: "Arun",
      },
    ],
  });

  console.log("Seed data created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });