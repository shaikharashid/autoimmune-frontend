"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { BottomNav } from "@/components/bottom-nav"
import { HelpCircle, ChevronDown, ChevronUp, Mail } from "lucide-react"

const faqs = [
  {
    question: "How accurate is the AI diagnosis?",
    answer: "Our Random Forest model achieves 96% accuracy on the test dataset. However, this is an AI-assisted tool and should not replace professional medical advice."
  },
  {
    question: "What diseases can ImmunoAI detect?",
    answer: "ImmunoAI can detect 9 autoimmune diseases: Rheumatoid Arthritis, Psoriatic Arthritis, Systemic Lupus Erythematosus, Multiple Sclerosis, Ankylosing Spondylitis, Celiac Disease, Reactive Arthritis, Crohn's Disease, and Sjögren's Syndrome."
  },
  {
    question: "Is my medical data safe?",
    answer: "Yes. All data is encrypted using AES-256 encryption and processed in compliance with HIPAA privacy standards. We never share your data with third parties."
  },
  {
    question: "What PDF formats are supported?",
    answer: "We support standard medical lab report PDFs. The AI automatically extracts lab values like ESR, CRP, ANA, RF, and other biomarkers from the text."
  },
  {
    question: "What are SHAP values?",
    answer: "SHAP (SHapley Additive exPlanations) values show which lab markers most influenced the AI's prediction. Positive values push toward the diagnosis, negative values push against it."
  },
  {
    question: "Can I use this instead of seeing a doctor?",
    answer: "No. ImmunoAI is an informational tool only. Always consult a qualified healthcare professional for medical diagnosis and treatment."
  },
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PageHeader title="Help & Support" />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-28 pt-6">

        {/* FAQ */}
        <section className="flex flex-col gap-3">
          <h3 className="text-base font-bold text-foreground">
            Frequently Asked Questions
          </h3>
          <div className="flex flex-col gap-2">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-semibold text-foreground text-left">
                      {faq.question}
                    </span>
                  </div>
                  {openIndex === index
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  }
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="glass-card flex flex-col gap-4 rounded-2xl px-5 py-5">
          <h3 className="text-base font-bold text-foreground">Contact Us</h3>
          <p className="text-sm text-muted-foreground">
            Have a question or need help? Send us an email and we'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => window.open("mailto:support@immunoai.com?subject=ImmunoAI Support Request")}
            className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </button>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground">
          ImmunoAI v1.0.0 — Built with ❤️ for healthcare
        </p>

      </main>
      <BottomNav />
    </div>
  )
}