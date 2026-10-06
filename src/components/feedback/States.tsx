"use client";

import { Button } from "@/components/ui/Controls";

export function Loader({ label }: { label: string }) {
  return <p className="p-4">{label}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="border border-line p-4">{message}</p>;
}

export function ErrorState({ message, onRetry, retryLabel }: { message: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div className="border border-ink p-4">
      <p>{message}</p>
      {onRetry && retryLabel ? (
        <Button className="mt-3" onClick={onRetry} type="button">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function Badge({ children }: { children: string }) {
  return <span className="inline-block border border-ink px-2 py-1 text-sm font-semibold">{children}</span>;
}

export function Card({ title, value }: { title: string; value: string }) {
  return (
    <article className="border border-line bg-muted p-4">
      <p className="text-sm text-ink-muted">{title}</p>
      <p className="text-2xl">{value}</p>
    </article>
  );
}
