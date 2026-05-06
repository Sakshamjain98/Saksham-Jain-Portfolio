"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { SelectField } from "./FormPrimitives";
import {
  updateLeadStatusAction,
  updateLeadPriorityAction,
} from "@/lib/actions/leads";

const STATUSES = ["new", "contacted", "qualified", "won", "archived", "spam"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;

export function LeadStatusControls({
  id,
  status,
  priority,
}: {
  id: string;
  status: (typeof STATUSES)[number];
  priority: (typeof PRIORITIES)[number];
}) {
  const [pending, start] = useTransition();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <p className="text-[0.65rem] uppercase tracking-widest text-white-200 mb-1.5">Status</p>
        <SelectField
          defaultValue={status}
          disabled={pending}
          onChange={(e) =>
            start(async () => {
              const res = await updateLeadStatusAction(id, e.target.value);
              if (res?.ok) toast.success("Status updated");
              else toast.error(res?.error ?? "Failed");
            })
          }
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
      </div>
      <div>
        <p className="text-[0.65rem] uppercase tracking-widest text-white-200 mb-1.5">Priority</p>
        <SelectField
          defaultValue={priority}
          disabled={pending}
          onChange={(e) =>
            start(async () => {
              const res = await updateLeadPriorityAction(id, e.target.value);
              if (res?.ok) toast.success("Priority updated");
              else toast.error(res?.error ?? "Failed");
            })
          }
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}
