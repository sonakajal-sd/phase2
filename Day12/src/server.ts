import { app } from "./app.js";
import { prisma } from "./db/prisma.js";

const PORT = Number(process.env["PORT"] ?? 3000);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
