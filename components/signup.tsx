"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill every field; humans don't see this one.
    if (typeof data.get("company") === "string" && (data.get("company") as string).length > 0) {
      setStatus({ kind: "success", message: "Thanks — I'll be in touch." });
      return;
    }

    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstname"),
          lastName: data.get("lastname"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }

      form.reset();
      setStatus({
        kind: "success",
        message: "Got it. I'll reply within 48 hours.",
      });
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong — try again.",
      });
    }
  };

  return (
    <div
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black"
      id="contact"
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Start a conversation
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Brief me on the system you want to build, scale, or rescue.
      </p>

      <form className="my-8" onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              name="firstname"
              placeholder="Ada"
              type="text"
              required
              autoComplete="given-name"
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              name="lastname"
              placeholder="Lovelace"
              type="text"
              required
              autoComplete="family-name"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="ada@analyticalengine.com"
            type="email"
            required
            autoComplete="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">Tell me about the system</Label>
          <Input
            id="message"
            name="message"
            placeholder="What are you building, what's broken, what does scale look like?"
            type="text"
            required
          />
        </LabelInputContainer>

        {/* Honeypot — visually hidden, bot-readable */}
        <div aria-hidden="true" className="hidden">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-60"
          type="submit"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting" ? "Sending..." : "Send →"}
          <BottomGradient />
        </button>

        {status.kind === "success" && (
          <p className="mt-4 text-sm text-emerald-400">{status.message}</p>
        )}
        {status.kind === "error" && (
          <p className="mt-4 text-sm text-red-400">{status.message}</p>
        )}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
