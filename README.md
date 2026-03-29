# ⛳️ Fairway - Golf Charity & Subscription Platform

Fairway is a modern, premium Next.js web application built for golf enthusiasts. It allows players to track their scores, automatically calculate their handicap, climb the global leaderboard, and pledge a percentage of their winnings to selected charities. 

The platform features a gorgeous glassmorphic design utilizing **Tailwind CSS** and **Framer Motion** for smooth, engaging interactions.

## ✨ Features

- **Dynamic Score Tracking:** Log your 18-hole scores and dates with a beautiful UI.
- **Automatic Handicap Calculation:** Fairway calculates your handicap automatically based on your recent performance.
- **Global Leaderboards:** See how you stack up against other players with real-time average score leaderboards.
- **Charity Pledging:** Select from registered charities and pledge a percentage of your golf winnings to a good cause.
- **Premium Subscriptions:** Users can subscribe to Monthly or Yearly plans to unlock exclusive community features via an intuitive pricing dashboard.
- **Admin Control Panel:** A dedicated dashboard for platform administrators to manage users, roles, recent scores, and subscription statuses.
- **Role-based Authentication:** Secure sign-up/login flow with dual roles (User and Admin) powered by Supabase Auth.

## 🛠 Tech Stack

- **Frontend:** [Next.js 13+ (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend & Auth:** [Supabase](https://supabase.com/)

## 🚀 Getting Started

First, make sure you have your Supabase environment variables set up in a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then, run the development server:

```bash
# Install dependencies
npm install

# Start the server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄 Database Schema (Supabase)

To run this project, you will need the following tables configured in Supabase:
- `profiles`: id, name, role (user/admin), handicap, charity_id, charity_percentage
- `scores`: id, user_id, course_name, score, played_at / created_at
- `charities`: id, name, description
- `subscriptions`: id, user_id, plan (monthly/yearly), status, renewal_date

## 🎨 Design Philosophy

Fairway emphasizes visual excellence. The user interface uses carefully curated styling, including:
- **Glassmorphism:** Frosted glass overlay effects (`backdrop-blur-md`, `bg-white/50`, etc.)
- **Micro-interactions:** Smooth hover effects, scale transformations, and layout animations.
- **Consistency:** Distinct primary brand colors (Greens), accessible contrasts, and sleek rounded borders.

---

Built with ❤️ for the love of the game.
