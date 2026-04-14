"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Upload, History, BarChart2, User } from "lucide-react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/upload", icon: Upload, label: "Upload" },
  { href: "/history", icon: History, label: "History" },
  { href: "/analysis", icon: BarChart2, label: "Reports" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur">
      <div className="flex items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}