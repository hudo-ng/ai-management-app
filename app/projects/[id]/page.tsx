"use client";
import { useProject } from "@/hooks/useProjects";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams();
  console.log(id);
  if (!id) return notFound();

  const { data, isLoading, error } = useProject(id as string);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading project: {error.message}</p>;

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {data.project.name}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Created {new Date(data.project.createdAt).toLocaleString()}
          </p>
        </div>
        <Link
          href={`/projects/${data.project.id}/edit`}
          className="rounded-xl border border-gray-200 bg-gray-900 px-3 py-1 text-sm font-medium text-white"
        >
          Edit
        </Link>
      </header>
      {data.project.description && <p>{data.project.description}</p>}
    </section>
  );
}
