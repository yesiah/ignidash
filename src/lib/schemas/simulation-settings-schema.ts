import { z } from 'zod';

import { simulationModes } from '@/lib/stores/quick-plan-store';

export const simulationSettingsSchema = z.object({
  simulationMode: z.enum(simulationModes),
});

export type SimulationSettingsInputs = z.infer<typeof simulationSettingsSchema>;
