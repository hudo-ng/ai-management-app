import { Project } from "@prisma/client";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{project.name}</h3>
      {project.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {project.description}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Created {new Date(project.createdAt).toLocaleString()}
      </p>
    </article>
  );
}
