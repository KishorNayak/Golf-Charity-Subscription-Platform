"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

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

    setCharities(data)
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
    <div className="p-10 space-y-4">

      <h1 className="text-2xl font-bold">
        Select Charity
      </h1>

      <select
        className="border p-2"
        onChange={(e) =>
          setSelectedCharity(e.target.value)
        }
      >
        <option>Select charity</option>

        {charities.map((charity) => (
          <option
            key={charity.id}
            value={charity.id}
          >
            {charity.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={percentage}
        onChange={(e) =>
          setPercentage(e.target.value)
        }
        className="border p-2"
      />

      <button
        onClick={saveCharitySelection}
        className="bg-black text-white px-4 py-2"
      >
        Save Selection
      </button>

    </div>
  )
}