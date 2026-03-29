"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"
import { User, Mail, Shield, CreditCard, Calendar, HeartIcon, Percent } from "lucide-react"

export default function Profile() {
    const [profile, setProfile] = useState(null)
    const [subscription, setSubscription] = useState(null)
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfileData()
    }, [])

    async function loadProfileData() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            setEmail(user.email)

            const [profileResponse, subResponse] = await Promise.all([
                supabase.from("profiles").select("*").eq("id", user.id).single(),
                supabase.from("subscriptions").select("*").eq("user_id", user.id).single()
            ])

            setProfile(profileResponse.data || {})
            setSubscription(subResponse.data || {})
        } catch (error) {
            console.error("Error loading profile:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    // Fallbacks for data to ensure all requested fields are visible
    const name = profile?.name || "No name set"
    const role = profile?.role || "user"
    const subType = subscription?.plan || "Free"
    const renewalDate = subscription?.renewal_date || "Not set"
    const charityId = subscription?.charity_id || profile?.charity_id || "None"
    const charityPct = subscription?.charity_percentage || profile?.charity_percentage || "0"

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    }

    return (
        <div className="flex-1 bg-background pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary shadow-sm mb-6 border border-primary/30">
                        <User className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        My Profile
                    </h1>
                    <p className="mt-2 text-sm text-foreground/70">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 shadow-xl backdrop-blur-md"
                >
                    <div className="px-4 py-5 sm:px-6 border-b border-black/5 dark:border-white/5">
                        <h3 className="text-lg font-medium leading-6 text-foreground">Account Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-foreground/70">Personal information and current subscription.</p>
                    </div>

                    <div className="px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-black/5 dark:sm:divide-white/5">

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <User className="h-4 w-4" /> Full name
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0 font-semibold">{name}</dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Role
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </span>
                                </dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <Mail className="h-4 w-4" /> Email address
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{email}</dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" /> Subscription Type
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0 font-medium">{subType}</dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Renewal Date
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{renewalDate}</dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <HeartIcon className="h-4 w-4" /> Charity ID
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{charityId}</dd>
                            </motion.div>

                            <motion.div variants={item} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <dt className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                                    <Percent className="h-4 w-4" /> Charity
                                </dt>
                                <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">
                                    {charityPct}% contribution
                                </dd>
                            </motion.div>

                        </dl>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
