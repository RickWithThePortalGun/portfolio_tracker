export interface Stock {
  name: string
  sector: string
  quantity: number
  purchase_price: number
  cmp: number
  pe_ratio: number
  earnings: number
  investment: number
  present_value: number
  gain_loss: number
  portfolio_percentage: number
}

export interface SectorData {
  stocks: string[]
  investment: number
  present_value: number
  gain_loss: number
}

export interface Portfolio {
  stocks: Stock[]
  sectors: Record<string, SectorData>
  last_updated: string
}
