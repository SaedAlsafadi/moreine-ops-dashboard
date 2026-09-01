'use client';

import React from 'react';
import BarChart from '@/components/charts/BarChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { useLanguage } from '@/lib/i18n/context';

export function RevenueChart({ data }: { data: { date: string, b2c: number, b2b: number }[] }) {
  const { t } = useLanguage();
  
  const chartData = [
    {
      name: 'B2C',
      data: data.map(d => d.b2c),
    },
    {
      name: 'B2B',
      data: data.map(d => d.b2b),
    }
  ];

  const chartOptions = {
    chart: { stacked: true, toolbar: { show: false } },
    tooltip: { style: { fontSize: '12px', fontFamily: 'DM Sans' }, theme: 'dark' },
    xaxis: {
      categories: data.map(d => d.date),
      show: true,
      labels: { show: true, style: { colors: '#A3AED0', fontSize: '14px', fontWeight: '500' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: { show: true, style: { colors: '#A3AED0', fontSize: '14px', fontWeight: '500' } },
    },
    grid: { show: false },
    legend: { show: true, position: 'top', horizontalAlign: 'right', labels: { colors: '#A3AED0' } },
    dataLabels: { enabled: false },
    colors: ['#9db090', '#3d4a2e'], // Sage, Olive
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: '20px' },
    },
  };

  return (
    <ChartCard title={t('sales.revenue') || 'Revenue Over Time'}>
      <BarChart chartData={chartData} chartOptions={chartOptions as any} />
    </ChartCard>
  );
}
