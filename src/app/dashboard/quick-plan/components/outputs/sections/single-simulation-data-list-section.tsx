'use client';

import { useMemo } from 'react';

import type { SimulationDataPoint, SimulationResult } from '@/lib/calc/v2/simulation-engine';
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/catalyst/description-list';
import { Subheading } from '@/components/catalyst/heading';
import { formatNumber } from '@/lib/utils';
import SectionHeader from '@/components/ui/section-header';
import SectionContainer from '@/components/ui/section-container';
import Card from '@/components/ui/card';

interface DataListCardProps {
  dp: SimulationDataPoint;
}

function PortfolioDataListCard({ dp }: DataListCardProps) {
  return null;
}

function CashFlowDataListCard({ dp }: DataListCardProps) {
  const grossIncome = dp.incomes?.totalGrossIncome ?? 0;
  const incomeTax = dp.taxes?.incomeTaxes.incomeTaxAmount ?? 0;
  const totalExpenses = dp.expenses?.totalExpenses ?? 0;
  const netCashFlow = grossIncome - incomeTax - totalExpenses;

  return (
    <Card>
      <Subheading level={4}>Cash Flow</Subheading>
      <DescriptionList>
        <DescriptionTerm>Gross Income</DescriptionTerm>
        <DescriptionDetails>{`+ ${formatNumber(grossIncome, 2, '$')}`}</DescriptionDetails>

        <DescriptionTerm>Income Tax</DescriptionTerm>
        <DescriptionDetails>{`- ${formatNumber(incomeTax, 2, '$')}`}</DescriptionDetails>

        <DescriptionTerm>Total Expenses</DescriptionTerm>
        <DescriptionDetails>{`- ${formatNumber(totalExpenses, 2, '$')}`}</DescriptionDetails>

        <DescriptionTerm className="font-semibold">Net</DescriptionTerm>
        <DescriptionDetails className="font-semibold">{`${netCashFlow < 0 ? '-' : '+'} ${formatNumber(Math.abs(netCashFlow), 2, '$')}`}</DescriptionDetails>
      </DescriptionList>
    </Card>
  );
}

interface SingleSimulationDataListSectionProps {
  simulation: SimulationResult;
  selectedAge: number;
}

export default function SingleSimulationDataListSection({ simulation, selectedAge }: SingleSimulationDataListSectionProps) {
  const dp = useMemo(() => {
    return simulation.data.find((dp) => {
      const startAge = simulation.context.startAge;
      const startDateYear = new Date().getFullYear();
      const currDateYear = new Date(dp.date).getFullYear();

      return currDateYear - startDateYear + startAge === selectedAge;
    });
  }, [simulation, selectedAge]);

  if (!dp) return null;

  return (
    <SectionContainer showBottomBorder>
      <SectionHeader title={'Data List'} desc={'Data List Desc'} className="mb-4" />
      <div className="grid grid-cols-1 gap-2 @3xl:grid-cols-2 @5xl:grid-cols-3">
        <PortfolioDataListCard dp={dp} />
        <CashFlowDataListCard dp={dp} />
      </div>
    </SectionContainer>
  );
}
