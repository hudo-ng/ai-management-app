import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { prisma } from "@/lib/db";
import { error } from "console";

const CreateProject = z.object({
  name: z.string({ error: "Project name required" }).min(1).max(120),
  description: z.string().max(1000).optional(),
});

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = CreateProject.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({
      message: parsedBody.error.message,
    });
  }

  const { name, description } = parsedBody.data;
  const project = await prisma.project.create({
    data: {
      name,
      description,
    },
  });
  return NextResponse.json({ message: "Project created", status: 201 });
}
