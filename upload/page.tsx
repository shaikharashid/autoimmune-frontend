"use client"

import { useState, useCallback, useRef } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Info, FileText, Plus, Zap, ShieldCheck, CloudUpload } from "lucide-react"
import { useRouter } from "next/navigation"

const BACKEND_URL = "http://127.0.0.1:8000"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) { p = 100; clearInterval(interval) }
      setProgress(Math.round(p))
    }, 200)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === "application/pdf") handleFile(f)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])
  const handleChooseFile = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleAnalysis = async () => {
    if (!file) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${BACKEND_URL}/upload-pdf`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error("Failed to analyze PDF")
      }

      const result = await response.json()
      localStorage.setItem("predictionResult", JSON.stringify(result))
      router.push("/analysis")

    } catch (err) {
      setError("Failed to analyze PDF. Make sure backend is running.")
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = progress === 100 && !isAnalyzing

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader
        title="Upload Report"
        rightAction={
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground">
            <Info className="h-4 w-4" />
          </button>
        }
      />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-28 pt-6">
        <section className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Analyze Your Report</h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Upload your medical PDF — the AI will automatically extract and analyze your lab values.
          </p>
        </section>

        <section
          role="button"
          tabIndex={0}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleChooseFile}
          className={`glass-card flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 transition-all ${
            isDragging ? "border-primary bg-primary/5" : "border-primary/30"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <CloudUpload className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base font-bold text-foreground">
              {file ? file.name : "Drag and Drop"}
            </span>
            <span className="text-sm text-muted-foreground">or select from your device</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary"
            onClick={(e) => { e.stopPropagation(); handleChooseFile() }}
          >
            <Plus className="h-4 w-4" />
            Choose File
          </button>
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleInputChange} />
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Upload Progress</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
            ⚠️ {error}
          </div>
        )}

        <section className="glass-card flex items-start gap-3 rounded-xl px-4 py-3.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Your medical data is encrypted using AES-256 and HIPAA compliant.
          </p>
        </section>

        <button
          disabled={!canAnalyze}
          onClick={handleAnalysis}
          className={`flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl text-base font-bold transition-all ${
            canAnalyze ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          <Zap className="h-5 w-5" />
          {isAnalyzing ? "Analyzing PDF..." : "Start AI Analysis"}
        </button>

        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {progress === 100 ? "Ready for analysis" : file ? "Uploading..." : "Waiting for file selection"}
        </p>
      </main>
      <BottomNav />
    </div>
  )
}