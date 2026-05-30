# 🎁 Shagun — Indian Gift & Reciprocity Tracker

Shagun is a modern, mobile-first web application designed to help Indian families track the gifts (shagun/lifafa) they receive and give at weddings, housewarmings, and other cultural events. It calculates net balances so you always know exactly "who owes who" and ensures perfect reciprocity.

## 🚀 Tech Stack

This project was built from scratch with a focus on speed, modern developer experience, and a serverless backend.

### Frontend
* **[React 18](https://react.dev/) & [Vite](https://vitejs.dev/):** The core UI framework and build tool. Vite provides lightning-fast Hot Module Replacement (HMR) and optimized production builds.
* **[Tailwind CSS v4](https://tailwindcss.com/):** Utility-first styling framework used via the brand new `@tailwindcss/vite` plugin. No `tailwind.config.js` required; everything is handled via CSS variables in `index.css`.
* **[React Router v6](https://reactrouter.com/):** Handles all client-side routing, including protected routes that restrict access until a user is authenticated.
* **[Zustand](https://github.com/pmndrs/zustand):** A small, fast, and scalable bearbones state-management solution. It acts as the single source of truth for the app (`src/store/useAppStore.js`), managing all database fetching, caching, and state updates without the boilerplate of Redux.
* **[React Hook Form](https://react-hook-form.com/):** Used for highly performant and flexible form validation (e.g., creating events, recording gifts).
* **[Lucide React](https://lucide.dev/):** A beautiful, consistent open-source icon library.

### Backend & Database
* **[Supabase](https://supabase.com/):** An open-source Firebase alternative providing a fully managed Postgres database and Authentication.
  * **PostgreSQL:** Stores Profiles, Events, People, and Gifts.
  * **Row Level Security (RLS):** Database-level security policies ensure users can only ever read, insert, update, or delete their own data.
  * **Google OAuth:** Seamless social login integrated via Supabase Auth.
* **[Razorpay](https://razorpay.com/) (Pending):** Payment gateway integration for unlocking the "Pro" tier features.

---

## 📂 Folder Structure

```text
shagun/
├── public/                 # Static assets (PWA icons, manifest)
├── supabase/               
│   └── schema.sql          # The Postgres schema, RLS policies, and database triggers
├── src/
│   ├── components/         # Reusable atomic UI elements (Cards, Rows, Modals)
│   ├── pages/              # Main route views (Home, Login, EventDetail, etc.)
│   ├── store/              # Zustand global state (useAppStore.js)
│   ├── utils/              # Helper functions (currency formatters, date parsing)
│   ├── App.jsx             # Router and Auth Gatekeeper
│   ├── index.css           # Tailwind v4 configuration and global design system tokens
│   ├── main.jsx            # React root mount
│   └── supabaseClient.js   # Supabase SDK singleton initialization
├── .env                    # Local environment variables (Git ignored)
├── vercel.json             # Vercel configuration for SPA routing
├── vite.config.js          # Vite config & PWA plugin settings
└── package.json            # Project dependencies
```

---

## 🛠️ Local Setup Guide

Follow these steps to run the app locally on your machine.

### 1. Supabase Setup
1. Create a project at [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** in your Supabase dashboard and run the entire contents of `supabase/schema.sql` to generate the tables and security policies.
3. Go to **Authentication > Providers** and enable **Google**. Provide your Google Cloud Client ID and Secret.
4. Go to **Authentication > URL Configuration** and set the Site URL to `http://localhost:5173`. Add `http://localhost:5173/**` to Redirect URLs.

### 2. Environment Variables
Create a `.env` file in the root of the project and add your keys from Supabase (Project Settings -> API):
```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-anon-key-here
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
```

### 3. Install & Run
Open your terminal in the project directory and run:

```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. The app will automatically detect if your `.env` is configured and present the Google Login screen.

---

## 📱 PWA Support
This application is Progressive Web App (PWA) ready. When deployed over HTTPS, users can "Install" the web app directly to their iOS or Android home screens for a native app-like experience.
