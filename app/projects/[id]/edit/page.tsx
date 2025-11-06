"use client";

import { useState, useEffect } from "react";
import {
  useProject,
  useEditProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { notFound, useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function EditProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  if (!id) return notFound();

  const { data, isLoading, error } = useProject(id);
  const updateMutation = useEditProject();
  const deleteMutation = useDeleteProject();

  useEffect(() => {
    if (data?.project) {
      setName(data.project.name);
      setDescription(data.project.description);
    }
  }, [data]);

  async function updateProject(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate(
      { id, name, description },
      {
        onSuccess: () => {
          router.push(`/projects`);
        },
      }
    );
  }

  async function deleteProject() {
    if (!confirm("Delete this project?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push(`/projects/${id}`),
    });
  }

  if (isLoading) return <p>Loading…</p>;

  if (error) return <p>Error loading project: {error.message}</p>;

  return (
    <form onSubmit={updateProject} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Project name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button
          type="submit"
          loading={updateMutation.isPending}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button type="button" onClick={deleteProject} className="bg-red-600">
          Delete
        </Button>
        {updateMutation.isSuccess && <p>Project updated</p>}
        {deleteMutation.isSuccess && <p>Project deleted</p>}
      </div>
    </form>
  );
}
