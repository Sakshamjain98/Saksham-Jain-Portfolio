"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  TextField,
  TextareaField,
  SelectField,
  FieldLabel,
  FormRow,
  PrimaryButton,
} from "./FormPrimitives";
import type { ProjectView } from "@/lib/cms/types";
import {
  createProjectAction,
  updateProjectAction,
} from "@/lib/actions/projects";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

export function ProjectForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: ProjectView;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sectionsJson, setSectionsJson] = useState(
    JSON.stringify(initial?.sections ?? [], null, 2),
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("sectionsJson", sectionsJson);

    start(async () => {
      try {
        const res =
          mode.kind === "create"
            ? await createProjectAction(null, fd)
            : await updateProjectAction(mode.id, null, fd);

        if (res && "ok" in res && !res.ok) {
          setError(res.error ?? "Save failed");
          toast.error(res.error ?? "Save failed");
        } else {
          toast.success(mode.kind === "create" ? "Project created" : "Project saved");
        }
      } catch (err) {
        const m = err instanceof Error ? err.message : "Save failed";
        setError(m);
        toast.error(m);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <TextField
            id="slug"
            name="slug"
            required
            placeholder="my-project"
            defaultValue={initial?.slug}
            pattern="[a-z0-9-]+"
            title="Lowercase letters, digits, and hyphens"
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <TextField id="title" name="title" required defaultValue={initial?.title} />
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
        <TextField
          id="tagline"
          name="tagline"
          required
          maxLength={240}
          defaultValue={initial?.tagline}
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="description">Short description</FieldLabel>
        <TextareaField
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={initial?.description}
        />
      </FormRow>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="liveUrl">Live URL</FieldLabel>
          <TextField
            id="liveUrl"
            name="liveUrl"
            type="url"
            placeholder="https://"
            defaultValue={initial?.liveUrl}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="repoUrl">Repository URL</FieldLabel>
          <TextField
            id="repoUrl"
            name="repoUrl"
            type="url"
            placeholder="https://github.com/..."
            defaultValue={initial?.repoUrl}
          />
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="coverImage">Cover image path</FieldLabel>
        <TextField
          id="coverImage"
          name="coverImage"
          placeholder="/projects/my-project.svg"
          defaultValue={initial?.coverImage}
        />
      </FormRow>

      <div className="grid gap-4 md:grid-cols-3">
        <FormRow>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <SelectField id="status" name="status" defaultValue={initial?.status ?? "live"}>
            <option value="live">Live</option>
            <option value="in-development">In development</option>
            <option value="private">Private (hidden)</option>
          </SelectField>
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="order">Order</FieldLabel>
          <TextField
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={initial?.order ?? 0}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
          <label className="flex items-center gap-2 mt-2 text-sm text-white-100">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              defaultChecked={initial?.isFeatured ?? true}
              className="rounded border-white/20 bg-black-200 text-purple"
            />
            Show on homepage and projects index
          </label>
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="iconLists" hint="comma-separated SVG paths">
          Stack icons
        </FieldLabel>
        <TextField
          id="iconLists"
          name="iconLists"
          placeholder="/next.svg, /ts.svg, /tail.svg"
          defaultValue={(initial?.iconLists ?? []).join(", ")}
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="technologies" hint="comma-separated">
          Technologies (text)
        </FieldLabel>
        <TextField
          id="technologies"
          name="technologies"
          placeholder="Next.js, MongoDB, Vercel"
          defaultValue={(initial?.technologies ?? []).join(", ")}
        />
      </FormRow>

      <FormRow>
        <FieldLabel hint="JSON array — kind / heading / body / order">
          Sections
        </FieldLabel>
        <TextareaField
          rows={14}
          spellCheck={false}
          value={sectionsJson}
          onChange={(e) => setSectionsJson(e.target.value)}
          className="font-mono text-xs"
        />
        <p className="text-[0.65rem] text-white-200 mt-1">
          kinds: overview · problem · architecture · stack · scaling · challenges · outcomes · custom
        </p>
      </FormRow>

      {error && (
        <p className="text-sm text-red-300 border border-red-500/30 rounded-lg bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Saving..." : mode.kind === "create" ? "Create project" : "Save changes"}
        </PrimaryButton>
      </div>
    </form>
  );
}
