# Michael E. Chandler — Construction & Design Portfolio

A professional portfolio website for **Michael E. Chandler**, a construction executive with 37+ years of experience and a $500M+ project portfolio. The site showcases high-end residential, civil engineering, hospitality, and design/build projects across the United States and internationally.

## 🌐 Live Site

Deployed via [Lovable](https://lovable.dev).

---

## ✨ Features

- **Animated Portfolio Grid** — Signature "book opening" page-flip animation for project reveals
- **Project Detail Pages** — Full image galleries, project stats (sq ft, duration, features), and descriptions
- **Category Filtering** — Browse projects by: Residential Construction, Design/Build, Civil, Hospitality, Residential Development
- **Contact Page** — Business hours, address, and contact form
- **Admin Panel** — Supabase-backed auth with admin dashboard and user management
- **Dark/Light Theme** — Persistent theme toggle
- **Fully Responsive** — Mobile-first design

---

## 🗂️ Pages

| Route | Description |
|---|---|
| `/` | Home — hero, portfolio grid, stats, testimonials, CTA |
| `/projects/:id` | Project detail page with full image gallery |
| `/contact` | Contact form and business info |
| `/design` | Design services page |
| `/login` | Admin login |
| `/signup` | Admin account creation |
| `/admin` | Admin dashboard (protected) |
| `/admin/users` | User management (protected) |

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Routing:** React Router v6 (lazy-loaded routes)
- **Auth & Backend:** Supabase
- **State:** TanStack Query (React Query)
- **Fonts:** Playfair Display, Inter

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
```

---

## 🔐 Environment Variables

This project uses Supabase for authentication and backend services. The Supabase config is in `src/integrations/supabase/client.ts`.

For local development, create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
src/
├── assets/          # Project images (.webp)
├── components/      # Reusable UI components
├── contexts/        # Auth context (Supabase)
├── data/
│   └── projects.ts  # All project data and image imports
├── integrations/    # Supabase client
├── pages/           # Route-level page components
└── App.tsx          # Router and app providers
```

---

## 📞 Contact

**Michael E. Chandler**  
8215 Winding Hills Ln, Spring, Texas 77379  
Cellular: (435) 237-7373  
Email: mike.rcccon@yahoo.com
