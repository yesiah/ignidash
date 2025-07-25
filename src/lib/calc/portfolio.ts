import { Asset, AssetClass, AssetReturns, AssetAllocation } from './asset';

export class Portfolio {
  constructor(public assets: Asset[]) {}

  static create(assets: Asset[]): Portfolio {
    return new Portfolio([...assets]);
  }

  getAssetValue(assetClass: AssetClass): number {
    return this.assets.filter((asset) => asset.assetClass === assetClass).reduce((sum, asset) => sum + asset.principal + asset.growth, 0);
  }

  getTotalValue(): number {
    return this.assets.reduce((sum, asset) => sum + asset.principal + asset.growth, 0);
  }

  getCurrentAllocation(): AssetAllocation {
    const total = this.getTotalValue();
    if (total === 0) throw new Error('Cannot calculate allocation for empty portfolio');

    return {
      stocks: this.getAssetValue('stocks') / total,
      bonds: this.getAssetValue('bonds') / total,
      cash: this.getAssetValue('cash') / total,
    };
  }

  // Apply market returns (increases growth, not principal)
  withReturns(returns: AssetReturns): Portfolio {
    const updatedAssets = this.assets.map((asset) => {
      const returnRate = returns[asset.assetClass] || 0;
      const currentValue = asset.principal + asset.growth;
      const returnAmount = currentValue * returnRate;

      return {
        ...asset,
        growth: asset.growth + returnAmount, // Returns go to growth
      };
    });

    return new Portfolio(updatedAssets);
  }

  // Withdraw money (priority: cash → bonds → stocks)
  withWithdrawal(amount: number): Portfolio {
    if (amount < 0) throw new Error('Withdrawal amount must be positive');
    if (amount === 0) return this;

    let remainingToWithdraw = amount;
    const updatedAssets = [...this.assets];

    // Withdrawal priority: cash first, then bonds, then stocks
    const withdrawalOrder: AssetClass[] = ['cash', 'bonds', 'stocks'];

    for (const assetClass of withdrawalOrder) {
      if (remainingToWithdraw <= 0) break;

      const assetIndex = updatedAssets.findIndex((a) => a.assetClass === assetClass);
      if (assetIndex === -1) continue;

      const asset = updatedAssets[assetIndex];
      const availableValue = asset.principal + asset.growth;

      if (availableValue > 0) {
        const withdrawFromThisAsset = Math.min(remainingToWithdraw, availableValue);

        // Withdraw pro-rata from principal and growth
        const principalRatio = asset.principal / availableValue;
        const growthRatio = asset.growth / availableValue;

        updatedAssets[assetIndex] = {
          ...asset,
          principal: asset.principal - withdrawFromThisAsset * principalRatio,
          growth: asset.growth - withdrawFromThisAsset * growthRatio,
        };

        remainingToWithdraw -= withdrawFromThisAsset;
      }
    }

    return new Portfolio(updatedAssets);
  }

  // Add cash specifically (for income)
  withCash(amount: number): Portfolio {
    if (amount < 0) throw new Error('Cash amount must be positive');
    if (amount === 0) return this; // No change if zero or negative

    const updatedAssets = this.assets.map((asset) =>
      asset.assetClass === 'cash' ? { ...asset, principal: asset.principal + amount } : asset
    );

    return new Portfolio(updatedAssets);
  }

  // Rebalance to target allocation (preserves total principal/growth ratios)
  withRebalance(targetAllocation: AssetAllocation): Portfolio {
    const totalValue = this.getTotalValue();
    if (totalValue < 0) throw new Error('Cannot rebalance empty portfolio');
    if (totalValue === 0) return this; // No change if empty portfolio

    const totalPrincipal = this.assets.reduce((sum, asset) => sum + asset.principal, 0);
    const totalGrowth = this.assets.reduce((sum, asset) => sum + asset.growth, 0);

    const updatedAssets = this.assets.map((asset) => {
      const targetValue = totalValue * targetAllocation[asset.assetClass];
      const principalRatio = totalPrincipal / totalValue;
      const growthRatio = totalGrowth / totalValue;

      return {
        ...asset,
        principal: targetValue * principalRatio,
        growth: targetValue * growthRatio,
      };
    });

    return new Portfolio(updatedAssets);
  }
}
