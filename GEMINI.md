# NightOwl TO - Project Context for AI Assistance

This document provides essential context about the NightOwl TO project to help AI assistants like Gemini understand the codebase and make appropriate changes.

## Project Overview

NightOwl TO is a web application designed to help users in Toronto discover and track nightlife venues. The application features a sophisticated, seamless authentication flow, personalized recommendations, and a detailed onboarding process.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: Supabase Auth (OTP via Phone/Email)
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS with `tailwindcss-animate` for animations.
- **UI Components**: Custom, reusable components built on top of Radix UI primitives (as seen in `Button.tsx`).
- **State Management**: React Context API (`AuthContext.tsx`)
- **Form Handling**: React Hook Form
- **Icons**: Lucide Icons (`lucide-react`)
- **Deployment**: Vercel

## Project Structure

The project follows a standard Next.js App Router structure.

```
src/
├── app/                # Next.js 14+ app directory (routing)
│   ├── (main)/         # Main application routes after login
│   │   ├── for-you/    # Personalized recommendations
│   │   └── ...
│   ├── signup/         # Signup/Login flow entry point
│   └── layout.tsx      # Root layout
├── components/         # Reusable React components
│   ├── auth/           # Authentication-specific components
│   ├── ui/             # General-purpose UI elements (e.g., Button.tsx)
│   └── OnboardingTour.tsx # Multi-step onboarding component
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Manages user session and profile data
├── lib/                # Utility functions and configurations
│   ├── supabase/       # Supabase client configuration
│   └── utils.ts        # Helper functions (e.g., cn for classnames)
└── supabase/           # Supabase-specific files
    └── migrations/     # Database schema and RPC function migrations
```

## Authentication Flow

The authentication flow is designed to be seamless and intelligent, distinguishing between new and returning users.

1.  **Smart User Onboarding**:
    *   When a user enters their phone number in `PhoneAuth.tsx`, the system calls a custom Supabase RPC function (`get_user_id_by_phone`) to check if the user already exists.
    *   The UI adapts based on the result, showing "Welcome back!" for existing users.
    *   `AuthFlow.tsx` acts as a state machine, directing users through the necessary steps (e.g., collecting details for new users, skipping to the app for existing ones).

2.  **Session Management**:
    *   The core logic is managed in `AuthContext.tsx`.
    *   The signup page (`/signup`) automatically redirects authenticated users to the `/for-you` page, preventing them from seeing the login screen again.

3.  **Important Files**:
    *   `src/contexts/AuthContext.tsx`: Core auth logic and session management.
    *   `src/components/PhoneAuth.tsx`: Handles phone input and user existence check.
    *   `src/components/AuthFlow.tsx`: Orchestrates the multi-step auth/onboarding process.

## Key Components

- **`AuthFlow.tsx`**: A state machine that manages the entire user authentication and onboarding journey, from choosing an auth method to completing user preferences.
- **`PhoneAuth.tsx` / `EmailAuth.tsx`**: Components for handling OTP-based authentication. `PhoneAuth` includes logic to check for existing users.
- **`PreferencesPage.tsx`**: A form where users input their preferences (age, music, etc.) to get personalized recommendations.
- **`OnboardingTour.tsx`**: A component that likely provides a guided tour of the application for new users after they complete the signup process.
- **`Button.tsx`**: A custom, reusable button component built using Radix UI and `cva` (Class Variance Authority) for different variants and styles. This is the standard for buttons in the app.

## Data Loading

- **`/for-you` Page**: This page currently fetches all bar data on the client-side within a `useEffect` hook in `src/app/for-you/page.tsx`.
    - **Problem**: This is inefficient and not scalable. It fetches the entire `bars` table on every page load.
    - **Recommendation Logic**: The core recommendation logic is in a `useMemo` hook on the same page. It depends on the `user` object from `AuthContext` and the client-side `bars` fetch.
    - **Likely Issue**: The `user` object from `AuthContext` may not contain the necessary profile data (e.g., `preferred_music`, `location_neighbourhood`) for recommendations to work correctly, causing the carousels to appear empty. The context likely needs to be updated to fetch this associated user data.


## Styling

- The project uses **Tailwind CSS** for utility-first styling.
- The `globals.css` file contains base styles and Tailwind directives.
- **`tailwindcss-animate`** is used for animations.
- The `cn` utility function from `lib/utils.ts` is used to merge Tailwind classes, especially for creating variant-aware components.

## Database and Migrations

### Key Custom Logic
*   **User Existence Check (RPC)**: To securely check if a user exists by phone number, the project uses a PostgreSQL function.
    *   **Function**: `public.get_user_id_by_phone(p_phone_number TEXT)`
    *   **Location**: `supabase/migrations/002_add_rpc_for_user_check.sql`.

### Database Seeding
*   A seeding script is available at `scripts/seed-bars.ts`. This script is likely used to populate the `bars` table with initial data for development and testing. It should be run with `ts-node` or a similar tool.

### Applying Migrations
To apply new database migrations, run:
```bash
npx supabase db push
```

## Development Setup

1.  Install dependencies: `npm install`
2.  Set up your `.env.local` file based on `env.example`.
3.  Apply database migrations: `npx supabase db push`
4.  (Optional) Seed the database: `npx ts-node scripts/seed-bars.ts`
5.  Start the server: `npm run dev`

## Database Schema

Based on the migration files, here's a summary of the database schema:

**Tables:**

*   **users:** Extends `auth.users` to store user profile information.
*   **bars:** Stores information about bars, including name, location, and characteristics.
*   **user\_preferences:** Stores user preferences for personalized recommendations.
*   **submissions:** Stores user-submitted data about bars.
*   **favourite\_bars:** A join table for users and their favorite bars.

**Custom Types:**

*   `access_status`
*   `lineup_time_range`
*   `cover_frequency`
*   `cover_amount`
*   `age_group`
*   `music_genre`
*   `day_of_week`

**Views:**

*   **bar\_metrics\_view:** An aggregated view for bar metrics from submissions.

**Functions:**

*   **update\_geo\_coords():** A trigger function to automatically update `geo_coords` from latitude and longitude.
*   **update\_updated\_at\_column():** A trigger function to automatically update the `updated_at` timestamp.
*   **get\_user\_id\_by\_phone(p\_phone\_number TEXT):** A function to get a user ID by phone number.

**Row Level Security (RLS):**

*   RLS is enabled on all tables, with policies to restrict access to data based on user authentication and roles.