'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  useMarketAssumptionsData,
  useUpdateMarketAssumptions,
  useStocksRealReturn,
  useBondsRealReturn,
  useCashRealReturn,
} from '@/lib/stores/quick-plan-store';
import { type MarketAssumptionsInputs, marketAssumptionsSchema } from '@/lib/schemas/quick-plan-schema';
import SectionHeader from '@/components/ui/section-header';
import SectionContainer from '@/components/ui/section-container';
import Card from '@/components/ui/card';
import NumberInputV2 from '@/components/ui/number-input-v2';
import { Field, FieldGroup, Fieldset, Label, Description, ErrorMessage } from '@/components/catalyst/fieldset';
import { Divider } from '@/components/catalyst/divider';
import { Button } from '@/components/catalyst/button';
import { DialogActions } from '@/components/catalyst/dialog';

export default function ExpectedReturnsDrawer() {
  const marketAssumptions = useMarketAssumptionsData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(marketAssumptionsSchema),
    defaultValues: marketAssumptions,
  });

  const updateMarketAssumptions = useUpdateMarketAssumptions();
  const onSubmit = (data: MarketAssumptionsInputs) => {
    updateMarketAssumptions({ ...data });
  };

  const stocksRealReturn = useStocksRealReturn();
  const bondsRealReturn = useBondsRealReturn();
  const cashRealReturn = useCashRealReturn();

  return (
    <>
      <SectionContainer showBottomBorder={false} location="drawer">
        <SectionHeader title="Expected Returns" desc="Set expected inflation rate and annual returns for each asset class." />
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Fieldset aria-label="Expected Returns">
              <FieldGroup>
                <Field>
                  <Label htmlFor="stock-return" className="flex w-full items-center justify-between">
                    <span>Stock Return</span>
                    <span className="text-muted-foreground text-sm/6">{stocksRealReturn.toFixed(1)}% real</span>
                  </Label>
                  <NumberInputV2 name="stockReturn" control={control} id="stockReturn" inputMode="decimal" placeholder="10%" suffix="%" />
                  {errors.stockReturn && <ErrorMessage>{errors.stockReturn?.message}</ErrorMessage>}
                  <Description>Expected annual return for stocks and other volatile investments.</Description>
                </Field>
                <Divider />
                <Field>
                  <Label htmlFor="bond-return" className="flex w-full items-center justify-between">
                    <span>Bond Return</span>
                    <span className="text-muted-foreground text-sm/6">{bondsRealReturn.toFixed(1)}% real</span>
                  </Label>
                  <NumberInputV2 id="bondReturn" control={control} name="bondReturn" inputMode="decimal" placeholder="5%" suffix="%" />
                  {errors.bondReturn && <ErrorMessage>{errors.bondReturn?.message}</ErrorMessage>}
                  <Description>Expected annual return for bonds.</Description>
                </Field>
                <Divider />
                <Field>
                  <Label htmlFor="cash-return" className="flex w-full items-center justify-between">
                    <span>Cash Return</span>
                    <span className="text-muted-foreground text-sm/6">{cashRealReturn.toFixed(1)}% real</span>
                  </Label>
                  <NumberInputV2 id="cashReturn" control={control} name="cashReturn" inputMode="decimal" placeholder="3%" suffix="%" />
                  {errors.cashReturn && <ErrorMessage>{errors.cashReturn?.message}</ErrorMessage>}
                  <Description>Expected annual interest rate for cash savings and money market accounts.</Description>
                </Field>
                <Divider />
                <Field>
                  <Label htmlFor="inflation-rate" className="flex w-full items-center justify-between">
                    <span>Inflation Rate</span>
                    <span className="text-muted-foreground text-sm/6">—</span>
                  </Label>
                  <NumberInputV2
                    id="inflationRate"
                    control={control}
                    name="inflationRate"
                    inputMode="decimal"
                    placeholder="3%"
                    suffix="%"
                  />
                  {errors.inflationRate && <ErrorMessage>{errors.inflationRate?.message}</ErrorMessage>}
                  <Description>Expected annual inflation rate, used to calculate real returns.</Description>
                </Field>
                <Divider />
              </FieldGroup>
            </Fieldset>
            <DialogActions>
              <Button outline onClick={() => reset()}>
                Reset
              </Button>
              <Button color="rose" type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
        </Card>
      </SectionContainer>
    </>
  );
}
