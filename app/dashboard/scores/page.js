"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { addScore } from "@/utils/scorelogic"
import { calculateHandicap } from "@/lib/calculateHandicap"
import { motion } from "framer-motion"
import { Plus, Trash2, Trophy, Calendar, Hash, Target } from "lucide-react"

export default function ScoresPage() {
  const [score, setScore] = useState("")
  const [date, setDate] = useState("")
  const [scores, setScores] = useState([])
  const [userId, setUserId] = useState(null)
  const [handicap, setHandicap] = useState(0)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    setUserId(user.id)
    loadScores(user.id)
  }

  async function loadScores(uid) {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    setScores(data || [])
  }

  async function saveScore() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    if (!score) {
      alert("Fill all fields")
      return
    }

    await supabase.from("scores").insert({
      user_id: user.id,
      score: score,
    })

    const { data: scoresData } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })

    const newHandicap = calculateHandicap(scoresData)

    await supabase
      .from("profiles")
      .update({ handicap: newHandicap })
      .eq("id", user.id)

    alert("Score saved & handicap updated!")
    setScore("")
  }

  async function handleSubmit() {
    if (score < 1 || score > 45) {
      alert("Score must be between 1 and 45")
      return
    }

    await addScore(userId, score, date)

    loadScores(userId)
    saveScore()
    setScore("")
    setDate("")
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Golf Scores</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-6 text-foreground">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Add New Score</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-3.5 h-4 w-4 text-foreground/50" />
              <input
                type="number"
                placeholder="Score (1–45)"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-background/80 pl-10 pr-4 py-3 text-sm text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-sm"
                min="1" max="45"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-foreground/50" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-background/80 pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-sm"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="group flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Save Score
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-3 rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-6 shadow-sm backdrop-blur-md flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4 text-foreground">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Recent History</h3>
          </div>

          <div className="space-y-3 flex-1 overflow-auto max-h-[300px] pr-2">
            {scores.length === 0 ? (
              <p className="text-sm text-foreground/50 text-center py-8">No scores recorded yet.</p>
            ) : (
              scores.slice(0, 5).map((s, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-black/5 dark:border-white/5 bg-background/50 p-3 hover:bg-background/80 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-inner">
                      {s.score}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">18 Holes</p>
                      <p className="text-xs text-foreground/60">{s.score_date || new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await supabase.from("scores").delete().eq("id", s.id)
                      loadScores(userId)
                    }}
                    className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                    title="Delete Score"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}