"use client";

import { useState } from "react";
import { default as Link } from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "dashboard", href: "/dashboard" },
        { name: "Charity", href: "/dashboard/charity" },
        { name: "Leaderboard", href: "/dashboard/leaderboard" },
        { name: "Profile", href: "/api/profile" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-sm">
                                F
                            </div>
                            <span className="text-xl font-bold tracking-tight">Fairway</span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <Link href="/api/signup" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 text-center">
                            Join Club
                        </Link>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-foreground focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-black/5 dark:border-white/5 overflow-hidden"
                    >
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3 bg-background/95 backdrop-blur-md">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-4 px-3">
                                <Link href="/api/signup" className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-full text-base font-semibold shadow-sm transition-all active:scale-95 text-center">
                                    Join Club
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
