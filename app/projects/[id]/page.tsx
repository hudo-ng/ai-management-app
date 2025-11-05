import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function ProjectDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const project = await prisma.project.findUnique({
    where: { id },
  });
  if (!project) return notFound();

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Created {new Date(project.createdAt).toLocaleString()}
          </p>
        </div>
        <Link
          href={`/projects/${project.id}/edit`}
          className="rounded-xl border border-gray-200 bg-gray-900 px-3 py-1 text-sm font-medium text-white"
        >
          Edit
        </Link>
      </header>
      {project.description && <p>{project.description}</p>}
    </section>
  );
}
