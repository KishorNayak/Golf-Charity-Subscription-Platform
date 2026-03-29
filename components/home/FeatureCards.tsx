"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Trophy, MapPin, Users } from "lucide-react";

const features = [
    {
        name: "Dynamic Leaderboards",
        description: "Compete with friends and members across different courses in real-time. Rise through the ranks and track your handicap.",
        icon: Trophy,
    },
    {
        name: "Course Discovery",
        description: "Find hidden gems and top-rated local courses with detailed, community-driven reviews to plan your next tee time.",
        icon: MapPin,
    },
    {
        name: "Community Events",
        description: "Join local tournaments, meetups, and group play sessions effortlessly. Connect with golfers who share your passion.",
        icon: Users,
    },
];

export function FeatureCards() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
    };

    return (
        <section id="features" className="py-24 sm:py-32 bg-background relative z-10 border-t border-black/5 dark:border-white/5">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary tracking-wide uppercase">Community Features</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything you need on the fairway
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    variants={container}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                >
                    {features.map((feature) => (
                        <Card key={feature.name} feature={feature} itemVariants={item} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function Card({ feature, itemVariants }: { feature: any, itemVariants: any }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="relative flex flex-col rounded-2xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] p-8 shadow-sm backdrop-blur-sm overflow-hidden group transition-colors hover:border-primary/50"
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`,
                }}
            />
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary/20">
                <feature.icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold leading-7 text-foreground">
                {feature.name}
            </h3>
            <p className="mt-4 flex-auto text-base leading-7 text-foreground/70">
                {feature.description}
            </p>
        </motion.div>
    );
}
