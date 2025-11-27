# Mentorship Frontend — System Diagram

```mermaid
flowchart TB
    subgraph Client["Angular App (ModulesModule)"]
        direction TB
        Landing["Landing Page Module (/home)"]
        Auth["Authentication Module (/auth)"]
        RegSteps["Registration Steps Module (/auth/registeration-steps)"]
        Dashboard["Dashboard Module (/dashboard)"]
    end

    subgraph Core["Core Layer"]
        AuthService["AuthenticationService\n• Supabase Auth wrapper\n• Manages IUser + tokens"]
        Guards["Route Guards\nauthGuard / guestGuard / roleGuard /\nregistrationCompletionGuard"]
        Storage["Storage Utils\n(localStorage helpers)"]
    end

    subgraph Backend["Supabase"]
        SupabaseAuth["Supabase Auth API"]
        SupabaseDB["User Metadata\nregistrationCompleted flag"]
    end

    Auth <-- lazy load --> Client
    RegSteps <-- lazy load --> Client
    Dashboard <-- lazy load --> Client

    AuthService <--> Storage
    Guards --> AuthService

    AuthService <--> SupabaseAuth
    SupabaseAuth --> SupabaseDB

    RegSteps -->|"SteperService"| AuthService
    Dashboard --> Guards
```

## Flow Details

1. **Routing & Modules**
   - `app-routing.module.ts` bootstraps `ModulesModule`, which redirects to `/auth`, `/home`, or `/dashboard`.
   - Each feature module has its own routing file for lazy loading.

2. **Authentication**
   - `AuthenticationService` wraps Supabase SDK calls, stores `IUser` plus tokens, and exposes status via `BehaviorSubject`s.
   - `authGuard` protects authenticated areas; `guestGuard` keeps logged-in users out of auth forms.
   - `roleGuard` variants enforce mentor/mentee/admin routes.

3. **Registration Steps**
   - `SteperService` lives in `modules/registration-steps/services`.
   - Shared four steps for both roles; mentors automatically get the fifth “Preference” step.
   - Completing the wizard calls `AuthenticationService.markRegistrationComplete()`, updating Supabase metadata and redirecting to `dashboard/discover`.

4. **Dashboard Access**
   - `DashboardRoutingModule` applies `authGuard` + `registrationCompletionGuard`, ensuring mentors finish onboarding before accessing main pages.

5. **Storage & Tokens**
   - User snapshots + access tokens are persisted via `StorageKeys.USER_DATA`/`TOKEN`.
   - Supabase handles refresh; local data stays current via `initializeAuth()` and auth state listeners.

Use this diagram as the high-level map; dive into the corresponding files for implementation specifics.

