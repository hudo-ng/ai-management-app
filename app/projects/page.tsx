"use client";

import { useProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/ProjectCard";
import NewProjectForm from "@/components/NewProjectForm";
import { Project } from "@prisma/client";
import Link from "next/link";

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects();

  if (isLoading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const projects = data?.projects ?? [];

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create and manage your projects.
          </p>
        </div>
      </header>
      <NewProjectForm />
      {projects.length !== 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: Project) => (
            <Link href={`/projects/${p.id}`}>
              <ProjectCard key={p.id} project={p} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
