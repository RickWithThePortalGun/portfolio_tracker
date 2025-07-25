"use client"

import { useState, useEffect } from "react"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { StockTable } from "@/components/stock-table"
import { SectorBreakdown } from "@/components/sector-breakdown"
import type { Portfolio } from "@/lib/types"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PortfolioTracker() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPortfolio = async () => {
    try {
      setError(null)
      const response = await fetch("http://localhost:5001/api/portfolio")
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data")
      }
      const data = await response.json()
      setPortfolio(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      setError("Failed to load portfolio data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchPortfolio()
  }

  useEffect(() => {
    fetchPortfolio()
    const interval = setInterval(fetchPortfolio, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!portfolio) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Portfolio Tracker</h1>
            <p className="text-slate-600">Monitor investments in real-time</p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {lastUpdated && <p className="text-sm text-slate-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <PortfolioSummary portfolio={portfolio} />
        <StockTable stocks={portfolio.stocks} />
        {/* Sector Breakdown */}
        <SectorBreakdown sectors={portfolio.sectors} />
      </div>
    </div>
  )
}
