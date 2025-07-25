import type { Portfolio } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

interface PortfolioSummaryProps {
  portfolio: Portfolio
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const totalInvestment = portfolio.stocks.reduce((sum, stock) => sum + stock.investment, 0)
  const totalPresentValue = portfolio.stocks.reduce((sum, stock) => sum + stock.present_value, 0)
  const totalGainLoss = totalPresentValue - totalInvestment
  const gainLossPercentage = (totalGainLoss / totalInvestment) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalInvestment)}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Current Value</CardTitle>
          <PieChart className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalPresentValue)}</div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Total Gain/Loss</CardTitle>
          {totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(totalGainLoss)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Return %</CardTitle>
          {gainLossPercentage >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${gainLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {gainLossPercentage >= 0 ? "+" : ""}
            {gainLossPercentage.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
