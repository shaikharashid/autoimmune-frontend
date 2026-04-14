"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { loginUser, registerUser } from "@/lib/api"
import { Mail, Lock, User, Eye, EyeOff, Brain, FileText, Shield, Zap } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    localStorage.removeItem("reportHistory")
    localStorage.removeItem("predictionResult")
    try {
      let result
      if (isLogin) {
        result = await loginUser(email, password)
      } else {
        result = await registerUser(name, email, password)
      }
      localStorage.setItem("token", result.token)
      localStorage.setItem("userName", result.name)
      localStorage.setItem("userEmail", result.email)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    localStorage.removeItem("reportHistory")
    localStorage.removeItem("predictionResult")
    await signIn("google", { callbackUrl: "/api/google-callback" })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-5 py-8 overflow-y-auto">

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden">
          <img src="/logo.png" alt="ImmunoAI Logo" className="h-20 w-20 object-contain" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">ImmunoAI</h1>
        <p className="text-sm text-muted-foreground">Autoimmune Disease Detection</p>
      </div>

  {/* Project Brief */}
<div className="w-full max-w-sm mb-6">
  <div className="glass-card rounded-2xl px-5 py-5 flex flex-col gap-4">
    <p className="text-sm text-center leading-relaxed text-muted-foreground">
      An <span className="text-primary font-semibold">AI-powered</span> platform that analyzes
      medical lab reports to detect autoimmune diseases with{" "}
      <span className="text-primary font-semibold">96% accuracy</span>.
    </p>

    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
        <Brain className="h-5 w-5 text-primary" />
        <span className="text-xs font-semibold text-foreground text-center">AI Detection</span>
        <span className="text-xs text-muted-foreground text-center">Detects 9 diseases</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
        <FileText className="h-5 w-5 text-primary" />
        <span className="text-xs font-semibold text-foreground text-center">PDF Upload</span>
        <span className="text-xs text-muted-foreground text-center">Reads your lab report</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
        <Zap className="h-5 w-5 text-primary" />
        <span className="text-xs font-semibold text-foreground text-center">AI Explains</span>
        <span className="text-xs text-muted-foreground text-center">Shows why it decided</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl bg-primary/5 px-3 py-3">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-xs font-semibold text-foreground text-center">100% Private</span>
        <span className="text-xs text-muted-foreground text-center">Your data is safe</span>
      </div>
    </div>
  </div>
</div>

      {/* Login Card */}
      <div className="glass-card w-full max-w-sm rounded-2xl px-6 py-8 flex flex-col gap-5">

        <div className="flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => { setIsLogin(true); setError(null) }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null) }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              !isLogin ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3">
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword
                ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                : <Eye className="h-4 w-4 text-muted-foreground" />
              }
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          For informational purposes only — not medical advice
        </p>
      </div>
    </div>
  )
}