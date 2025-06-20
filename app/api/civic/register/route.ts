import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, name, walletAddress } = await req.json();

  if (!email || !walletAddress) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  let user;
  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: { name, civicId: walletAddress },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        name,
        civicId: walletAddress,
      },
    });
  }

  return NextResponse.json({ success: true, user });
}
