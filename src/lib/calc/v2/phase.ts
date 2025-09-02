import { TimelineInputs } from '@/lib/schemas/timeline-form-schema';

import { SimulationState } from './simulation-engine';

export type PhaseName = 'accumulation' | 'retirement';

export interface PhaseData {
  name: PhaseName;
}

export class Phase {
  constructor(private timeline: TimelineInputs) {}

  getCurrentPhase(state: SimulationState): PhaseData {
    switch (this.timeline.retirementStrategy.type) {
      case 'fixedAge':
        const date = new Date(state.time.date);

        const yearsFromNow = this.getYearsFromNow(date);
        const age = this.timeline.currentAge + yearsFromNow;

        return { name: age < this.timeline.retirementStrategy.retirementAge ? 'accumulation' : 'retirement' };
      case 'swrTarget':
        // TODO: Implement SWR Target logic.
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
