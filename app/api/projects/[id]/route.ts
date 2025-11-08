import { prisma } from "@/lib/db";
import z from "zod";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";
import { error } from "console";

type Params = Promise<{ id: string }>;
const UpdateProject = z.object({
  name: z.string().min(1, "Project name required").optional(),
  description: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Project id not found" },
      { status: 400 }
    );
  }
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "No project found" }, { status: 400 });
  }
  return NextResponse.json({ project }, { status: 200 });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project id not found" },
        { status: 404 }
      );
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 400 });

    if (project?.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = UpdateProject.safeParse(body);
    if (!parsedBody.success) {
      const flattenError = z.flattenError(parsedBody.error);
      return NextResponse.json(
        { error: flattenError.fieldErrors },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: parsedBody.data,
    });
    return NextResponse.json(
      { updatedProject, message: "Project updated" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Project id not found" },
        { status: 404 }
      );
    }

    const p = await prisma.project.findUnique({
      where: { id },
    });

    if (!p)
      return NextResponse.json({ error: "Project not found" }, { status: 400 });

    if (p.ownerId! === session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
