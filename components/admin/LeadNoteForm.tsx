"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  TextareaField,
  PrimaryButton,
  FieldLabel,
  FormRow,
} from "./FormPrimitives";
import { addLeadNoteAction } from "@/lib/actions/leads";

export function LeadNoteForm({ leadId }: { leadId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await addLeadNoteAction(leadId, null, fd);
      if (res?.ok) {
        toast.success("Note added");
        ref.current?.reset();
      } else {
        setError(res?.error ?? "Failed");
        toast.error(res?.error ?? "Failed");
      }
    });
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-3">
      <FormRow>
        <FieldLabel htmlFor="body">Add a note</FieldLabel>
        <TextareaField id="body" name="body" required rows={3} placeholder="What's the next step?" />
      </FormRow>
      {error && <p className="text-xs text-red-300">{error}</p>}
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save note"}
      </PrimaryButton>
    </form>
  );
}
