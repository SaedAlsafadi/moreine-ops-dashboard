'use client';

import React from 'react';
import LineChart from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { useLanguage } from '@/lib/i18n/context';

export function YieldTrendChart({ data }: { data: any[] }) {
  const { t } = useLanguage();
  
  const chartData = [
    {
      name: t('roasting.yieldPct') || 'Yield %',
      data: data.map(d => d.yield_pct).reverse(), // Reverse to show chronological order
    },
  ];

  const chartOptions = {
    chart: { toolbar: { show: false }, dropShadow: { enabled: true, top: 13, left: 0, blur: 10, opacity: 0.1, color: '#9db090' } },
    colors: ['#9db090'], // Sage Green
    markers: { size: 0, colors: 'white', strokeColors: '#9db090', strokeWidth: 3, strokeOpacity: 0.9, fillOpacity: 1, hover: { size: 7 } },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      type: 'category',
      categories: data.map(d => d.roast_date).reverse(),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '500' } },
    },
    yaxis: {
      show: true,
      labels: { formatter: (val: number) => val + '%', style: { colors: '#A3AED0', fontSize: '12px', fontWeight: '500' } },
    },
    grid: {
      show: true,
      borderColor: 'rgba(163, 174, 208, 0.3)',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    tooltip: { theme: 'dark' },
  };

  return (
    <ChartCard title={t('dashboard.averageYield') || 'Yield Trend'}>
      <LineChart chartData={chartData} chartOptions={chartOptions as any} />
    </ChartCard>
  );
}
