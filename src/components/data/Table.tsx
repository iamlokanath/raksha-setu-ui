"use client";

import type { ReactNode } from "react";

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted">
          <tr>
            {headers.map((header) => (
              <th className="p-2" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-t border-line" key={index}>
              {row.map((cell, cellIndex) => (
                <td className="p-2" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ title, children, onCancel, cancelLabel }: { title: string; children: ReactNode; onCancel: () => void; cancelLabel: string }) {
  return (
    <div className="fixed inset-0 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <div className="w-full max-w-md border border-line bg-surface p-4" role="dialog">
        <h2 className="mb-3 text-lg">{title}</h2>
        {children}
        <button className="mt-3 underline" onClick={onCancel} type="button">
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
