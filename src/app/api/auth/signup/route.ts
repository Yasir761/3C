import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient(); // Initialize Prisma client

// POST endpoint to register a new user
export async function POST(req: Request) {
  const body = await req.json(); // Parse request body
  const { email, password, name } = body;

  // Validate required fields
  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password before saving
  const hashedPassword = await hash(password, 10);

  // Create new user in the database
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    },
  });

  // Return the created user (excluding password would be better for security)
  return NextResponse.json({ user });
}
