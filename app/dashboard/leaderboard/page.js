"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown } from "lucide-react"

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    const { data } = await supabase
      .from("scores")
      .select(`user_id, score, profiles (name)`)

    if (!data) return

    const averages = {}
    const profileRefs = {}

    data.forEach((row) => {
      // Safety check in case some scores have no associated profile/user_id properly
      if (!row.user_id) return

      if (!averages[row.user_id]) {
        averages[row.user_id] = []
        profileRefs[row.user_id] = row.profiles
      }
      averages[row.user_id].push(row.score)
    })

    const leaderboard = Object.keys(averages)
      .map((user) => {
        const avg = averages[user].reduce((a, b) => a + b, 0) / averages[user].length
        return {
          user,
          profiles: profileRefs[user],
          avg: avg.toFixed(2),
        }
      })
      .sort((a, b) => a.avg - b.avg)

    setLeaders(leaderboard)
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Global Leaderboard</h2>
      </div>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-2 sm:p-6 shadow-xl backdrop-blur-md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-foreground/60 border-b border-black/5 dark:border-white/5 tracking-wider uppercase">
              <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
              <div className="col-span-7 sm:col-span-8">Player</div>
              <div className="col-span-3 text-right">Avg Score</div>
            </div>

            {leaders.length === 0 ? (
              <div className="py-16 text-center text-sm font-medium text-foreground/50">
                No scores available yet.
              </div>
            ) : (
              leaders.map((player, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={player.user}
                  className="group flex items-center grid grid-cols-12 gap-4 rounded-2xl p-3 sm:p-4 hover:bg-background/80 transition-colors bg-background/30 shadow-sm border border-black/5 dark:border-white/5"
                >
                  <div className="col-span-2 sm:col-span-1 flex justify-center text-foreground">
                    {index === 0 ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-md transform scale-110"><Crown className="h-5 w-5" /></div>
                    ) : index === 1 ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600 shadow-sm"><Medal className="h-4 w-4" /></div>
                    ) : index === 2 ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 shadow-sm"><Medal className="h-4 w-4" /></div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-bold text-foreground/60 shadow-inner">{index + 1}</div>
                    )}
                  </div>

                  <div className="col-span-7 sm:col-span-8 flex items-center gap-4 text-foreground">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-inner text-lg">
                      {player.profiles?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-base">{player.profiles?.name || "Unknown Player"}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">Joined recently</p>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end">
                    <div className="rounded-full bg-primary px-4 py-1.5 text-base font-black text-primary-foreground shadow-sm">
                      {player.avg}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}