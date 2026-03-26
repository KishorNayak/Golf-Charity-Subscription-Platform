"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { addScore } from "@/utils/scorelogic"
import { calculateHandicap } from "@/lib/calculateHandicap"

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

    setScores(data)
  }

  async function saveScore() {

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  if (!course || !score) {

    alert("Fill all fields")
    return

  }

  await supabase.from("scores").insert({

    user_id: user.id,
    course_name: course,
    score: score,

  })

  const { data: scores } =
    await supabase
      .from("scores")
      .select("score")
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })

  const handicap =
    calculateHandicap(scores)

  await supabase
    .from("profiles")
    .update({ handicap })
    .eq("id", user.id)

  alert("Score saved & handicap updated!")

  setCourse("")
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
    <div className="p-10 space-y-4">

      <h1 className="text-2xl font-bold">
        Enter Golf Score
      </h1>

      <input
        type="number"
        placeholder="Score (1–45)"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="border p-2"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2"
      >
        Add Score
      </button>

      <h2 className="text-xl mt-6">
        Your Last 5 Scores
      </h2>

      {scores.map((s) => (
  <div
    key={s.id}
    className="flex gap-4 items-center"
  >
    <span>
      {s.score} — {s.score_date}
    </span>

    <button
      onClick={async () => {
        await supabase
          .from("scores")
          .delete()
          .eq("id", s.id)

        loadScores(userId)
      }}
      className="text-red-500"
    >
      Delete
    </button>
  </div>
))}

    </div>
  )
}