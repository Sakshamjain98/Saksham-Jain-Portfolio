import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const baseField =
  "w-full rounded-lg border border-white/10 bg-black-200/40 px-3 py-2 text-sm text-white placeholder:text-white-200/60 focus:outline-none focus:ring-2 focus:ring-purple/40 focus:border-purple/40 disabled:opacity-50";

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(baseField, className)} {...rest} />;
  },
);

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextareaField({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(baseField, "min-h-[7rem] resize-y", className)}
        {...rest}
      />
    );
  },
);

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectField({ className, children, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(baseField, className)} {...rest}>
        {children}
      </select>
    );
  },
);

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-medium uppercase tracking-widest text-white-200 mb-1.5"
    >
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-white-200/70">{hint}</span>}
    </label>
  );
}

export function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

export function PrimaryButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-purple text-black-100 px-4 py-2 text-sm font-semibold hover:bg-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
        className,
      )}
      {...rest}
    />
  );
}

export function SecondaryButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:border-white/40 transition-colors",
        className,
      )}
      {...rest}
    />
  );
}

export function DangerButton({
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 px-4 py-2 text-sm font-medium transition-colors",
        className,
      )}
      {...rest}
    />
  );
}
