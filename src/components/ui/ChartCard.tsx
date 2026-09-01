import React from 'react';
import Card from 'components/card';

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card extra="p-5">
      <header className="mb-4 flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="text-sm font-medium text-text-secondary mt-1">{subtitle}</p>}
        </div>
      </header>
      <div className="h-72 w-full">
        {children}
      </div>
    </Card>
  );
}
