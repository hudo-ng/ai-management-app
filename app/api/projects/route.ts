import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/db";

const CreateProject = z.object({
  name: z.string().min(1, "project name cant not be empty").max(120),
  description: z.string().max(1000).optional(),
});


export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = CreateProject.safeParse(body);
  if (!parsedBody.success) {
    const flattenErrors = z.flattenError(parsedBody.error);
    return NextResponse.json(
      {
        error: flattenErrors.fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, description } = parsedBody.data;
  const project = await prisma.project.create({
    data: {
      name,
      description,
    },
  });
  return NextResponse.json(
    {
      id: project.id,
      message: "Project created",
    },
    { status: 201 }
  );
}

