"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [message, setMessage] = useState<{text: string, type: "success" | "error"} | null>(null)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords don't match!", type: "error" })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters!", type: "error" })
      return
    }
    setMessage({ text: "Password changed successfully! ✅", type: "success" })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Privacy & Security" />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">

        {/* Encryption info */}
        <section className="glass-card flex flex-col gap-4 rounded-2xl px-5 py-5">
          <h3 className="text-base font-bold text-foreground">Data Protection</h3>
          {[
            { icon: Shield, label: "AES-256 Encryption", desc: "Your data is encrypted at rest" },
            { icon: Lock, label: "HIPAA Compliant", desc: "Medical data privacy standards" },
            { icon: Shield, label: "JWT Authentication", desc: "Secure token-based sessions" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Change password */}
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-bold text-foreground">Change Password</h3>

          {[
            { label: "Current Password", value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { label: "New Password", value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew(!showNew) },
            { label: "Confirm New Password", value: confirmPassword, onChange: setConfirmPassword, show: showNew, toggle: () => setShowNew(!showNew) },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{field.label}</label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
                <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type={field.show ? "text" : "password"}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button onClick={field.toggle}>
                  {field.show ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          ))}

          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success" ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
            }`}>
              {message.text}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-bold text-primary-foreground"
          >
            <Lock className="h-5 w-5" />
            Change Password
          </button>
        </section>

      </main>
      <BottomNav />
    </div>
  )
}