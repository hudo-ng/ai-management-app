"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/useProjects";
import Button from "./ui/Button";

export default function NewProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useCreateProject();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName(""), setDescription("");
        },
      }
    );
  }

  return (
    <form className="rounded-2xl border p-4 space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Project name</label>
        <input
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-300 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          rows={3}
        />
      </div>
      {mutation.error && (
        <p className="text-sm text-red-600">{mutation.error.message}</p>
      )}
      <Button
        loading={mutation.isPending}
        disabled={mutation.isPending}
        type="submit"
      >
        {mutation.isPending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
