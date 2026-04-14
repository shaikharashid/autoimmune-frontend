"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import {
  Activity,
  FileBarChart,
  Shield,
  ChevronRight,
  Upload,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { getHistory } from "@/lib/api"

const quickActions = [
  {
    href: "/upload",
    icon: Upload,
    title: "Upload Report",
    description: "Analyze medical PDFs",
  },
  {
    href: "/form",
    icon: ClipboardList,
    title: "Enter Lab Values",
    description: "Manual data entry",
  },
  {
    href: "/analysis",
    icon: FileBarChart,
    title: "View Analysis",
    description: "See latest results",
  },
]

interface HistoryItem {
  id: string
  disease: string
  confidence: number
  date: string
}

export default function HomePage() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Check for token in URL (from Google login)
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const name = params.get("name")
    const email = params.get("email")

    if (token && name && email) {
      localStorage.setItem("token", token)
      localStorage.setItem("userName", name)
      localStorage.setItem("userEmail", email)
      window.history.replaceState({}, "", "/")
    }

    const loadHistory = async () => {
      try {
        const data = await getHistory()
        setHistory(data.slice(0, 3))
      } catch (err) {
        setHistory([])
      }
    }
    loadHistory()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex flex-col gap-1 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
            <img src="/logo.png" alt="ImmunoAI Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ImmunoAI</h1>
            <p className="text-xs text-muted-foreground">
              Autoimmune Disease Detection
            </p>
          </div>
        </div>
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </header>

      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28">
        <section className="glass-card flex items-center gap-3 rounded-2xl px-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">System Active</p>
            <p className="text-xs text-muted-foreground">
              AI models loaded and ready for analysis
            </p>
          </div>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="glass-card flex flex-col items-center gap-3 rounded-2xl px-4 py-5 transition-all hover:border-primary/30 active:scale-[0.97]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <span className="text-sm font-bold text-foreground">
                    {action.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Recent Reports</h2>
            <Link
              href="/history"
              className="flex items-center gap-1 text-xs font-medium text-primary"
            >
              View All
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {history.length === 0 ? (
              <div className="glass-card flex flex-col items-center gap-2 rounded-xl px-4 py-8 text-center">
                <FileBarChart className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No reports yet</p>
                <p className="text-xs text-muted-foreground">
                  Upload a PDF or enter lab values to get started
                </p>
              </div>
            ) : (
              history.map((report) => (
                <Link
                  key={report.id}
                  href="/analysis"
                  className="glass-card flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:border-primary/30 active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <FileBarChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      {report.disease}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {report.date}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-sm font-bold text-primary">
                      {report.confidence}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="glass-card flex items-center gap-3 rounded-xl px-4 py-3">
          <Shield className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            HIPAA compliant - AES-256 encrypted
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}