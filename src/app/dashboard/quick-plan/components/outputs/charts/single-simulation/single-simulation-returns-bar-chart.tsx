'use client';

import { useTheme } from 'next-themes';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList /* Tooltip */ } from 'recharts';

import { formatNumber } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SingleSimulationReturnsChartDataPoint } from '@/lib/types/chart-data-points';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomLabelListContent = (props: any) => {
  const { x, y, width, height, offset, value, isSmallScreen, dataView } = props;
  if (!value || value === 0) {
    return null;
  }

  const formatValue = (value: number, mode: 'rates' | 'annualAmounts' | 'totalAmounts') => {
    switch (mode) {
      case 'rates':
        return `${(value * 100).toFixed(2)}%`;
      case 'annualAmounts':
      case 'totalAmounts':
        return formatNumber(value, 1, '$');
      default:
        return value;
    }
  };

  return (
    <text
      x={x + width / 2}
      y={y + height / 2 + (isSmallScreen ? offset : 0)}
      fill="currentColor"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-xs sm:text-sm"
    >
      <tspan className="font-semibold">{formatValue(value, dataView)}</tspan>
    </text>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomizedAxisTick = ({ x, y, stroke, payload }: any) => {
  const truncateText = (text: string, maxLength = 18) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '…' : text;
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="currentColor" transform="rotate(-35)" fontSize={12}>
        {truncateText(payload.value)}
      </text>
    </g>
  );
};

interface SingleSimulationReturnsBarChartProps {
  age: number;
  dataView: 'rates' | 'annualAmounts' | 'totalAmounts';
  rawChartData: SingleSimulationReturnsChartDataPoint[];
}

export default function SingleSimulationReturnsBarChart({ age, dataView, rawChartData }: SingleSimulationReturnsBarChartProps) {
  const { resolvedTheme } = useTheme();
  const isSmallScreen = useIsMobile();

  const chartData = rawChartData.filter((item) => item.age === age);

  let formatter = undefined;
  let transformedChartData: { name: string; amount: number }[] = [];
  switch (dataView) {
    case 'rates':
      transformedChartData = chartData.flatMap((item) => [
        { name: 'Stocks Rate', amount: item.stocksRate },
        { name: 'Bonds Rate', amount: item.bondsRate },
        { name: 'Cash Rate', amount: item.cashRate },
        { name: 'Inflation Rate', amount: item.inflationRate },
      ]);
      formatter = (value: number) => `${(value * 100).toFixed(2)}%`;
      break;
    case 'annualAmounts':
      transformedChartData = chartData.flatMap((item) => [
        { name: 'Stocks Amount', amount: item.stocksAmount },
        { name: 'Bonds Amount', amount: item.bondsAmount },
        { name: 'Cash Amount', amount: item.cashAmount },
      ]);
      formatter = (value: number) => formatNumber(value, 1, '$');
      break;
    case 'totalAmounts':
      transformedChartData = chartData.flatMap((item) => [
        { name: 'Total Stocks', amount: item.totalStocksAmount },
        { name: 'Total Bonds', amount: item.totalBondsAmount },
        { name: 'Total Cash', amount: item.totalCashAmount },
      ]);
      formatter = (value: number) => formatNumber(value, 1, '$');
      break;
  }

  if (transformedChartData.length === 0) {
    return null;
  }

  const gridColor = resolvedTheme === 'dark' ? '#374151' : '#d1d5db'; // gray-700 : gray-300
  const foregroundMutedColor = resolvedTheme === 'dark' ? '#d1d5db' : '#4b5563'; // gray-300 : gray-600

  const shouldUseCustomTick = transformedChartData.length > 5 || isSmallScreen;
  const tick = shouldUseCustomTick ? CustomizedAxisTick : { fill: foregroundMutedColor };
  const bottomMargin = shouldUseCustomTick ? 50 : 0;

  return (
    <div>
      <div className="h-64 w-full sm:h-72 lg:h-80 [&_svg:focus]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedChartData}
            className="text-xs"
            margin={{ top: 0, right: 10, left: 10, bottom: bottomMargin }}
            tabIndex={-1}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis tick={tick} axisLine={false} dataKey="name" interval={0} />
            <YAxis tick={{ fill: foregroundMutedColor }} axisLine={false} hide={isSmallScreen} tickFormatter={formatter} />
            <Bar dataKey="amount" maxBarSize={250} minPointSize={20} fill="var(--chart-3)" stroke="var(--chart-1)">
              <LabelList
                dataKey="amount"
                position="middle"
                content={<CustomLabelListContent isSmallScreen={isSmallScreen} dataView={dataView} />}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
