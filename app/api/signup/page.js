"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { createProfile } from "@/utils/createprofile"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("user")
  const router = useRouter()

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        }
      }
    })

    if (data?.user) {
      await createProfile(data.user, name, role)
    }

    if (error) {
      alert(error.message)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md space-y-8 rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 p-10 shadow-xl backdrop-blur-md"
      >
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm">
            F
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Join the Club
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Already have an account?{" "}
            <Link href="/api/login" className="font-medium text-primary hover:text-primary/80">
              Login
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                className="relative block w-full rounded-lg border border-black/10 dark:border-white/10 bg-background px-3 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors mb-4"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="relative block w-full rounded-lg border border-black/10 dark:border-white/10 bg-background px-3 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors mb-4"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-lg border border-black/10 dark:border-white/10 bg-background px-3 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-black/10 dark:border-white/10 bg-background px-3 py-3 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="group relative flex w-full justify-center rounded-full bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </div>
  )
}