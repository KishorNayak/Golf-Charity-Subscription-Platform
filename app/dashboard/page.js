"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {

  const [subscription, setSubscription] =
    useState(null)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    setSubscription(data)
  }

  return (
    <div className="p-10 space-y-4">

      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      {subscription && (
        <div>
          Plan: {subscription.plan} <br />
          Status: {subscription.status}
        </div>
      )}

      <Link href="/dashboard/scores">
        Score Entry
      </Link>

      <Link href="/dashboard/charity">
        Select Charity
      </Link>

      <Link href="/dashboard/subscriptions">
        Manage Subscription
      </Link>

      <Link href="/dashboard/leaderboard">
        View Leaderboard
      </Link>

      <Link href="/admin">
        Admin Panel
      </Link>

    </div>
  )
}