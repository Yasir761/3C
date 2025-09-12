
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    
  const body = await req.json()
  const { email, password, name } = body

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password:hashedPassword
    },
  })

  return NextResponse.json({ user })
}
