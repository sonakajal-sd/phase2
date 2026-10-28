import "dotenv/config";
import bcrypt from "bcrypt";
import { UserRole } from "../../generated/prisma/enums.js";
import prisma from "../../db/prisma.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("EMAIL ALREADY EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      passwordHash: passwordHash,
      role: role,
    },
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET!,
    {
      expiresIn: "12h",
    },
  );

  return {
    user,
    token,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("INVALID CREDENTIALS");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw new Error("INVALID CREDENTIALS");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET!,
    {
      expiresIn: "12h",
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}
