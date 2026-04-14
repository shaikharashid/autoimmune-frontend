"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { ConfidenceCircle } from "@/components/confidence-circle"
import { ImpactBar } from "@/components/impact-bar"
import { Share2, Info, Download } from "lucide-react"

interface TopFeature {
  feature: string
  impact: number
}

interface PredictionResult {
  disease: string
  confidence: number
  top_features: TopFeature[]
}

export default function AnalysisPage() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("predictionResult")
    if (saved) {
      const parsed = JSON.parse(saved)
      setResult(parsed)

      // Only save if this is a new result
      const history = JSON.parse(localStorage.getItem("reportHistory") || "[]")
      const alreadySaved = history.some(
        (h: any) => h.disease === parsed.disease && h.confidence === parsed.confidence
      )

      if (!alreadySaved) {
        const newEntry = {
          id: Date.now().toString(),
          disease: parsed.disease,
          confidence: parsed.confidence,
          date: new Date().toLocaleDateString("en-US", {
            month: "short", day: "2-digit", year: "numeric"
          })
        }
        const updated = [newEntry, ...history].slice(0, 20)
        localStorage.setItem("reportHistory", JSON.stringify(updated))
      }
    }
  }, [])

  const disease = result?.disease ?? "No Analysis Yet"
  const confidence = result?.confidence ?? 0
  const topFeatures = result?.top_features ?? []

  const confidenceLabel =
    confidence >= 80 ? "High Confidence" :
    confidence >= 50 ? "Medium Confidence" :
    "Low Confidence"

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      const primaryColor: [number, number, number] = [0, 188, 188]
      const darkColor: [number, number, number] = [15, 23, 42]
      const grayColor: [number, number, number] = [100, 116, 139]

      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, 210, 35, "F")

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("ImmunoAI", 15, 15)
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Autoimmune Disease Detection Report", 15, 24)
      doc.setFontSize(9)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 24)

      doc.setTextColor(...darkColor)
      doc.setFontSize(13)
      doc.setFont("helvetica", "bold")
      doc.text("Diagnostic Result", 15, 50)

      doc.setFillColor(240, 253, 253)
      doc.roundedRect(15, 55, 180, 30, 3, 3, "F")
      doc.setDrawColor(...primaryColor)
      doc.roundedRect(15, 55, 180, 30, 3, 3, "S")

      doc.setTextColor(...primaryColor)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(disease, 105, 67, { align: "center" })

      doc.setTextColor(...grayColor)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`${confidenceLabel} — ${confidence}% confidence`, 105, 78, { align: "center" })

      doc.setTextColor(...darkColor)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Confidence Score", 15, 100)

      doc.setFillColor(226, 232, 240)
      doc.roundedRect(15, 105, 180, 8, 2, 2, "F")
      doc.setFillColor(...primaryColor)
      doc.roundedRect(15, 105, (confidence / 100) * 180, 8, 2, 2, "F")

      doc.setTextColor(...primaryColor)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text(`${confidence}%`, 197, 112, { align: "right" })

      doc.setTextColor(...darkColor)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("XAI Insights (SHAP Attribution)", 15, 128)

      doc.setTextColor(...grayColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text("Features that influenced the AI prediction:", 15, 135)

      let y = 143
      topFeatures.forEach((item, index) => {
        const barWidth = Math.min(Math.abs(item.impact) * 400, 120)
        const isPositive = item.impact >= 0

        doc.setFillColor(248, 250, 252)
        doc.roundedRect(15, y - 5, 180, 14, 2, 2, "F")

        doc.setTextColor(...darkColor)
        doc.setFontSize(9)
        doc.setFont("helvetica", "bold")
        doc.text(`${index + 1}. ${item.feature}`, 20, y + 4)

        doc.setFillColor(226, 232, 240)
        doc.rect(100, y, 80, 5, "F")

        if (isPositive) {
          doc.setFillColor(...primaryColor)
        } else {
          doc.setFillColor(168, 85, 247)
        }
        doc.rect(100, y, barWidth, 5, "F")

        doc.setTextColor(
          isPositive ? primaryColor[0] : 168,
          isPositive ? primaryColor[1] : 85,
          isPositive ? primaryColor[2] : 247
        )
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.text(`${item.impact > 0 ? "+" : ""}${item.impact.toFixed(4)}`, 185, y + 4, { align: "right" })

        y += 18
      })

      y += 10
      doc.setFillColor(254, 242, 242)
      doc.roundedRect(15, y, 180, 25, 3, 3, "F")
      doc.setTextColor(185, 28, 28)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("Medical Disclaimer", 20, y + 8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(153, 27, 27)
      const disclaimer = "This AI-generated report is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."
      const lines = doc.splitTextToSize(disclaimer, 170)
      doc.text(lines, 20, y + 15)

      doc.setFillColor(...primaryColor)
      doc.rect(0, 280, 210, 17, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("ImmunoAI — Autoimmune Disease Detection Platform", 105, 289, { align: "center" })
      doc.text("Confidential Medical Report", 105, 294, { align: "center" })

      doc.save(`ImmunoAI_Report_${disease.replace(/ /g, "_")}.pdf`)
    } catch (err) {
      console.error("Error generating PDF:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader
        title="Detection Analysis"
        rightAction={
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground">
            <Share2 className="h-5 w-5" />
          </button>
        }
      />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">
        <section className="glass-card flex flex-col items-center gap-4 rounded-2xl px-5 py-8">
          <div className="rounded-full bg-primary/15 px-4 py-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {confidenceLabel}
            </span>
          </div>
          <ConfidenceCircle percentage={confidence} size={180} strokeWidth={8} />
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Diagnostic Status
            </span>
            <h2 className="text-2xl font-bold text-primary cyan-text-glow">
              {disease}
            </h2>
            <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              AI analysis based on your submitted lab markers.
            </p>
          </div>
        </section>

        {topFeatures.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">XAI Insights</h3>
              <button className="flex h-7 w-7 items-center justify-center rounded-full text-primary">
                <Info className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The AI weighted the following features to reach this conclusion (SHAP attribution).
            </p>
            <div className="glass-card flex flex-col gap-5 rounded-2xl px-4 py-5">
              {topFeatures.map((item) => (
                <ImpactBar
                  key={item.feature}
                  label={item.feature}
                  impact={item.impact}
                  fillPercent={Math.min(Math.abs(item.impact) * 300, 100)}
                  variant={item.impact >= 0 ? "positive" : "negative"}
                />
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-bold text-primary-foreground cyan-glow disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            {downloading ? "Generating..." : "Download Detailed Report"}
          </button>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Medical Disclaimer: </span>
          This AI-generated report is for informational purposes only and does not constitute
          medical advice, diagnosis, or treatment.
        </p>
      </main>
      <BottomNav />
    </div>
  )
}