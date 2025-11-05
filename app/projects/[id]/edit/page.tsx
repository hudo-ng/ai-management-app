"use client";

import { useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function EditProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { id } = useParams<{ id: string }>();
  if (!id) return notFound();

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.project.name),
          setDescription(data.project.description || "");
        setLoading(false);
      });
  }, [id]);

  async function updateProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error.name ?? "Failed to update");
        return;
      }
      router.push(`/projects/${id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject() {
    if (!confirm("Delete this project?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error.name ?? "Failed to delete");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;

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
        <Button type="submit" loading={saving}>
          Save
        </Button>
        <Button type="button" onClick={deleteProject} className="bg-red-600">
          Delete
        </Button>
      </div>
    </form>
  );
}
