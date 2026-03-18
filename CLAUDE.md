# CLAUDE.md - AI Assistant Guide for Michael Chandler Construction & Design Portfolio

**Last Updated**: 2025-11-17
**Project Type**: Construction Portfolio Website
**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Component Patterns](#component-patterns)
7. [State Management](#state-management)
8. [Styling Guidelines](#styling-guidelines)
9. [Database & Supabase](#database--supabase)
10. [Common Tasks](#common-tasks)
11. [Key Files Reference](#key-files-reference)
12. [Deployment](#deployment)
13. [Best Practices & Gotchas](#best-practices--gotchas)

---

## Project Overview

### Purpose
A professional portfolio website for Michael Chandler Construction & Design, showcasing construction projects across multiple categories (Residential, Commercial, Civil, Hospitality, Design Build).

### Key Features
- **Book Opening Animation**: Dramatic portfolio entry with charcoal panels
- **Project Gallery**: 20+ projects with 150+ images across 6 categories
- **AI Chatbot**: Lead generation with conversation storage
- **Admin Dashboard**: Image/video management with Supabase storage
- **Authentication**: Email-based auth with role management
- **Music Player**: Ambient background music controls
- **Dynamic Routing**: Project detail pages with galleries
- **Responsive Design**: Mobile-first with Tailwind breakpoints

### Project Context
- Originally built with Lovable.dev platform
- Deployed on Vercel
- Uses Supabase for backend (auth, database, storage, edge functions)
- Production URL: https://lovable.dev/projects/8d70aad7-b565-42e6-bddf-8ea85bfd9f37

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI framework with hooks |
| **TypeScript** | 5.8.3 | Type safety and developer experience |
| **Vite** | 7.1.12 | Build tool and dev server (port 8080) |
| **React Router** | 6.30.1 | Client-side routing with lazy loading |

### UI & Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **Radix UI** | Multiple | Headless UI primitives (50+ packages) |
| **Lucide React** | 0.462.0 | Icon library |
| **class-variance-authority** | 0.7.1 | Component variant styling |

### State & Data
| Technology | Version | Purpose |
|-----------|---------|---------|
| **TanStack React Query** | 5.83.0 | Server state management |
| **Supabase JS** | 2.75.0 | Backend client (auth, DB, storage) |
| **React Hook Form** | 7.61.1 | Form state management |
| **Zod** | 3.25.76 | Schema validation |

### Build & Dev Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **@vitejs/plugin-react-swc** | 3.11.0 | Fast Rust-based transpiler |
| **ESLint** | 9.32.0 | Code linting with React hooks plugin |
| **PostCSS** | 8.5.6 | CSS processing with Autoprefixer |
| **Sharp** | 0.34.4 | Image optimization |
| **TypeScript ESLint** | 8.38.0 | TypeScript linting rules |

---

## Directory Structure

```
constructiondesignnew-e33525f5/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components (50+)
│   │   ├── admin/               # Admin panel components
│   │   ├── auth/                # Authentication components
│   │   ├── Header.tsx           # Navigation header with smooth scroll
│   │   ├── Hero.tsx             # Hero section with video
│   │   ├── Portfolio.tsx        # Portfolio grid with category filtering
│   │   ├── About.tsx            # About section
│   │   ├── Services.tsx         # Services showcase
│   │   ├── Chatbot.tsx          # AI chatbot widget
│   │   ├── MusicPlayer.tsx      # Background music controls
│   │   ├── BookCoverHero.tsx    # Portfolio opening animation
│   │   ├── Footer.tsx           # Footer with contact info
│   │   └── [additional components]
│   │
│   ├── pages/                   # Route pages
│   │   ├── Index.tsx            # Home page (main landing)
│   │   ├── ProjectDetail.tsx    # Dynamic project detail page
│   │   ├── Portfolio.tsx        # Portfolio page
│   │   ├── Admin.tsx            # Admin dashboard
│   │   ├── AdminUsers.tsx       # User management
│   │   ├── Auth.tsx             # Sign up page
│   │   ├── Login.tsx            # Login page
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx       # Responsive breakpoint detection
│   │   ├── use-toast.ts         # Toast notification hook
│   │   └── useScrollAnimation.ts # Scroll-triggered animations
│   │
│   ├── integrations/            # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client config
│   │       └── types.ts         # Auto-generated DB types (10k+ lines)
│   │
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # cn() - Tailwind class merger
│   │
│   ├── data/                    # Static data
│   │   └── projects.ts          # Project definitions (48k+ lines, 20+ projects)
│   │
│   ├── assets/                  # Static assets
│   │   ├── projects/            # Project images (150+)
│   │   ├── hero-*.webp/mp4      # Hero media
│   │   ├── category-*.jpg       # Category showcase images
│   │   ├── mc-logo.png          # Logo files
│   │   └── [additional assets]
│   │
│   ├── App.tsx                  # Root component with routing
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles + design tokens
│   └── vite-env.d.ts            # Vite type definitions
│
├── public/                      # Static public assets
│   ├── favicon.*                # Favicon set (png, ico, svg)
│   └── robots.txt               # SEO directives
│
├── scripts/                     # Utility scripts
│   ├── generate-favicons.js     # Favicon generation
│   ├── convert-heic-to-jpg.js   # Image format conversion
│   └── [additional scripts]
│
├── supabase/                    # Supabase configuration
│
├── Configuration Files:
│   ├── package.json             # Dependencies and scripts
│   ├── tsconfig.json            # TypeScript config (project references)
│   ├── tsconfig.app.json        # App TypeScript config
│   ├── tsconfig.node.json       # Node TypeScript config
│   ├── vite.config.ts           # Vite build configuration
│   ├── tailwind.config.ts       # Tailwind customization
│   ├── components.json          # shadcn/ui configuration
│   ├── postcss.config.js        # PostCSS plugins
│   ├── eslint.config.js         # ESLint rules
│   └── .gitignore               # Git ignore patterns
│
└── Documentation:
    ├── README.md                # Project overview
    ├── DEPLOYMENT.md            # Deployment instructions
    ├── VERCEL_SETUP.md          # Vercel configuration
    └── [additional docs]
```

---

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd constructiondesignnew-e33525f5

# Install dependencies (Node.js required - use nvm)
npm install

# Start development server
npm run dev
# Server runs on http://localhost:8080
```

### Available Scripts

```json
{
  "dev": "vite",                    // Start dev server on :8080
  "build": "vite build",             // Production build
  "build:dev": "vite build --mode development",
  "lint": "eslint .",                // Run ESLint
  "preview": "vite preview",         // Preview production build
  "generate-favicons": "node scripts/generate-favicons.js"
}
```

### Development Server Details

**Configuration**: `vite.config.ts`

```typescript
server: {
  host: "::",      // Listen on all interfaces (IPv6)
  port: 8080,      // Default port
}
```

**Hot Module Replacement (HMR)**: Enabled by default via Vite + SWC

### Build Process

**Production Build**:
```bash
npm run build
# Output: /dist directory
```

**Build Optimizations**:
- **Code Splitting**: Manual chunks for vendors
  - `react-vendor`: React, React DOM, React Router
  - `ui-vendor`: Radix UI components
  - `supabase`: Supabase client
  - `query`: React Query
- **Minifier**: esbuild (faster than Terser)
- **Source Maps**: Disabled in production
- **Chunk Size Limit**: 1000KB warning threshold

### Linting

```bash
npm run lint
```

**ESLint Configuration** (`eslint.config.js`):
- **Rules**: Recommended JS + TypeScript rules
- **Plugins**: `react-hooks`, `react-refresh`
- **Disabled**: `@typescript-eslint/no-unused-vars` (off)
- **Files**: `**/*.{ts,tsx}`

---

## Code Conventions

### TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]              // Path alias for imports
  },
  "noImplicitAny": false,           // Allows implicit any
  "noUnusedParameters": false,
  "skipLibCheck": true,
  "allowJs": true,
  "strictNullChecks": false         // Relaxed null checking
}
```

**Import Patterns**:
```typescript
// Use @ alias for all src imports
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/mc-logo.png";

// External packages use standard imports
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
```

### File Naming Conventions

- **Components**: PascalCase with `.tsx` extension
  - Examples: `Header.tsx`, `ProjectDetail.tsx`, `BookCoverHero.tsx`
- **Hooks**: camelCase with `use` prefix
  - Examples: `use-mobile.tsx`, `use-toast.ts`, `useScrollAnimation.ts`
- **Utilities**: camelCase with `.ts` extension
  - Examples: `utils.ts`, `client.ts`, `types.ts`
- **Data Files**: camelCase with `.ts` extension
  - Examples: `projects.ts`

### Code Style

**General Rules**:
- Use **functional components** (no class components)
- Use **React hooks** for state and side effects
- Use **TypeScript interfaces** for prop types
- Use **React.memo** for performance optimization (when needed)
- Use **useCallback** for stable function references
- Use **useMemo** for expensive calculations

**Formatting**:
- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Trailing Commas**: Preferred

---

## Component Patterns

### Feature Component Pattern

**Example**: `src/components/Header.tsx`

```typescript
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";

// Define props interface
interface HeaderProps {
  onPortfolioClick?: () => void;
}

// Use React.memo for performance
export const Header = React.memo(({ onPortfolioClick }: HeaderProps) => {
  // Use useCallback for stable function references
  const handleSmoothScroll = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    itemName: string
  ) => {
    // Implementation
  }, [onPortfolioClick]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* JSX */}
    </header>
  );
});

// Always set displayName for debugging
Header.displayName = 'Header';
```

**Key Patterns**:
- Export component with `export const ComponentName`
- Use `React.memo()` wrapper for performance
- Set `displayName` for React DevTools
- Use `useCallback` for event handlers
- TypeScript interfaces for props

### Page Component Pattern

**Example**: `src/pages/ProjectDetail.tsx`

```typescript
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const ProjectDetail = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // Local state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [videos, setVideos] = useState([]);

  // Side effects
  useEffect(() => {
    // Fetch data, setup listeners
  }, [id]);

  // Memoized values
  const allImages = useMemo(() => {
    // Expensive calculation
  }, [dependency]);

  return (/* JSX */);
};

export default ProjectDetail;
```

**Key Patterns**:
- Default export for page components
- Use `useParams()` for route parameters
- Use `useNavigate()` for programmatic navigation
- Use `useEffect()` for data fetching
- Use `useMemo()` for expensive calculations

### UI Component Pattern (shadcn/ui)

**Example**: `src/components/ui/button.tsx`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define variants with class-variance-authority
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Props interface extends HTML attributes + variant props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Use forwardRef for ref forwarding
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Key Patterns**:
- Use `class-variance-authority` (cva) for variants
- Use `forwardRef` for ref forwarding
- Use `Slot` from Radix for `asChild` prop pattern
- Export both component and variants
- Use `cn()` utility to merge classes

### Custom Hook Pattern

**Example**: `src/hooks/use-mobile.tsx`

```typescript
import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
```

**Key Patterns**:
- Prefix with `use`
- Return values or objects
- Handle cleanup in `useEffect` return
- Export as named export

---

## State Management

### Architecture Overview

This project uses a **hybrid state management** approach:

1. **Local State** (useState) - UI state, form inputs
2. **React Query** (TanStack) - Server state, async data
3. **Supabase Real-time** - Database state
4. **React Hook Form** - Form state
5. **Auth State** - Supabase auth listeners

### Local State Pattern

**Used for**: UI toggles, modal state, loading indicators

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
```

### Server State Pattern (React Query)

**Configuration**: `src/App.tsx`

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
</QueryClientProvider>
```

**Usage**: Admin features for data fetching

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
});
```

### Supabase State Pattern

**Client**: `src/integrations/supabase/client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

**Usage Patterns**:

```typescript
// Fetch data
const { data, error } = await supabase
  .from('project_images')
  .select('*')
  .eq('project_id', id)
  .order('display_order');

// Insert data
const { error } = await supabase
  .from('client_leads')
  .insert({ email, conversation_history });

// Upload file
const { data, error } = await supabase.storage
  .from('project-images')
  .upload(filePath, file);
```

### Auth State Pattern

**Setup**: `src/App.tsx`

```typescript
const [user, setUser] = useState<User | null>(null);
const [session, setSession] = useState<Session | null>(null);

useEffect(() => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Form State Pattern (React Hook Form + Zod)

**Example**: `src/pages/Auth.tsx`

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define validation schema
const authSchema = z.object({
  email: z.string().email("Invalid email").max(255),
  password: z.string()
    .min(8, "Minimum 8 characters")
    .max(72)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number")
});

type AuthFormData = z.infer<typeof authSchema>;

// Use in component
const form = useForm<AuthFormData>({
  resolver: zodResolver(authSchema),
  defaultValues: { email: "", password: "" }
});

const onSubmit = async (data: AuthFormData) => {
  // Handle form submission
};
```

---

## Styling Guidelines

### Design System

**File**: `src/index.css`

#### Color Palette (HSL Variables)

```css
:root {
  /* Brand Colors */
  --gold: 42 50% 58%;           /* Accent gold #D4A574 */
  --charcoal: 0 0% 17%;         /* Dark charcoal #2B2B2B */
  --cream: 42 15% 96%;          /* Light cream #F8F6F3 */
  --burgundy: 350 35% 42%;      /* Deep burgundy #8B4A5B */
  --steel-blue: 215 15% 38%;    /* Steel blue #52667A */

  /* Semantic Colors */
  --background: 42 15% 96%;     /* Cream background */
  --foreground: 0 0% 17%;       /* Charcoal text */
  --primary: 0 0% 17%;          /* Charcoal primary */
  --primary-foreground: 42 15% 96%;
  --accent: 42 50% 58%;         /* Gold accent */
  --secondary: 42 10% 90%;
  --muted: 42 10% 90%;
  --destructive: 0 84.2% 60.2%; /* Red */
  --border: 42 10% 88%;
  --input: 42 10% 88%;
  --ring: 42 50% 58%;           /* Gold focus ring */

  /* Component-specific */
  --radius: 0.5rem;             /* Border radius */
}

.dark {
  /* Dark mode inverts colors */
  --background: 0 0% 17%;
  --foreground: 42 15% 96%;
  /* ... etc */
}
```

#### Using Design Tokens

```typescript
// Tailwind classes automatically use CSS variables
<div className="bg-background text-foreground border-border">
<Button className="bg-gold text-charcoal">

// Custom classes in Tailwind config
<div className="text-gold bg-charcoal border-accent">
```

### Typography System

**Fonts**: Configured in `tailwind.config.ts`

```typescript
fontFamily: {
  inter: ['Inter', 'sans-serif'],              // Body text
  playfair: ['Playfair Display', 'serif'],     // Headings
}
```

**Font Imports**: `src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
```

**Usage**:

```typescript
<h1 className="font-playfair text-4xl font-bold">Heading</h1>
<p className="font-inter text-base font-light">Body text</p>
```

### Tailwind Utility Patterns

**cn() Utility**: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage Examples**:

```typescript
// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  error && "error-class"
)} />

// Merge with variants
<Button className={cn(
  buttonVariants({ variant, size }),
  customClassName
)} />

// Override without conflicts
<div className={cn("p-4", "p-6")} />
// Result: "p-6" (twMerge prevents conflicts)
```

### Responsive Design

**Breakpoints**: Tailwind defaults

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Mobile-First Pattern**:

```typescript
// Base: mobile
// md: tablet
// lg: desktop
<div className="flex-col md:flex-row lg:gap-8">
  <nav className="hidden md:flex">
  <Sheet className="md:hidden">
</div>
```

**useIsMobile Hook**: `src/hooks/use-mobile.tsx`

```typescript
const isMobile = useIsMobile();

{isMobile ? <MobileNav /> : <DesktopNav />}
```

### Animation Patterns

**Tailwind Animate Plugin**: `tailwind.config.ts`

```typescript
plugins: [
  require("tailwindcss-animate"),
  require("@tailwindcss/typography"),
]
```

**Custom Animations**: `src/index.css`

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
```

**Usage**:

```typescript
<div className="animate-accordion-down">
<div className="transition-all duration-300 hover:scale-105">
<div className="animate-in fade-in slide-in-from-bottom-4">
```

### Accessibility Considerations

- **prefers-reduced-motion**: Respected in animations

  ```css
  @media (prefers-reduced-motion: reduce) {
    .book-animation { animation: none; }
  }
  ```

- **Focus States**: Always include focus rings

  ```typescript
  <button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  ```

- **Semantic HTML**: Use proper heading hierarchy, landmarks

---

## Database & Supabase

### Configuration

**Environment Variables**: `.env`

```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Client Setup**: `src/integrations/supabase/client.ts`

```typescript
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

### Database Schema

**Auto-Generated Types**: `src/integrations/supabase/types.ts` (10k+ lines)

**Key Tables**:

#### `client_leads`
```typescript
{
  id: string (uuid)
  email: string
  conversation_history: Json
  created_at: string
  updated_at: string
}
```

**Usage**: AI chatbot conversation storage

#### `project_images`
```typescript
{
  id: string (uuid)
  project_id: string
  image_url: string
  display_order: number
  is_before_after: boolean
  uploaded_by: string (uuid, references auth.users)
  created_at: string
}
```

**Usage**: Dynamically uploaded project images

#### `project_videos`
```typescript
{
  id: string (uuid)
  project_id: string
  video_url: string
  display_order: number
  uploaded_by: string (uuid)
  created_at: string
}
```

**Usage**: Project video galleries

#### `project_documents`
```typescript
{
  id: string (uuid)
  project_id: string
  document_url: string
  document_type: string
  uploaded_by: string (uuid)
  created_at: string
}
```

**Usage**: Project PDFs and documents

#### `user_roles`
```typescript
{
  id: string (uuid)
  user_id: string (uuid, references auth.users)
  role: string ('admin' | 'user')
  created_at: string
}
```

**Usage**: Role-based access control

#### `audit_logs`
```typescript
{
  id: string (uuid)
  user_id: string (uuid)
  action: string
  details: Json
  created_at: string
}
```

**Usage**: Activity tracking

### Common Supabase Patterns

#### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password,
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

#### Database Queries

```typescript
// Select with filter
const { data, error } = await supabase
  .from('project_images')
  .select('*')
  .eq('project_id', projectId)
  .order('display_order', { ascending: true });

// Insert
const { data, error } = await supabase
  .from('client_leads')
  .insert({
    email: userEmail,
    conversation_history: messages,
  });

// Update
const { data, error } = await supabase
  .from('project_images')
  .update({ display_order: newOrder })
  .eq('id', imageId);

// Delete
const { error } = await supabase
  .from('project_videos')
  .delete()
  .eq('id', videoId);
```

#### Storage Operations

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('project-images')
  .upload(`${projectId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });

// Get public URL
const { data } = supabase.storage
  .from('project-images')
  .getPublicUrl(filePath);

// Delete file
const { error } = await supabase.storage
  .from('project-images')
  .remove([filePath]);
```

#### Edge Functions (AI Chatbot)

```typescript
const { data, error } = await supabase.functions.invoke('chat', {
  body: { message: userMessage },
});
```

### Role-Based Access Control

**Admin Check Pattern**:

```typescript
const checkAdminRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    navigate('/login');
    return false;
  }

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (data?.role !== 'admin') {
    navigate('/');
    return false;
  }

  return true;
};
```

---

## Common Tasks

### Adding a New Component

1. **Create component file**:
   ```bash
   # Feature component
   touch src/components/MyComponent.tsx

   # UI component (use shadcn CLI)
   npx shadcn-ui@latest add [component-name]
   ```

2. **Component template**:
   ```typescript
   import React from "react";

   interface MyComponentProps {
     title: string;
     // ... props
   }

   export const MyComponent = React.memo(({ title }: MyComponentProps) => {
     return (
       <div className="container">
         <h2>{title}</h2>
       </div>
     );
   });

   MyComponent.displayName = 'MyComponent';
   ```

3. **Import and use**:
   ```typescript
   import { MyComponent } from "@/components/MyComponent";

   <MyComponent title="Hello" />
   ```

### Adding a New Page/Route

1. **Create page component**:
   ```bash
   touch src/pages/MyPage.tsx
   ```

2. **Add to router** (`src/App.tsx`):
   ```typescript
   const MyPage = lazy(() => import("./pages/MyPage"));

   const router = createBrowserRouter([
     // ... existing routes
     { path: "/my-page", element: <MyPage /> },
   ]);
   ```

3. **Add navigation link**:
   ```typescript
   import { Link } from "react-router-dom";

   <Link to="/my-page">My Page</Link>
   ```

### Adding a New Project

**File**: `src/data/projects.ts`

1. **Import images**:
   ```typescript
   import myProject1 from "@/assets/projects/my-project-1.jpg";
   import myProject2 from "@/assets/projects/my-project-2.jpg";
   ```

2. **Add project object**:
   ```typescript
   export const projects: Project[] = [
     // ... existing projects
     {
       id: "my-project",
       title: "My Project Title",
       category: "Residential Construction",
       description: "Project description...",
       images: [myProject1, myProject2],
       thumbnail: myProject1,
       featured: false,
     },
   ];
   ```

### Managing Supabase Migrations

**Note**: This project uses Supabase Dashboard for schema management.

If using CLI migrations:

```bash
# Create migration
npx supabase migration new add_new_table

# Apply migrations
npx supabase db push

# Generate types
npx supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Optimizing Images

**Using Sharp** (Node.js script):

```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(1920, 1080, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile('output.webp');
```

**Script**: `scripts/convert-heic-to-jpg.js`

```bash
node scripts/convert-heic-to-jpg.js
```

### Adding Environment Variables

1. **Add to `.env`**:
   ```env
   VITE_NEW_VAR=value
   ```

2. **Update `.env.example`** (if exists):
   ```env
   VITE_NEW_VAR=
   ```

3. **Access in code**:
   ```typescript
   const myVar = import.meta.env.VITE_NEW_VAR;
   ```

**Important**: All Vite env vars must be prefixed with `VITE_`

---

## Key Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|-------------|
| `package.json` | Dependencies and scripts | Scripts, dependencies, dev server |
| `vite.config.ts` | Vite build config | Port 8080, chunk splitting, path aliases |
| `tsconfig.json` | TypeScript config | Path aliases `@/*`, strict mode settings |
| `tailwind.config.ts` | Tailwind customization | Colors, fonts, container, plugins |
| `components.json` | shadcn/ui config | Style: default, aliases, paths |
| `eslint.config.js` | Linting rules | React hooks, TypeScript, unused vars off |
| `postcss.config.js` | PostCSS plugins | Tailwind, Autoprefixer |

### Core Application Files

| File | Purpose | Key Content |
|------|---------|-------------|
| `src/App.tsx` | Root component | Router, auth state, QueryClient provider |
| `src/main.tsx` | Entry point | React render, StrictMode |
| `src/index.css` | Global styles | Design tokens, Tailwind imports, animations |
| `src/data/projects.ts` | Project data | 20+ projects, image imports, types |
| `src/integrations/supabase/client.ts` | Supabase client | Client config, auth settings |
| `src/integrations/supabase/types.ts` | Database types | Auto-generated TypeScript types |

### Important Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `src/components/Header.tsx` | Navigation, smooth scroll, mobile menu |
| Portfolio | `src/components/Portfolio.tsx` | Project grid, category filtering |
| ProjectDetail | `src/pages/ProjectDetail.tsx` | Dynamic project page, image galleries |
| Chatbot | `src/components/Chatbot.tsx` | AI lead generation chatbot |
| Admin | `src/pages/Admin.tsx` | Admin dashboard, image/video upload |

### Utility Files

| File | Purpose | Exports |
|------|---------|---------|
| `src/lib/utils.ts` | Helper functions | `cn()` - class merger |
| `src/hooks/use-mobile.tsx` | Responsive hook | `useIsMobile()` |
| `src/hooks/use-toast.ts` | Toast notifications | `useToast()`, `toast()` |

---

## Deployment

### Vercel Deployment

**Primary Platform**: Vercel (configured via Lovable)

**Manual Deployment**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables**: Set in Vercel Dashboard

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Build Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Build Verification

```bash
# Build locally
npm run build

# Preview build
npm run preview
```

**Check for**:
- No TypeScript errors
- No ESLint errors
- All env vars present
- Build output < 500KB per chunk (ideal)

### Pre-Deployment Checklist

- [ ] All images optimized (WebP preferred)
- [ ] No console errors in production
- [ ] Auth flows tested
- [ ] Database connections work
- [ ] Environment variables set
- [ ] 404 page configured
- [ ] Mobile responsive tested
- [ ] Lighthouse score > 90

---

## Best Practices & Gotchas

### TypeScript

**✅ Do**:
- Use `@/` path alias for all src imports
- Define interfaces for all component props
- Use `type` for simple types, `interface` for objects

**❌ Don't**:
- Use `any` unnecessarily (though `noImplicitAny: false` allows it)
- Forget to add types to new components
- Use relative imports like `../../components`

### React Patterns

**✅ Do**:
- Use `React.memo` for components that re-render frequently
- Use `useCallback` for event handlers passed as props
- Use `useMemo` for expensive calculations
- Set `displayName` on all memoized components
- Use lazy loading for route components

**❌ Don't**:
- Create components inside other components
- Forget dependencies in useEffect/useCallback/useMemo
- Use inline object/array literals as props (causes re-renders)

### Styling

**✅ Do**:
- Use `cn()` utility for conditional classes
- Use design tokens (--gold, --charcoal, etc.)
- Follow mobile-first responsive design
- Use semantic color names (background, foreground, accent)

**❌ Don't**:
- Use arbitrary values when design tokens exist
- Inline CSS styles (use Tailwind)
- Override Tailwind without `cn()` (causes conflicts)
- Forget dark mode classes

### Performance

**✅ Do**:
- Lazy load images (`loading="lazy"`)
- Use WebP format for images
- Code split routes with `lazy()`
- Memoize expensive calculations
- Use proper chunk splitting (configured in vite.config.ts)

**❌ Don't**:
- Import all projects at once (use lazy loading)
- Load large videos without compression
- Fetch all data on mount (paginate)

### Supabase

**✅ Do**:
- Use TypeScript types from `types.ts`
- Handle errors in all queries
- Use Row Level Security (RLS) policies
- Validate user input before DB operations
- Check auth state before protected operations

**❌ Don't**:
- Store sensitive data in localStorage (use Supabase auth)
- Skip error handling on queries
- Trust client-side auth checks only (use RLS)
- Commit `.env` file to git

### Common Gotchas

1. **Port Already in Use**: Vite uses port 8080, not 3000
   ```bash
   # Change port in vite.config.ts or kill process
   lsof -ti:8080 | xargs kill
   ```

2. **Supabase Types Out of Sync**: Regenerate types after schema changes
   ```bash
   npx supabase gen types typescript --project-id [id] > src/integrations/supabase/types.ts
   ```

3. **Build Fails on Type Errors**: Check `tsconfig.json` - some strict checks are disabled

4. **Images Not Loading**: Check import paths use `@/assets/` alias

5. **Auth Redirect Loop**: Clear localStorage and check auth callbacks

6. **Tailwind Classes Not Working**: Ensure file is in `content` array in `tailwind.config.ts`

### Security Considerations

**✅ Do**:
- Use Supabase RLS policies for data access
- Validate all user input with Zod
- Use environment variables for secrets
- Sanitize user-generated content
- Check admin role server-side (RLS policies)

**❌ Don't**:
- Store API keys in code
- Trust client-side role checks only
- Allow unauthenticated file uploads
- Skip input validation

---

## AI Assistant Guidelines

### When Modifying Code

1. **Always read files before editing** - Use the Read tool
2. **Preserve existing patterns** - Follow the component patterns above
3. **Use TypeScript** - Don't skip type definitions
4. **Test changes** - Suggest running `npm run dev` after changes
5. **Update dependencies carefully** - Check compatibility first

### When Adding Features

1. **Check existing components first** - May already exist in shadcn/ui
2. **Follow naming conventions** - PascalCase for components
3. **Add to appropriate directory** - components/ vs pages/ vs hooks/
4. **Update this guide** - If adding significant patterns
5. **Consider mobile** - Always responsive-first

### When Debugging

1. **Check browser console** - Most errors appear there
2. **Verify env variables** - Common source of errors
3. **Check Supabase logs** - For database/auth issues
4. **Use React DevTools** - Component hierarchy and state
5. **Check Network tab** - For API/fetch issues

### When Optimizing

1. **Profile first** - Use React DevTools Profiler
2. **Optimize images** - WebP, proper sizing
3. **Check bundle size** - `npm run build` shows sizes
4. **Lazy load routes** - Already implemented
5. **Memoize selectively** - Only when profiling shows benefit

---

## Conclusion

This guide covers the essential architecture, patterns, and conventions for the Michael Chandler Construction & Design portfolio website. When in doubt:

1. **Check existing code** - Follow established patterns
2. **Read documentation** - React, TypeScript, Tailwind, shadcn/ui
3. **Test thoroughly** - Run dev server and verify changes
4. **Ask for clarification** - Better to ask than assume

**Key Principles**:
- **Type Safety**: Use TypeScript for all new code
- **Component Reusability**: Use shadcn/ui and composition
- **Performance**: Lazy load, memoize, optimize images
- **Accessibility**: Semantic HTML, ARIA, keyboard navigation
- **Maintainability**: Clear naming, consistent patterns, documentation

---

**Document Maintained By**: AI Assistant (Claude)
**Last Updated**: 2025-11-17
**Version**: 1.0.0
