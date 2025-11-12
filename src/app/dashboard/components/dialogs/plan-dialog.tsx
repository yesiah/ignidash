'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';
import { FileTextIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DialogTitle, DialogBody, DialogActions } from '@/components/catalyst/dialog';
import { planMetadataSchema, type PlanMetadata } from '@/lib/schemas/plan-metadata-schema';
import { Fieldset, FieldGroup, Field, Label, ErrorMessage } from '@/components/catalyst/fieldset';
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';

interface PlanDialogProps {
  onClose: () => void;
  numPlans: number;
  existingPlan: { id: Id<'plans'>; name: string } | null;
}

export default function PlanDialog({ onClose, numPlans, existingPlan }: PlanDialogProps) {
  const newPlanDefaultValues = useMemo(() => ({ name: 'Plan ' + (numPlans + 1) }) as const satisfies PlanMetadata, [numPlans]);

  const defaultValues = existingPlan || newPlanDefaultValues;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(planMetadataSchema),
    defaultValues,
  });

  const m = useMutation(api.plans.updatePlanName);
  const onSubmit = async (data: PlanMetadata) => {
    await m({ planId: existingPlan!.id, name: data.name });
    onClose();
  };

  return (
    <>
      <DialogTitle onClose={onClose}>
        <div className="flex items-center gap-4">
          <FileTextIcon className="text-primary size-8 shrink-0" aria-hidden="true" />
          <span>{existingPlan ? 'Edit Plan' : 'New Plan'}</span>
        </div>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset aria-label="Plan metadata">
          <DialogBody>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register('name')}
                  id="name"
                  name="name"
                  placeholder="My Plan"
                  autoComplete="off"
                  inputMode="text"
                  invalid={!!errors.name}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
              </Field>
            </FieldGroup>
          </DialogBody>
        </Fieldset>
        <DialogActions>
          <Button plain onClick={onClose} className="hidden sm:inline-flex">
            Cancel
          </Button>
          <Button color="rose" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
