import { z } from 'zod';

import { ageField } from '@/lib/utils/zod-schema-helpers';

export const timelineFormSchema = z.object({
  lifeExpectancy: ageField(50, 110, {
    min: 'Life expectancy must be at least 50 years',
    max: 'Life expectancy must be at most 110 years',
  }),
  currentAge: ageField(16, 100, {
    min: 'You must be at least 16 years old to use this calculator',
    max: 'Age cannot exceed 100 years',
  }),
});

export type TimelineInputs = z.infer<typeof timelineFormSchema>;
