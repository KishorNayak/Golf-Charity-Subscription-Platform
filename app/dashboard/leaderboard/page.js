"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Leaderboard() {

  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {

    const { data } = await supabase
      .from("scores")
      .select(`
        score,  
        profiles (full_name)`)

    if (!data) return

    const averages = {}

    data.forEach((row) => {

      if (!averages[row.user_id]) {
        averages[row.user_id] = []
      }

      averages[row.user_id].push(row.score)

    })

    const leaderboard = Object.keys(averages)
      .map((user) => {

        const avg =
          averages[user].reduce(
            (a, b) => a + b,
            0
          ) / averages[user].length

        return {
          user,
          avg: avg.toFixed(2),
        }

      })
      .sort((a, b) => a.avg - b.avg)

    setLeaders(leaderboard)
  }

  return (
    <div className="p-10 space-y-4">

      <h1 className="text-2xl font-bold">
        Leaderboard
      </h1>

      {leaders.map((player, index) => (

        <div key={player.user}>

          #{index + 1} — Player:
          {player.profiles.name}
          Avg Score: {player.avg}

        </div>

      ))}

    </div>
  )
}