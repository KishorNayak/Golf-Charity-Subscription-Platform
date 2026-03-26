"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SubscriptionPage() {

  const [plan, setPlan] = useState("monthly")

  async function subscribe() {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    let renewalDate = new Date()

    if (plan === "monthly") {
      renewalDate.setMonth(
        renewalDate.getMonth() + 1
      )
    }

    if (plan === "yearly") {
      renewalDate.setFullYear(
        renewalDate.getFullYear() + 1
      )
    }

    const existing = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (existing.data) {
      alert("Subscription already exists")
      return
    }

    await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        plan,
        status: "active",
        renewal_date: renewalDate,
      })

    alert("Subscription activated!")
  }

  return (
    <div className="p-10 space-y-4">

      <h1 className="text-2xl font-bold">
        Choose Subscription Plan
      </h1>

      <select
        className="border p-2"
        onChange={(e) =>
          setPlan(e.target.value)
        }
      >
        <option value="monthly">
          Monthly Plan
        </option>

        <option value="yearly">
          Yearly Plan
        </option>
      </select>

      <button
        onClick={subscribe}
        className="bg-black text-white px-4 py-2"
      >
        Subscribe
      </button>


    </div>
  )
}