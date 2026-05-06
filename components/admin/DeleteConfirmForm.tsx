"use client";

import { useTransition } from "react";

import { DangerButton } from "./FormPrimitives";

export function DeleteConfirmForm({
  action,
  label = "Delete",
  confirmMessage = "Delete permanently?",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <DangerButton
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          start(() => action());
        }
      }}
    >
      {pending ? "..." : label}
    </DangerButton>
  );
}
