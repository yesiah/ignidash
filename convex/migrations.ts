import { Migrations } from '@convex-dev/migrations';
import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';

export const migrations = new Migrations<DataModel>(components.migrations);

export const migrateTimelineToBirthday = migrations.define({
  table: 'plans',
  migrateOne: async (ctx, plan) => {
    const timeline = plan.timeline;
    if (!timeline) return;

    if (timeline.birthMonth !== undefined && timeline.birthYear !== undefined) {
      return;
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return {
      timeline: {
        ...timeline,
        birthMonth: currentMonth,
        birthYear: currentYear - timeline.currentAge,
      },
    };
  },
});

export const run = migrations.runner();
