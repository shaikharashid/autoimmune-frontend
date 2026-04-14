"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { User, Mail, Save } from "lucide-react"

export default function SettingsPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(localStorage.getItem("userName") || "")
    setEmail(localStorage.getItem("userEmail") || "")
  }, [])

  const handleSave = () => {
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Account Settings" />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-28 pt-6">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-bold text-primary-foreground"
        >
          <Save className="h-5 w-5" />
          {saved ? "Saved! ✅" : "Save Changes"}
        </button>

      </main>
      <BottomNav />
    </div>
  )
}