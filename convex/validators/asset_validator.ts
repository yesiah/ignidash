import { v } from 'convex/values';

export const assetValidator = v.object({
  id: v.string(),
  name: v.string(),
  value: v.number(),
  type: v.union(
    v.literal('savings'),
    v.literal('taxableBrokerage'),
    v.literal('roth401k'),
    v.literal('rothIra'),
    v.literal('401k'),
    v.literal('ira'),
    v.literal('hsa'),
    v.literal('realEstate'),
    v.literal('vehicle'),
    v.literal('preciousMetals'),
    v.literal('other')
  ),
});
