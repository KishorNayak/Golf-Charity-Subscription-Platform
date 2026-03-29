"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { Users, Target, CreditCard, ShieldCheck, Calendar } from "lucide-react"

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = "/api/login"
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (data?.role !== "admin") {
      alert("Access denied")
      window.location.href = "/dashboard"
      return
    }

    await Promise.all([loadUsers(), loadScores(), loadSubscriptions()])
    setLoading(false)
  }

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select(`id, name, role, charity_percentage, charities (name)`)
    setUsers(data || [])
  }

  async function loadScores() {
    const { data } = await supabase.from("scores").select("*").order("created_at", { ascending: false }).limit(50)
    setScores(data || [])
  }

  async function loadSubscriptions() {
    const { data } = await supabase.from("subscriptions").select("*").order("created_at", { ascending: false })
    setSubscriptions(data || [])
  }

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><ShieldCheck className="h-12 w-12 animate-pulse text-primary/50" /></div>

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-screen">
      <div className="flex items-center gap-3 space-y-2 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Control Panel</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* USERS CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-1 rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-lg backdrop-blur-md">
          <div className="mb-6 flex items-center gap-3 text-foreground pb-4 border-b border-black/5 dark:border-white/5">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl"><Users className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold">Total Users</h3>
            <span className="ml-auto bg-background text-foreground text-sm font-bold px-3 py-1 rounded-full shadow-sm">{users.length}</span>
          </div>
          <div className="space-y-3 max-h-[450px] overflow-auto pr-2 custom-scrollbar">
            {users.map((user, idx) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={user.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-background/50 p-4 shadow-sm flex flex-col gap-2 hover:bg-background/80 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{user.name || "Unknown"}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{user.role || "user"}</span>
                </div>
                <div className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs text-foreground/70 font-medium">
                  Charity: <span className="text-foreground">{user.charities?.name || "None"} ({user.charity_percentage || 0}%)</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SCORES CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1 rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-lg backdrop-blur-md">
          <div className="mb-6 flex items-center gap-3 text-foreground pb-4 border-b border-black/5 dark:border-white/5">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl"><Target className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold">Recent Scores</h3>
            <span className="ml-auto bg-background text-foreground text-sm font-bold px-3 py-1 rounded-full shadow-sm">{scores.length}</span>
          </div>
          <div className="space-y-3 max-h-[450px] overflow-auto pr-2 custom-scrollbar">
            {scores.map((score, idx) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={score.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-background/50 p-4 shadow-sm flex items-center justify-between hover:bg-background/80 transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-sm flex items-center gap-1.5 text-foreground"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(score.created_at).toLocaleDateString()}</span>
                  <span className="text-xs text-foreground/60 font-medium">{score.course_name || "Unknown Course"}</span>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-black shadow-inner tracking-tighter">
                  {score.score}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SUBSCRIPTIONS CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-1 rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-lg backdrop-blur-md">
          <div className="mb-6 flex items-center gap-3 text-foreground pb-4 border-b border-black/5 dark:border-white/5">
            <div className="bg-purple-100 text-purple-600 p-2 rounded-xl"><CreditCard className="h-5 w-5" /></div>
            <h3 className="text-xl font-bold">Subscriptions</h3>
            <span className="ml-auto bg-background text-foreground text-sm font-bold px-3 py-1 rounded-full shadow-sm">{subscriptions.length}</span>
          </div>
          <div className="space-y-3 max-h-[450px] overflow-auto pr-2 custom-scrollbar">
            {subscriptions.map((sub, idx) => (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} key={sub.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-background/50 p-4 shadow-sm flex flex-col gap-2 hover:bg-background/80 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground capitalize">{sub.plan} Plan</span>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full font-bold ${sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{sub.status}</span>
                </div>
                <div className="bg-black/5 dark:bg-white/5 rounded-lg p-2 text-xs text-foreground/70 font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Renews: <span className="text-foreground">{new Date(sub.renewal_date).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}