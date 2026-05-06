"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  TextField,
  TextareaField,
  FieldLabel,
  FormRow,
  PrimaryButton,
} from "./FormPrimitives";
import type { ExperienceView } from "@/lib/cms/types";
import {
  createExperienceAction,
  updateExperienceAction,
} from "@/lib/actions/experience";

type Mode = { kind: "create" } | { kind: "edit"; id: string };

export function ExperienceForm({ mode, initial }: { mode: Mode; initial?: ExperienceView }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res =
        mode.kind === "create"
          ? await createExperienceAction(null, fd)
          : await updateExperienceAction(mode.id, null, fd);
      if (res && "ok" in res && !res.ok) {
        setError(res.error ?? "Save failed");
        toast.error(res.error ?? "Save failed");
      } else {
        toast.success(mode.kind === "create" ? "Added" : "Saved");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <TextField id="title" name="title" required defaultValue={initial?.title} />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="company">Company</FieldLabel>
          <TextField id="company" name="company" required defaultValue={initial?.company} />
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <TextareaField id="description" name="description" required rows={4} defaultValue={initial?.description} />
      </FormRow>

      <div className="grid gap-4 md:grid-cols-3">
        <FormRow>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <TextField id="location" name="location" defaultValue={initial?.location} />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="startDate">Start date</FieldLabel>
          <TextField
            id="startDate"
            name="startDate"
            type="date"
            required
            defaultValue={initial?.startDate?.slice(0, 10)}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="endDate" hint="empty = current">
            End date
          </FieldLabel>
          <TextField
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={initial?.endDate?.slice(0, 10) ?? ""}
          />
        </FormRow>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormRow>
          <FieldLabel htmlFor="thumbnail">Thumbnail path</FieldLabel>
          <TextField
            id="thumbnail"
            name="thumbnail"
            placeholder="/exp1.svg"
            defaultValue={initial?.thumbnail}
          />
        </FormRow>
        <FormRow>
          <FieldLabel htmlFor="order">Order</FieldLabel>
          <TextField id="order" name="order" type="number" min={0} defaultValue={initial?.order ?? 0} />
        </FormRow>
      </div>

      <FormRow>
        <FieldLabel htmlFor="highlights" hint="one per line">
          Highlights
        </FieldLabel>
        <TextareaField
          id="highlights"
          name="highlights"
          rows={5}
          defaultValue={(initial?.highlights ?? []).join("\n")}
        />
      </FormRow>

      <FormRow>
        <FieldLabel htmlFor="technologies" hint="comma-separated">
          Technologies
        </FieldLabel>
        <TextField
          id="technologies"
          name="technologies"
          defaultValue={(initial?.technologies ?? []).join(", ")}
        />
      </FormRow>

      {error && (
        <p className="text-sm text-red-300 border border-red-500/30 rounded-lg bg-red-500/10 px-3 py-2">
          {error}
        </p>
      )}

      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Saving..." : mode.kind === "create" ? "Add experience" : "Save changes"}
      </PrimaryButton>
    </form>
  );
}
