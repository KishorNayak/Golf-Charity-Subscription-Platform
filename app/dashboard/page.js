"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { PenTool, HeartIcon, CreditCard, Trophy, Settings } from "lucide-react"

const dashboardLinks = [
  { href: "/dashboard/scores", label: "Score Entry", icon: PenTool, color: "text-blue-500", bg: "bg-blue-500/10" },
  { href: "/dashboard/charity", label: "Select Charity", icon: HeartIcon, color: "text-rose-500", bg: "bg-rose-500/10" },
  { href: "/dashboard/subscriptions", label: "Manage Subscription", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
  { href: "/dashboard/leaderboard", label: "View Leaderboard", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { href: "/admin", label: "Admin Panel", icon: Settings, color: "text-zinc-500", bg: "bg-zinc-500/10" },
];

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserEmail(user.email)

    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    setSubscription(data)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex-1 bg-background pt-8 pb-20 sm:pt-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="md:flex md:items-center md:justify-between mb-10">
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl font-bold leading-7 text-foreground sm:truncate sm:text-4xl sm:tracking-tight">
              Dashboard
            </h2>
            {userEmail && (
              <p className="mt-1 text-sm text-foreground/70">
                Welcome back, {userEmail}
              </p>
            )}
          </div>
          {subscription && (
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/20">
                Plan: {subscription.plan || "Free"} ({subscription.status || "Active"})
              </span>
            </div>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {dashboardLinks.map((link) => (
            <motion.div key={link.href} variants={item}>
              <Link
                href={link.href}
                className="group relative flex flex-col items-start justify-between rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-sm overflow-hidden transition-all hover:border-primary/50 hover:shadow-md h-full"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.bg} ${link.color} transition-transform group-hover:scale-110`}>
                    <link.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}