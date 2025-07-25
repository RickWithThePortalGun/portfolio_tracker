import type { Stock } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StockTableProps {
  stocks: Stock[]
}

export function StockTable({ stocks }: StockTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-100 text-blue-800",
      Healthcare: "bg-green-100 text-green-800",
      Finance: "bg-purple-100 text-purple-800",
      Energy: "bg-orange-100 text-orange-800",
      Consumer: "bg-pink-100 text-pink-800",
      Industrial: "bg-gray-100 text-gray-800",
    }
    return colors[sector] || "bg-slate-100 text-slate-800"
  }

  return (
    <Card className="mb-8 bg-white shadow-sm border-0 shadow-slate-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">Stock Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="font-semibold text-slate-700">Stock</TableHead>
                <TableHead className="font-semibold text-slate-700">Sector</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Qty</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Purchase Price</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Current Price</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">P/E</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Investment</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Current Value</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Gain/Loss</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">% Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock, index) => (
                <TableRow key={index} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-900">{stock.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSectorColor(stock.sector)}>
                      {stock.sector}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-700">{stock.quantity.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-slate-700">{formatCurrency(stock.purchase_price)}</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">{formatCurrency(stock.cmp)}</TableCell>
                  <TableCell className="text-right text-slate-700">{stock.pe_ratio.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-slate-700">{formatCurrency(stock.investment)}</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    {formatCurrency(stock.present_value)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${stock.gain_loss >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stock.gain_loss >= 0 ? "+" : ""}
                    {formatCurrency(stock.gain_loss)}
                  </TableCell>
                  <TableCell className="text-right text-slate-700">{stock.portfolio_percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
