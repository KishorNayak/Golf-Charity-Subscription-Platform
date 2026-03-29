"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { Heart, Landmark, Percent } from "lucide-react"

export default function CharityPage() {
  const [charities, setCharities] = useState([])
  const [selectedCharity, setSelectedCharity] = useState("")
  const [percentage, setPercentage] = useState(10)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    loadUser()
    loadCharities()
  }, [])

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)
  }

  async function loadCharities() {
    const { data } = await supabase
      .from("charities")
      .select("*")

    setCharities(data || [])
  }

  async function saveCharitySelection() {
    if (percentage < 10) {
      alert("Minimum contribution is 10%")
      return
    }

    await supabase
      .from("profiles")
      .update({
        charity_id: selectedCharity,
        charity_percentage: percentage,
      })
      .eq("id", userId)

    alert("Charity selection saved!")
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Charity Contribution</h2>
      </div>

      <div className="mx-auto max-w-md mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-8 shadow-xl backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-primary"></div>

          <div className="flex flex-col items-center mb-10 text-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 shadow-inner">
              <Heart className="h-10 w-10" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">Pledge Your Winnings</h3>
              <p className="text-sm text-foreground/60 mt-2">Choose a cause and select the percentage of your winnings to donate.</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Landmark className="h-4 w-4 text-primary" />
                Select Charity
              </label>
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-background/70 px-4 py-3.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer shadow-sm appearance-none"
              >
                <option value="" disabled>Select a charity...</option>
                {charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>{charity.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2 text-foreground">
                <Percent className="h-4 w-4 text-primary" />
                Contribution Percentage
              </label>
              <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-black/5 dark:border-white/5">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 font-black text-primary shadow-sm text-lg">
                  {percentage}%
                </div>
              </div>
              <p className="text-xs text-foreground/50 pt-1 flex items-center gap-1 font-medium"><Heart className="h-3 w-3 text-rose-500" /> Minimum contribution is 10%.</p>
            </div>

            <button
              onClick={saveCharitySelection}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Heart className="h-4 w-4" fill="currentColor" />
              Save Pledge
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}