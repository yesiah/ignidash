import { TimelineInputs } from '@/lib/schemas/timeline-form-schema';

import { SimulationState } from './simulation-engine';
import { Expenses } from './expenses';

export type PhaseName = 'accumulation' | 'retirement';

export interface PhaseData {
  name: PhaseName;
}

export class PhaseIdentifier {
  constructor(
    private timeline: TimelineInputs,
    private expenses: Expenses
  ) {}

  getCurrentPhase(simulationState: SimulationState): PhaseData {
    switch (this.timeline.retirementStrategy.type) {
      case 'fixedAge':
        const yearsFromNow = this.getYearsFromNow(simulationState.time.date);
        const age = this.timeline.currentAge + yearsFromNow;

        return { name: age < this.timeline.retirementStrategy.retirementAge ? 'accumulation' : 'retirement' };
      case 'swrTarget':
        return { name: 'retirement' };
    }
  }

  private getYearsFromNow(date: Date): number {
    const now = new Date();

    const diffInMs = Math.abs(date.getTime() - now.getTime());
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const years = diffInMs / msPerYear;

    return Math.round(years * 1000) / 1000;
  }
}
