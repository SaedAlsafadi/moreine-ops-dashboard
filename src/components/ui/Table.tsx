import React from 'react';

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card bg-surface shadow-card">
      <table className="w-full min-w-max text-start">
        <thead>
          <tr className="border-b border-border-light">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-4 text-start text-xs font-bold text-text-primary/60 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="transition-colors hover:bg-background/50">
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-4 text-sm text-text-secondary ${className}`}>
      {children}
    </td>
  );
}
