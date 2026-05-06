"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { SecondaryButton, DangerButton } from "./FormPrimitives";
import { setActiveResumeAction, deleteResumeAction } from "@/lib/actions/resume";

export function ResumeRowActions({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center justify-end gap-2">
      {!isActive && (
        <SecondaryButton
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await setActiveResumeAction(id);
              if (res?.ok) toast.success("Marked active");
              else toast.error("Failed");
            })
          }
        >
          Make active
        </SecondaryButton>
      )}
      <DangerButton
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Delete this resume version permanently?")) {
            start(() => deleteResumeAction(id));
          }
        }}
      >
        Delete
      </DangerButton>
    </div>
  );
}
