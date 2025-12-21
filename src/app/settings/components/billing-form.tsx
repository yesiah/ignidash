import { CreditCardIcon } from 'lucide-react';

import { Fieldset, FieldGroup, Legend, Field, Description } from '@/components/catalyst/fieldset';
import { Button } from '@/components/catalyst/button';
import Card from '@/components/ui/card';
import { Badge } from '@/components/catalyst/badge';

interface BillingFormProps {
  customerState: { activeSubscriptions: string[] };
}

export default function BillingForm({ customerState }: BillingFormProps) {
  const openBillingPortal = async () => {};

  return (
    <Card className="my-6">
      <form onSubmit={(e) => e.preventDefault()}>
        <Fieldset>
          <Legend className="flex items-center gap-2">
            <CreditCardIcon className="text-primary h-6 w-6" aria-hidden="true" />
            Billing status
            {customerState.activeSubscriptions.length > 0 ? <Badge color="green">Active</Badge> : <Badge color="zinc">Inactive</Badge>}
          </Legend>
          <FieldGroup>
            <Field>
              <Button color="rose" type="button" className="w-full" data-slot="control" onClick={openBillingPortal}>
                Open billing portal
              </Button>
              <Description>Visit the billing portal to manage your subscription, update payment methods, and view invoices.</Description>
            </Field>
          </FieldGroup>
        </Fieldset>
      </form>
    </Card>
  );
}
