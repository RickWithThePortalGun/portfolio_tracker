import type { SectorData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface SectorBreakdownProps {
  sectors: Record<string, SectorData>
}

export function SectorBreakdown({ sectors }: SectorBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-500",
      Healthcare: "bg-green-500",
      Finance: "bg-purple-500",
      Energy: "bg-orange-500",
      Consumer: "bg-pink-500",
      Industrial: "bg-gray-500",
    }
    return colors[sector] || "bg-slate-500"
  }

  return (
    <Card className="bg-white shadow-sm border-0 shadow-slate-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">Sector Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(sectors).map(([sector, data], index) => {
            const gainLossPercentage = (data.gain_loss / data.investment) * 100

            return (
              <div key={index} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSectorColor(sector)}`} />
                    {sector}
                  </h3>
                  {data.gain_loss >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {data.stocks.map((stock, stockIndex) => (
                      <Badge key={stockIndex} variant="outline" className="text-xs">
                        {stock}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Investment</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(data.investment)}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Current Value</p>
                      <p className="font-semibold text-slate-900">{formatCurrency(data.present_value)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Gain/Loss</span>
                      <div className="text-right">
                        <p className={`font-semibold ${data.gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {data.gain_loss >= 0 ? "+" : ""}
                          {formatCurrency(data.gain_loss)}
                        </p>
                        <p className={`text-xs ${gainLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {gainLossPercentage >= 0 ? "+" : ""}
                          {gainLossPercentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
