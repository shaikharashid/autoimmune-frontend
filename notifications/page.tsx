"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { Bell, FileBarChart, Shield, Activity } from "lucide-react"

interface NotificationSettings {
  analysisComplete: boolean
  newFeatures: boolean
  securityAlerts: boolean
  weeklyReport: boolean
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    analysisComplete: true,
    newFeatures: false,
    securityAlerts: true,
    weeklyReport: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("notificationSettings")
    if (saved) setSettings(JSON.parse(saved))
  }, [])

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const items = [
    { key: "analysisComplete", icon: FileBarChart, label: "Analysis Complete", desc: "Get notified when your analysis is ready" },
    { key: "newFeatures", icon: Activity, label: "New Features", desc: "Updates about new app features" },
    { key: "securityAlerts", icon: Shield, label: "Security Alerts", desc: "Important account security notifications" },
    { key: "weeklyReport", icon: Bell, label: "Weekly Report", desc: "Weekly summary of your analyses" },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Notifications" />
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-28 pt-6">

        <p className="text-sm text-muted-foreground">
          Manage which notifications you want to receive.
        </p>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.key} className="glass-card flex items-center gap-3 rounded-xl px-4 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => handleToggle(item.key as keyof NotificationSettings)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  settings[item.key as keyof NotificationSettings]
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings[item.key as keyof NotificationSettings]
                    ? "translate-x-5"
                    : "translate-x-0.5"
                }`} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-bold text-primary-foreground"
        >
          <Bell className="h-5 w-5" />
          {saved ? "Saved! ✅" : "Save Preferences"}
        </button>

      </main>
      <BottomNav />
    </div>
  )
}