"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { FileBarChart, Trash2 } from "lucide-react"
import Link from "next/link"
import { getHistory, deleteHistoryItem, clearHistory } from "@/lib/api"

interface HistoryItem {
  id: string
  disease: string
  confidence: number
  date: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data)
    } catch (err) {
      console.error("Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = async () => {
    try {
      await clearHistory()
      setHistory([])
    } catch (err) {
      console.error("Failed to clear history")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteHistoryItem(id)
      setHistory(history.filter((h) => h.id !== id))
    } catch (err) {
      console.error("Failed to delete report")
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400"
    if (confidence >= 50) return "text-primary"
    return "text-yellow-400"
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="History" />

      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-28 pt-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {history.length} {history.length === 1 ? "report" : "reports"} analyzed
          </p>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 text-xs font-medium text-destructive hover:opacity-80"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-5 py-16 text-center">
            <FileBarChart className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-base font-bold text-foreground">No reports yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload a PDF or enter lab values to get your first analysis
            </p>
            <Link
              href="/upload"
              className="mt-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Start Analysis
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {history.map((report) => (
              <div
                key={report.id}
                className="glass-card flex items-center gap-3 rounded-xl px-4 py-3.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileBarChart className="h-5 w-5 text-primary" />
                </div>
                <Link href="/analysis" className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {report.disease}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.date}
                  </span>
                </Link>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${getConfidenceColor(report.confidence)}`}>
                    {report.confidence}%
                  </span>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}