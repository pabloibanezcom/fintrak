export interface Investment {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  lastUpdated: Date;
}

export interface Portfolio {
  investments: Investment[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}