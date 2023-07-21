import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

interface RequestBody {
  username: string;
  email: string;
  password: string;
}
function signJwtAccessToken(data: any) {
  const token = jwt.sign(data, "JIKEJEKJEKJkj", { expiresIn: "1h" });
  return token;
}
export async function POST(request: Request) {
  const body: RequestBody = await request.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "User with that email already exists" }),
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      password: hashedPassword,
    },
  });

  const accessToken = signJwtAccessToken(newUser);

  return NextResponse.redirect("/", {
    headers: {
      "Set-Cookie": `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
    },
  });
}
