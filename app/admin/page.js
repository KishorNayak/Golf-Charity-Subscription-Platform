"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {

  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    checkAdmin()
    loadUsers()
    loadScores()
    loadSubscriptions()
  }, [])

  async function checkAdmin() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (data.role !== "admin") {

      alert("Access denied")
      window.location.href = "/dashboard"

    }

  }

  async function loadUsers() {
        const { data } = await supabase
    .from("profiles")
    .select(`
        name,
        role,
        charity_percentage,
        charities (
        name
        )
    `)
  }

  async function loadScores() {

    const { data } = await supabase
      .from("scores")
      .select("*")

    setScores(data || [])
  }

  async function loadSubscriptions() {

    const { data } = await supabase
      .from("subscriptions")
      .select("*")

    setSubscriptions(data || [])
  }

  return (

    <div className="p-10 space-y-6">

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <section>

        <h2 className="text-xl font-semibold">
          Users
        </h2>

        {users.map(user => (

          <div key={user.id}>   
            {user.name} —
            {user.role} —
            {user.charity_percentage}% —
            {user.charities?.name}
          </div>

        ))}

      </section>

      <section>

        <h2 className="text-xl font-semibold">
          Scores
        </h2>

        {scores.map(score => (

          <div key={score.id}>
            {score.course_name} — {score.score}
          </div>

        ))}

      </section>

      <section>

        <h2 className="text-xl font-semibold">
          Subscriptions
        </h2>

        {subscriptions.map(sub => (

          <div key={sub.id}>
            {sub.plan} — {sub.status}
          </div>

        ))}

      </section>

    </div>

  )

}