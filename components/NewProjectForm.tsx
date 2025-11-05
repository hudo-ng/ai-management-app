"use client";

import { useState } from "react";
import Button from "./ui/Button";

export default function NewProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      console.log(res);
      if (!res.ok) {
        const data = await res.json();
        console.log(data);
        setError(data?.error.name ?? "Failed to create project");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button loading={loading} type="submit">
        Create project
      </Button>
    </form>
  );
}
