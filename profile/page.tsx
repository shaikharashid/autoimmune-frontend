"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

const menuItems = [
  { icon: User, label: "Account Settings", description: "Manage your profile", href: "/settings" },
  { icon: Shield, label: "Privacy & Security", description: "Data encryption settings", href: "/security" },
  { icon: Bell, label: "Notifications", description: "Manage alert preferences", href: "/notifications" },
  { icon: HelpCircle, label: "Help & Support", description: "FAQ and contact", href: "/help" },
]

export default function ProfilePage() {
  const [name, setName] = useState("User")
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check localStorage first (normal login)
    const savedName = localStorage.getItem("userName")
    const savedEmail = localStorage.getItem("userEmail")

    if (savedName && savedEmail) {
      setName(savedName)
      setEmail(savedEmail)
    } else {
      // Check NextAuth session (Google login)
      import("next-auth/react").then(({ getSession }) => {
        getSession().then((session) => {
          if (session?.user) {
            const googleName = session.user.name || "Google User"
            const googleEmail = session.user.email || ""
            const googleImage = session.user.image || null

            setName(googleName)
            setEmail(googleEmail)
            setAvatar(googleImage)

            // Save to localStorage for other pages
            localStorage.setItem("userName", googleName)
            localStorage.setItem("userEmail", googleEmail)
          }
        })
      })
    }
  }, [])

  const handleLogout = async () => {
    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("predictionResult")

    // Check if Google session exists and sign out
    const { getSession, signOut } = await import("next-auth/react")
    const session = await getSession()
    if (session) {
      await signOut({ redirect: false })
    }

    router.push("/login")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Profile" />

      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">
        {/* User avatar and info */}
        <section className="flex flex-col items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-20 w-20 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-lg font-bold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </section>

        {/* Menu items */}
        <section className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="glass-card flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:border-primary/30 active:scale-[0.98]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-0.5">
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </section>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </main>

      <BottomNav />
    </div>
  )
}