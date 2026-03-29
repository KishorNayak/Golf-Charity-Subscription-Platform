"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
    const router = useRouter();
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mx-auto max-w-4xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                        The New Standard in Golf Communities
                    </motion.div>

                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8">
                        Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Game.</span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-foreground/70 sm:text-xl max-w-2xl mx-auto">
                        Join the premier platform for passionate golfers. Track your stats, compete in dynamic leaderboards, and discover the highest-rated courses near you in one motion-sensitive app.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <motion.button
                            onClick={() => router.push("/api/signup")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm hover:shadow-primary/25 hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            Get Started <ArrowRight className="h-4 w-4" />
                        </motion.button>
                        <motion.a
                            whileHover={{ x: 5 }}
                            href="#features"
                            className="text-base font-semibold leading-6 text-foreground hover:text-primary transition-colors flex items-center"
                        >
                            View Features <span aria-hidden="true" className="ml-2">→</span>
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
