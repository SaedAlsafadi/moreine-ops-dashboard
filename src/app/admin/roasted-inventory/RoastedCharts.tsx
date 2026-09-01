'use client';

import React from 'react';
import PieChart from '@/components/charts/PieChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { useLanguage } from '@/lib/i18n/context';

export function ChannelSplitChart({ data }: { data: { channel: string, kg: number }[] }) {
  const { t } = useLanguage();
  
  // Exclude unallocated or group it
  const validData = data.filter(d => d.kg > 0);
  
  const chartData = validData.map(d => d.kg);
  
  const chartOptions = {
    labels: validData.map(d => d.channel.toUpperCase()),
    colors: ['#3d4a2e', '#9db090', '#ece7d4', '#A3AED0'], // Olive, Sage, Cream, Gray
    chart: { width: '100%' },
    states: { hover: { filter: { type: 'none' } } },
    legend: { show: true, position: 'bottom', labels: { colors: '#A3AED0' } },
    dataLabels: { enabled: true, formatter: (val: number, opts: any) => opts.w.config.series[opts.seriesIndex] + ' kg' },
    plotOptions: { pie: { expandOnClick: false, donut: { labels: { show: false } } } },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: { formatter: (val: number) => val + ' kg' }
    },
  };

  return (
    <ChartCard title={t('dashboard.roastedStock') || 'Stock by Channel'}>
      <PieChart chartData={chartData} chartOptions={chartOptions as any} />
    </ChartCard>
  );
}
