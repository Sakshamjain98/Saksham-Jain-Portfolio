"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  TextField,
  FieldLabel,
  FormRow,
  PrimaryButton,
  SecondaryButton,
} from "@/components/admin/FormPrimitives";

export function LoginForm({
  emailMagicLinkEnabled,
  callbackUrl,
}: {
  emailMagicLinkEnabled: boolean;
  callbackUrl?: string;
}) {
  const [tab, setTab] = useState<"credentials" | "magic">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const dest = callbackUrl || "/admin";

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: dest,
    });
    setBusy(false);
    if (!res || res.error) {
      setErr("Invalid email or password.");
      return;
    }
    router.push(res.url ?? dest);
    router.refresh();
  }

  async function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await signIn("email", { email, redirect: false, callbackUrl: dest });
    setBusy(false);
    if (!res || res.error) {
      setErr("Couldn't send the link. Check the email and try again.");
      return;
    }
    router.push("/admin/login?verify=1");
  }

  return (
    <div className="mt-6">
      {emailMagicLinkEnabled && (
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-black-100 p-1 mb-5">
          <button
            type="button"
            className={`text-xs py-1.5 rounded-md transition-colors ${
              tab === "credentials"
                ? "bg-white/[0.06] text-white"
                : "text-white-200 hover:text-white"
            }`}
            onClick={() => setTab("credentials")}
          >
            Password
          </button>
          <button
            type="button"
            className={`text-xs py-1.5 rounded-md transition-colors ${
              tab === "magic"
                ? "bg-white/[0.06] text-white"
                : "text-white-200 hover:text-white"
            }`}
            onClick={() => setTab("magic")}
          >
            Magic link
          </button>
        </div>
      )}

      {tab === "credentials" ? (
        <form onSubmit={submitCredentials} className="space-y-4">
          <FormRow>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <TextField
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormRow>
          <FormRow>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <TextField
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormRow>
          {err && <p className="text-xs text-red-300">{err}</p>}
          <PrimaryButton type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in..." : "Sign in"}
          </PrimaryButton>
        </form>
      ) : (
        <form onSubmit={submitMagic} className="space-y-4">
          <FormRow>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <TextField
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormRow>
          {err && <p className="text-xs text-red-300">{err}</p>}
          <SecondaryButton type="submit" disabled={busy} className="w-full">
            {busy ? "Sending..." : "Send sign-in link"}
          </SecondaryButton>
          <p className="text-[0.7rem] text-white-200">
            We&apos;ll email a one-time sign-in link valid for an hour.
          </p>
        </form>
      )}
    </div>
  );
}
