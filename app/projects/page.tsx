import ProjectCard from "@/components/ProjectCard";
import NewProjectForm from "@/components/NewProjectForm";
import { Project } from "@prisma/client";
import Link from "next/link";

async function getProjects() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAGE_URL ?? ""}/api/projects`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data.projects;
}
export default async function ProjectsPage() {
  const projects = await getProjects();

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
