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
import type { BlogPostView } from "@/lib/cms/types";
import { createBlogPostAction, updateBlogPostAction } from "@/lib/actions/blog";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

export function BlogForm({
  mode,
  initial,
  defaultAuthorEmail,
  defaultAuthorName,
}: {
  mode: Mode;
  initial?: BlogPostView;
  defaultAuthorEmail: string;
  defaultAuthorName?: string;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        const res =
          mode.kind === "create"
            ? await createBlogPostAction(null, fd)
            : await updateBlogPostAction(mode.id, null, fd);
        if (res && "ok" in res && !res.ok) {
          setError(res.error ?? "Save failed");
          toast.error(res.error ?? "Save failed");
        } else {
          toast.success(mode.kind === "create" ? "Post created" : "Post saved");
        }
      } catch (err) {
        const m = err instanceof Error ? err.message : "Save failed";
        setError(m);
        toast.error(m);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <TextField
            id="slug"
            name="slug"
            required
            placeholder="my-post"
            pattern="[a-z0-9-]+"
            defaultValue={initial?.slug}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <SelectField id="status" name="status" defaultValue={initial?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </SelectField>
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <TextField id="title" name="title" required defaultValue={initial?.title} />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
        <TextareaField
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          maxLength={500}
          defaultValue={initial?.excerpt}
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="contentMdx" hint="MDX — markdown + JSX">
          Content
        </FieldLabel>
        <TextareaField
          id="contentMdx"
          name="contentMdx"
          required
          rows={22}
          spellCheck={false}
          className="font-mono text-xs leading-relaxed"
          defaultValue={initial?.contentMdx}
          placeholder={"# Heading\n\nMarkdown body here.\n\n```ts\nconst x = 1;\n```"}
        />
      </FormRow>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="coverImage">Cover image URL</FieldLabel>
          <TextField id="coverImage" name="coverImage" defaultValue={initial?.coverImage} />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="ogImage">OG image URL (override)</FieldLabel>
          <TextField id="ogImage" name="ogImage" defaultValue={initial?.ogImage} />
        </FormRow>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="tags" hint="comma-separated">
            Tags
          </FieldLabel>
          <TextField
            id="tags"
            name="tags"
            placeholder="system-design, mongodb, nextjs"
            defaultValue={(initial?.tags ?? []).join(", ")}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <TextField id="category" name="category" defaultValue={initial?.category} />
        </FormRow>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="authorName">Author name</FieldLabel>
          <TextField
            id="authorName"
            name="authorName"
            defaultValue={initial?.authorName ?? defaultAuthorName}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="publishedAt">Published at (override)</FieldLabel>
          <TextField
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={
              initial?.publishedAt
                ? new Date(initial.publishedAt).toISOString().slice(0, 16)
                : ""
            }
          />
        </FormRow>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="seoTitle">SEO title</FieldLabel>
          <TextField id="seoTitle" name="seoTitle" defaultValue={initial?.seoTitle} />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="seoDescription">SEO description</FieldLabel>
          <TextField id="seoDescription" name="seoDescription" defaultValue={initial?.seoDescription} />
        </FormRow>
      </div>

      <input type="hidden" name="authorEmail" value={defaultAuthorEmail} />

      {error && (
        <p className="text-sm text-red-300 border border-red-500/30 rounded-lg bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Saving..." : mode.kind === "create" ? "Create post" : "Save changes"}
        </PrimaryButton>
      </div>
    </form>
  );
}
