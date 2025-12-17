'use client';

import { ConvexError } from 'convex/values';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Id } from '@/convex/_generated/dataModel';

import { DialogTitle, DialogBody, DialogActions } from '@/components/catalyst/dialog';
import { generateInsightsSchema, type GenerateInsightsInputs } from '@/lib/schemas/generate-insights-schema';
import { Fieldset, FieldGroup, Field, Label, Description, ErrorMessage } from '@/components/catalyst/fieldset';
import ErrorMessageCard from '@/components/ui/error-message-card';
import { Button } from '@/components/catalyst/button';
import { Textarea } from '@/components/catalyst/textarea';

interface GenerateDialogProps {
  onClose: () => void;
  planId: Id<'plans'>;
}

export default function GenerateDialog({ onClose, planId }: GenerateDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(generateInsightsSchema),
    defaultValues: { userPrompt: undefined },
  });

  const m = useMutation(api.insights.generate);
  const [saveError, setSaveError] = useState<string | null>(null);

  const onSubmit = async (data: GenerateInsightsInputs) => {
    try {
      setSaveError(null);
      await m({ planId, userPrompt: data.userPrompt });
      onClose();
    } catch (error) {
      setSaveError(error instanceof ConvexError ? error.message : 'Failed to generate insights.');
      console.error('Error generating insights: ', error);
    }
  };

  return (
    <>
      <DialogTitle onClose={onClose}>
        <div className="flex items-center gap-4">
          <SparklesIcon className="text-primary size-8 shrink-0" aria-hidden="true" />
          <span>Generate Insights</span>
        </div>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset aria-label="Generate insights">
          <DialogBody>
            <FieldGroup>
              {saveError && <ErrorMessageCard errorMessage={saveError} />}
              <Field>
                <Label htmlFor="userPrompt">User Prompt</Label>
                <Textarea
                  autoFocus
                  {...register('userPrompt')}
                  id="userPrompt"
                  name="userPrompt"
                  aria-label="User prompt"
                  resizable={false}
                  rows={4}
                />
                {errors.userPrompt && <ErrorMessage>{errors.userPrompt?.message}</ErrorMessage>}
                <Description>Enter a prompt to generate insights.</Description>
              </Field>
            </FieldGroup>
          </DialogBody>
        </Fieldset>
        <DialogActions>
          <Button plain onClick={onClose} className="hidden sm:inline-flex" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button color="rose" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
