# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an interior design portfolio website for Michael Chandler Design, built with React + TypeScript + Vite and deployed via Lovable.dev platform. The site features an animated portfolio viewer, AI chatbot for lead generation, and an admin dashboard for managing customer inquiries.

## Development Commands

### Starting Development
```bash
# Install dependencies
npm i

# Start development server (runs on http://localhost:8080)
npm run dev
```

### Building
```bash
# Production build
npm run build

# Development build (includes component tagging)
npm run build:dev

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint
npm run lint
```

Note: There are no test scripts configured in this project.

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero section
│   ├── Portfolio.tsx   # Portfolio grid view
│   ├── Chatbot.tsx     # AI chatbot interface
│   └── ...
├── pages/              # Route components
│   ├── Index.tsx       # Main landing page with book animation
│   ├── ProjectDetail.tsx  # Individual project view
│   ├── Admin.tsx       # Admin dashboard
│   └── Auth.tsx        # Authentication page
├── data/               # Static data
│   └── projects.ts     # Portfolio projects data
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets (images, etc.)

supabase/
├── functions/          # Edge Functions
│   └── chatbot/        # AI chatbot backend
└── migrations/         # Database migrations
```

## Architecture

### Routing
- **React Router v6** for client-side routing
- Routes defined in `src/App.tsx`
- Main routes: `/` (home), `/project/:id` (project detail), `/auth` (login), `/admin` (dashboard)
- Catch-all `/*` route for 404 handling

### State Management
- React Context for global state (TooltipProvider, QueryClientProvider)
- TanStack Query for server state management
- Local component state with useState/useEffect hooks
- Supabase auth state listener in App.tsx for session management

### Authentication & Authorization
- Supabase Auth for authentication
- Role-based access control (RBAC) using `has_role()` RPC function
- Admin role required for `/admin` route access
- Auth state tracked globally in App.tsx and checked per-route

### Portfolio Book Animation
The homepage features a unique "book opening" animation:
- Managed via `bookOpened`, `animating`, and `prefersReducedMotion` state
- Animation triggers on portfolio button click
- Respects user's reduced motion preferences
- Escape key closes portfolio view
- Animation duration: 1.5 seconds
- Uses custom Tailwind animations: `animate-book-open-left`, `animate-book-open-right`, etc.

### Chatbot Integration
- **Frontend**: `src/components/Chatbot.tsx` - floating chat UI
- **Backend**: `supabase/functions/chatbot/index.ts` - Deno Edge Function
- AI model: Google Gemini 2.5 Flash via Lovable AI Gateway
- Rate limiting: 5 requests/minute, 3 new conversations/hour per IP
- Lead capture: Extracts user info (name, email, phone, project type, budget) from conversation
- Conversation history limited to last 50 messages
- Validation with Zod schema for lead data

### Database
- Supabase PostgreSQL database
- Tables: `client_leads`, `audit_logs`
- Row-Level Security (RLS) policies enforce admin-only access for updates
- Migrations located in `supabase/migrations/`
- TypeScript types auto-generated in `src/integrations/supabase/types.ts`

### Styling
- Tailwind CSS with custom theme
- shadcn-ui component library (imported via `@/components/ui`)
- Custom colors: `gold`, `charcoal`, `cream`, `burgundy`, `steelBlue`
- Custom fonts: Inter (sans-serif), Playfair Display (serif)
- CSS variables for theme values defined in `src/index.css`
- Path alias `@/` resolves to `./src/`

## Important Technical Details

### Environment Variables
Required environment variables (stored in `.env`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon public key

For Edge Functions:
- `LOVABLE_API_KEY` - API key for AI gateway
- `SUPABASE_SERVICE_ROLE_KEY` - Admin access key

### TypeScript Configuration
- Strict type checking is **disabled** (`noImplicitAny: false`, `strictNullChecks: false`)
- Path alias `@/*` maps to `./src/*`
- Unused parameters/locals checks disabled for flexibility

### Supabase Edge Functions
- Written in Deno (not Node.js)
- Use Deno imports: `https://deno.land/std@...` and `https://esm.sh/...`
- CORS headers required for browser requests
- Service role key used for admin operations (bypasses RLS)

### Project Data
- Portfolio projects are hardcoded in `src/data/projects.ts`
- Projects are NOT stored in database
- Each project contains: id, title, description, category, images array, featured flag
- Images imported as static assets from `src/assets/projects/`

### Admin Dashboard
- Accessible only to users with 'admin' role
- Server-side role check via `has_role()` RPC
- Displays customer leads from chatbot
- Currently functional but lead fetching not fully implemented (TODO in code)

### Development with Lovable
- Project managed via Lovable.dev platform
- Changes from Lovable automatically committed to this repo
- `lovable-tagger` plugin adds component metadata in dev mode
- Git URL: https://lovable.dev/projects/8d70aad7-b565-42e6-bddf-8ea85bfd9f37

## Key Files to Understand

1. **src/App.tsx** - Application shell, routing, auth state
2. **src/pages/Index.tsx** - Main page with book animation logic
3. **src/data/projects.ts** - All portfolio project data
4. **src/components/Chatbot.tsx** - Client-side chatbot UI
5. **supabase/functions/chatbot/index.ts** - Server-side chatbot logic
6. **vite.config.ts** - Build configuration and path aliases
7. **tailwind.config.ts** - Custom theme and design tokens

## Common Workflows

### Adding a New Portfolio Project
1. Add project images to `src/assets/projects/`
2. Import images in `src/data/projects.ts`
3. Add project object to `projects` array with required fields
4. Images will be bundled by Vite automatically

### Modifying the Chatbot
- **Prompt changes**: Edit `systemPrompt` in `supabase/functions/chatbot/index.ts`
- **Lead validation**: Update `LeadSchema` (Zod) in same file
- **UI changes**: Modify `src/components/Chatbot.tsx`
- Deploy edge function changes via Supabase CLI or Lovable platform

### Adding a New Route
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx` (must be ABOVE the `*` catch-all route)
3. Update navigation in `src/components/Header.tsx` if needed

### Working with Supabase
- Client instance: `import { supabase } from "@/integrations/supabase/client"`
- Types: `import type { Database } from "@/integrations/supabase/types"`
- Auth: `supabase.auth.getSession()`, `supabase.auth.signOut()`
- Database: `supabase.from('table_name').select()`, etc.

### Deploying
Deployment is handled through the Lovable platform:
1. Go to https://lovable.dev/projects/8d70aad7-b565-42e6-bddf-8ea85bfd9f37
2. Click Share → Publish
3. Optionally connect a custom domain via Project > Settings > Domains
