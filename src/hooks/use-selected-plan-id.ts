import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

export function useSelectedPlanId(): Id<'plans'> {
  const params = useParams();
  return params.planId as Id<'plans'>;
}
