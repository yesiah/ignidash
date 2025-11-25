import { z } from 'zod';
import { PiggyBankIcon, TrendingUpIcon, HouseIcon, CarIcon, CoinsIcon, FileQuestionMarkIcon } from 'lucide-react';

import { currencyFieldAllowsZero } from '@/lib/utils/zod-schema-utils';

export const assetFormSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be at most 50 characters'),
  value: currencyFieldAllowsZero('Value cannot be negative'),
  updatedAt: z.number(),
  type: z.enum([
    'savings',
    'checking',
    'taxableBrokerage',
    'roth401k',
    'rothIra',
    '401k',
    'ira',
    'hsa',
    'realEstate',
    'vehicle',
    'preciousMetals',
    'other',
  ]),
});

export type AssetInputs = z.infer<typeof assetFormSchema>;

export const assetTypeForDisplay = (type: AssetInputs['type']): string => {
  switch (type) {
    case 'savings':
      return 'Savings';
    case 'checking':
      return 'Checking';
    case 'taxableBrokerage':
      return 'Taxable';
    case 'roth401k':
      return 'Roth 401(k)';
    case 'rothIra':
      return 'Roth IRA';
    case '401k':
      return '401(k)';
    case 'ira':
      return 'IRA';
    case 'hsa':
      return 'HSA';
    case 'realEstate':
      return 'Real Estate';
    case 'vehicle':
      return 'Vehicle';
    case 'preciousMetals':
      return 'Precious Metals';
    case 'other':
      return 'Other Asset';
  }
};

export const assetIconForDisplay = (
  type: AssetInputs['type']
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string; titleId?: string } & React.RefAttributes<SVGSVGElement>
> => {
  switch (type) {
    case 'savings':
    case 'checking':
      return PiggyBankIcon;
    case 'taxableBrokerage':
    case 'roth401k':
    case 'rothIra':
    case '401k':
    case 'ira':
    case 'hsa':
      return TrendingUpIcon;
    case 'realEstate':
      return HouseIcon;
    case 'vehicle':
      return CarIcon;
    case 'preciousMetals':
      return CoinsIcon;
    case 'other':
      return FileQuestionMarkIcon;
  }
};
