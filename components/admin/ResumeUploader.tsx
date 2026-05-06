"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  TextField,
  FieldLabel,
  FormRow,
  PrimaryButton,
} from "./FormPrimitives";
import { uploadResumeAction } from "@/lib/actions/resume";

export function ResumeUploader() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    start(async () => {
      const res = await uploadResumeAction(null, fd);
      if (res?.ok) {
        toast.success("Resume uploaded");
        ref.current?.reset();
      } else {
        setError(res?.error ?? "Upload failed");
        toast.error(res?.error ?? "Upload failed");
      }
    });
  }

  return (
    <form ref={ref} onSubmit={onSubmit} encType="multipart/form-data" className="space-y-4 max-w-xl">
      <FormRow>
        <FieldLabel htmlFor="file" hint="PDF only · max 8 MB">
          File
        </FieldLabel>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          required
          className="block w-full text-sm text-white-100 file:mr-3 file:rounded-md file:border-0 file:bg-purple file:text-black-100 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-purple/90"
        />
      </FormRow>
      <FormRow>
        <FieldLabel htmlFor="notes">Internal notes (optional)</FieldLabel>
        <TextField id="notes" name="notes" placeholder="e.g. v2.3 — added MetSupSpace bullet" />
      </FormRow>
      <label className="flex items-center gap-2 text-sm text-white-100">
        <input
          type="checkbox"
          name="setActive"
          defaultChecked
          className="rounded border-white/20 bg-black-200 text-purple"
        />
        Make this the active resume (replaces the current one on /resume and /api/resume)
      </label>
      {error && <p className="text-xs text-red-300">{error}</p>}
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Uploading..." : "Upload PDF"}
      </PrimaryButton>
    </form>
  );
}
