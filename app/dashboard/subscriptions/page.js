"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { Check, Star, Zap, CreditCard } from "lucide-react"

export default function SubscriptionPage() {
  const [plan, setPlan] = useState("monthly")

  async function subscribe() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let renewalDate = new Date()
    if (plan === "monthly") renewalDate.setMonth(renewalDate.getMonth() + 1)
    if (plan === "yearly") renewalDate.setFullYear(renewalDate.getFullYear() + 1)

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (existing) {
      alert("Subscription already exists")
      return
    }

    await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan,
      status: "active",
      renewal_date: renewalDate,
    })

    alert("Subscription activated!")
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-4 mt-8">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Choose Your Plan</h2>
        <p className="text-lg text-foreground/60 max-w-xl text-center">Unlock premium features, detailed analytics, and join exclusive tournaments by becoming a Fairway member.</p>
      </div>

      <div className="mx-auto max-w-4xl mt-12 grid gap-6 md:grid-cols-2 lg:gap-8 px-4">
        {/* MONTHLY PLAN */}
        <motion.div
          onClick={() => setPlan("monthly")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className={`cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-8 sm:p-10 shadow-lg relative flex flex-col ${plan === "monthly" ? "border-primary shadow-primary/20 scale-[1.02]" : "border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"}`}
        >
          {plan === "monthly" && <div className="absolute top-6 right-6 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm"><Check className="h-4 w-4" strokeWidth={3} /></div>}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-2xl"><Zap className="h-7 w-7 text-amber-500" /></div>
            <h3 className="text-3xl font-bold text-foreground">Monthly</h3>
          </div>
          <div className="mb-8">
            <span className="text-6xl font-black text-foreground tracking-tighter">$19</span>
            <span className="text-foreground/60 font-semibold text-lg ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-8 text-base font-medium flex-1">
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></div> Advanced handicap tracking</li>
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></div> Entry into monthly charity pots</li>
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-black/5 dark:bg-white/5 p-1"><Check className="h-4 w-4 text-foreground/40" /></div> Standard community support</li>
          </ul>
        </motion.div>

        {/* YEARLY PLAN */}
        <motion.div
          onClick={() => setPlan("yearly")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 bg-gradient-to-br from-primary/10 to-background backdrop-blur-md p-8 sm:p-10 shadow-xl relative flex flex-col ${plan === "yearly" ? "border-primary shadow-primary/20 scale-[1.02]" : "border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"}`}
        >
          <div className="absolute top-0 right-0 lg:right-4 bg-primary text-primary-foreground text-xs font-bold px-6 py-1.5 rounded-bl-2xl lg:rounded-b-2xl tracking-wider uppercase shadow-md">Best Value</div>
          {plan === "yearly" && <div className="absolute top-8 right-6 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm"><Check className="h-4 w-4" strokeWidth={3} /></div>}

          <div className="flex items-center gap-3 mb-6 mt-2 lg:mt-0">
            <div className="p-3 bg-primary/20 rounded-2xl"><Star className="h-7 w-7 text-primary" fill="currentColor" /></div>
            <h3 className="text-3xl font-bold text-foreground">Yearly</h3>
          </div>
          <div className="mb-8 flex flex-col">
            <div className="flex items-baseline">
              <span className="text-6xl font-black text-foreground tracking-tighter">$190</span>
              <span className="text-foreground/60 font-semibold text-lg ml-2">/ year</span>
            </div>
            <p className="text-primary font-bold text-sm mt-1 bg-primary/10 w-fit px-3 py-1 rounded-full">Save $38 annually</p>
          </div>
          <ul className="space-y-4 mb-8 text-base font-medium flex-1">
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></div> All Monthly features</li>
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></div> 2 Months Free</li>
            <li className="flex items-center gap-3 text-foreground/80"><div className="rounded-full bg-primary/20 p-1"><Check className="h-4 w-4 text-primary" /></div> Priority support & early access</li>
          </ul>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto mt-16 flex flex-col items-center px-4">
        <button
          onClick={subscribe}
          className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xl hover:shadow-2xl active:scale-95"
        >
          <CreditCard className="h-6 w-6" />
          Subscribe to {plan === "monthly" ? "Monthly" : "Yearly"} Membership
        </button>
        <p className="text-sm text-foreground/50 mt-6 text-center">By subscribing, you agree to our Terms of Service and Privacy Policy. Cancel anytime. Payments processed securely via Stripe.</p>
      </div>
    </div>
  )
}