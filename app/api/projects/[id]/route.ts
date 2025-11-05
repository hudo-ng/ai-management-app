import { prisma } from "@/lib/db";
import z from "zod";
import { NextResponse } from "next/server";

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

export async function PATCH(res: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await res.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project id not found" },
        { status: 404 }
      );
    }

    const parsedBody = UpdateProject.safeParse(body);
    if (!parsedBody.success) {
      const flattenError = z.flattenError(parsedBody.error);
      return NextResponse.json(
        { error: flattenError.fieldErrors },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: parsedBody.data,
    });
    return NextResponse.json(
      { project, message: "Project updated" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Project id not found" },
        { status: 404 }
      );
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
