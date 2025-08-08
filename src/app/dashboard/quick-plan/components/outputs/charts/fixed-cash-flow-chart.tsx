'use client';

import { useRef } from 'react';
import { BarChart, ResponsiveContainer } from 'recharts';

export default function FixedCashFlowChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={chartRef} className="h-64 w-full sm:h-80 lg:h-96 [&_svg:focus]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart />
      </ResponsiveContainer>
    </div>
  );
}
