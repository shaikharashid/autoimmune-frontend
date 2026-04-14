"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { predictDisease } from "@/lib/api"
import { Zap } from "lucide-react"

// Moved OUTSIDE the main component to fix focus loss issue
const InputField = ({
  label, fieldKey, placeholder, value, onChange
}: {
  label: string
  fieldKey: string
  placeholder: string
  value: string
  onChange: (key: string, value: string) => void
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </label>
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
    />
  </div>
)

const ToggleField = ({
  label, fieldKey, value, onChange
}: {
  label: string
  fieldKey: string
  value: string
  onChange: (key: string, value: string) => void
}) => (
  <div className="flex items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <div className="flex rounded-lg bg-background p-1 gap-1">
      {["0", "1"].map((val) => (
        <button
          key={val}
          onClick={() => onChange(fieldKey, val)}
          className={`px-4 py-1 rounded-lg text-xs font-bold transition-all ${
            value === val
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {val === "0" ? "Neg" : "Pos"}
        </button>
      ))}
    </div>
  </div>
)

export default function FormPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    Age: "", Gender: "1",
    ESR: "", CRP: "", RF: "0", Anti_CCP: "0", HLA_B27: "0",
    ANA: "0", Anti_Ro: "0", Anti_La: "0", Anti_dsDNA: "0", Anti_Sm: "0",
    C3: "", C4: "",
    ASCA: "0", Anti_CBir1: "0", Anti_OmpC: "0", pANCA: "0",
    EMA: "0", DGP: "0", Anti_tTG: "0", Anti_TPO: "0", Anti_SMA: "0",
  })

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      const data = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, parseFloat(v) || 0])
      )
      const result = await predictDisease(data)
      localStorage.setItem("predictionResult", JSON.stringify(result))
      router.push("/analysis")
    } catch (err) {
      setError("Failed to connect to backend. Make sure it is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Lab Values Form" />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">Patient Info</h3>
          <InputField label="Age" fieldKey="Age" placeholder="e.g. 45" value={form.Age} onChange={handleChange} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gender</label>
            <div className="flex rounded-xl border border-border bg-secondary p-1 gap-1">
              {[["1", "Female"], ["0", "Male"]].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => handleChange("Gender", val)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    form.Gender === val ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">Inflammatory Markers</h3>
          <InputField label="ESR (mm/hr)" fieldKey="ESR" placeholder="e.g. 35" value={form.ESR} onChange={handleChange} />
          <InputField label="CRP (mg/L)" fieldKey="CRP" placeholder="e.g. 12" value={form.CRP} onChange={handleChange} />
          <ToggleField label="Rheumatoid Factor (RF)" fieldKey="RF" value={form.RF} onChange={handleChange} />
          <ToggleField label="Anti-CCP" fieldKey="Anti_CCP" value={form.Anti_CCP} onChange={handleChange} />
          <ToggleField label="HLA-B27" fieldKey="HLA_B27" value={form.HLA_B27} onChange={handleChange} />
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">Autoimmune Antibodies</h3>
          <ToggleField label="ANA" fieldKey="ANA" value={form.ANA} onChange={handleChange} />
          <ToggleField label="Anti-Ro (SSA)" fieldKey="Anti_Ro" value={form.Anti_Ro} onChange={handleChange} />
          <ToggleField label="Anti-La (SSB)" fieldKey="Anti_La" value={form.Anti_La} onChange={handleChange} />
          <ToggleField label="Anti-dsDNA" fieldKey="Anti_dsDNA" value={form.Anti_dsDNA} onChange={handleChange} />
          <ToggleField label="Anti-Sm" fieldKey="Anti_Sm" value={form.Anti_Sm} onChange={handleChange} />
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">Complement & GI Markers</h3>
          <InputField label="C3 (g/L)" fieldKey="C3" placeholder="e.g. 1.2" value={form.C3} onChange={handleChange} />
          <InputField label="C4 (g/L)" fieldKey="C4" placeholder="e.g. 0.3" value={form.C4} onChange={handleChange} />
          <ToggleField label="ASCA" fieldKey="ASCA" value={form.ASCA} onChange={handleChange} />
          <ToggleField label="Anti-CBir1" fieldKey="Anti_CBir1" value={form.Anti_CBir1} onChange={handleChange} />
          <ToggleField label="Anti-OmpC" fieldKey="Anti_OmpC" value={form.Anti_OmpC} onChange={handleChange} />
          <ToggleField label="pANCA" fieldKey="pANCA" value={form.pANCA} onChange={handleChange} />
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">Celiac Markers</h3>
          <ToggleField label="EMA" fieldKey="EMA" value={form.EMA} onChange={handleChange} />
          <ToggleField label="DGP" fieldKey="DGP" value={form.DGP} onChange={handleChange} />
          <ToggleField label="Anti-tTG" fieldKey="Anti_tTG" value={form.Anti_tTG} onChange={handleChange} />
          <ToggleField label="Anti-TPO" fieldKey="Anti_TPO" value={form.Anti_TPO} onChange={handleChange} />
          <ToggleField label="Anti-SMA" fieldKey="Anti_SMA" value={form.Anti_SMA} onChange={handleChange} />
        </section>

        {error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-base font-bold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <Zap className="h-5 w-5" />
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>

      </main>
      <BottomNav />
    </div>
  )
}