"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function AdminLayout({
  children
}) {

  useEffect(() => {

    async function protect() {

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {

        window.location.href = "/login"
        return

      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (data.role !== "admin") {

        window.location.href = "/dashboard"

      }

    }

    protect()

  }, [])

  return children

}