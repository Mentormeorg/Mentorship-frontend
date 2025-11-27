# Role-Based Guards Documentation

## Overview

Role-based guards have been implemented to protect routes based on user roles (MENTOR, MENTEE, ADMIN). This allows you to restrict access to specific routes based on the user's role.

---

## Available Guards

### 1. **roleGuard(allowedRoles: RolesEnum[])**
A flexible guard factory that accepts an array of allowed roles.

**Usage:**
```typescript
import { roleGuard } from '@core/guards';
import { RolesEnum } from '@core/enums/roles.enum';

// In your routing module
{
  path: 'mentor-only',
  component: MentorComponent,
  canActivate: [roleGuard([RolesEnum.MENTOR])]
}

// Allow multiple roles
{
  path: 'admin-panel',
  component: AdminPanelComponent,
  canActivate: [roleGuard([RolesEnum.MENTOR, RolesEnum.ADMIN])]
}
```

### 2. **mentorGuard**
Pre-configured guard for mentor-only routes.

**Usage:**
```typescript
import { mentorGuard } from '@core/guards';

{
  path: 'mentor-dashboard',
  component: MentorDashboardComponent,
  canActivate: [mentorGuard]
}
```

### 3. **menteeGuard**
Pre-configured guard for mentee-only routes.

**Usage:**
```typescript
import { menteeGuard } from '@core/guards';

{
  path: 'mentee-dashboard',
  component: MenteeDashboardComponent,
  canActivate: [menteeGuard]
}
```

### 4. **adminGuard**
Pre-configured guard for admin-only routes.

**Usage:**
```typescript
import { adminGuard } from '@core/guards';

{
  path: 'admin-panel',
  component: AdminPanelComponent,
  canActivate: [adminGuard]
}
```

### 5. **mentorOrAdminGuard**
Guard for routes accessible by both mentors and admins.

**Usage:**
```typescript
import { mentorOrAdminGuard } from '@core/guards';

{
  path: 'mentor-management',
  component: MentorManagementComponent,
  canActivate: [mentorOrAdminGuard]
}
```

### 6. **menteeOrAdminGuard**
Guard for routes accessible by both mentees and admins.

**Usage:**
```typescript
import { menteeOrAdminGuard } from '@core/guards';

{
  path: 'mentee-management',
  component: MenteeManagementComponent,
  canActivate: [menteeOrAdminGuard]
}
```

---

## Authentication Service Helper Methods

The `AuthenticationService` now includes helper methods to check user roles programmatically:

### Methods Available:

```typescript
// Check if user has a specific role
authService.hasRole(RolesEnum.MENTOR); // returns boolean

// Check if user has any of the specified roles
authService.hasAnyRole([RolesEnum.MENTOR, RolesEnum.ADMIN]); // returns boolean

// Convenience methods
authService.isMentor(); // returns boolean
authService.isMentee(); // returns boolean
authService.isAdmin(); // returns boolean

// Get current user role
authService.getCurrentRole(); // returns RolesEnum | null
```

### Usage in Components:

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@core/services/authentication.service';
import { RolesEnum } from '@core/enums/roles.enum';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="authService.isMentor()">
      Mentor-only content
    </div>
    <div *ngIf="authService.isAdmin()">
      Admin-only content
    </div>
  `
})
export class ExampleComponent {
  constructor(public authService: AuthenticationService) {}
}
```

---

## Complete Example: Route Configuration

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { 
  authGuard, 
  mentorGuard, 
  menteeGuard, 
  adminGuard,
  roleGuard 
} from '@core/guards';
import { RolesEnum } from '@core/enums/roles.enum';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard], // Requires authentication
    children: [
      {
        path: 'mentor',
        component: MentorDashboardComponent,
        canActivate: [mentorGuard] // Only mentors
      },
      {
        path: 'mentee',
        component: MenteeDashboardComponent,
        canActivate: [menteeGuard] // Only mentees
      },
      {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [adminGuard] // Only admins
      },
      {
        path: 'shared',
        component: SharedComponent,
        canActivate: [roleGuard([RolesEnum.MENTOR, RolesEnum.MENTEE])] // Mentors and mentees
      }
    ]
  }
];
```

---

## Behavior

### When User is Not Authenticated:
- Redirects to sign-in page
- Preserves the attempted URL in `returnUrl` query parameter

### When User Doesn't Have Required Role:
- Redirects to discover page
- Adds `unauthorized: true` query parameter (can be used to show error message)

### When User Has Required Role:
- Allows access to the route
- No redirect

---

## Combining Guards

You can combine multiple guards:

```typescript
{
  path: 'protected-route',
  component: ProtectedComponent,
  canActivate: [authGuard, mentorGuard] // Must be authenticated AND be a mentor
}
```

**Note:** Guards are executed in order. If any guard returns `false`, access is denied.

---

## Best Practices

1. **Always use `authGuard` first** if you need authentication:
   ```typescript
   canActivate: [authGuard, mentorGuard]
   ```

2. **Use specific guards** when possible for better readability:
   ```typescript
   // Good
   canActivate: [mentorGuard]
   
   // Also good, but less readable
   canActivate: [roleGuard([RolesEnum.MENTOR])]
   ```

3. **Check roles in components** for conditional rendering:
   ```typescript
   // In template
   <button *ngIf="authService.isMentor()">Mentor Action</button>
   ```

4. **Use role guards for route protection**, not just UI hiding:
   - Guards protect routes (security)
   - Component checks hide UI elements (UX)

---

## Testing Role Guards

When testing routes with role guards:

1. **Mock the AuthenticationService**:
   ```typescript
   const mockAuthService = {
     userData: new BehaviorSubject<IUser | null>({
       id: '1',
       role: RolesEnum.MENTOR,
       // ... other user properties
     })
   };
   ```

2. **Test different roles**:
   ```typescript
   // Test mentor access
   mockAuthService.userData.next({ ...user, role: RolesEnum.MENTOR });
   
   // Test mentee access
   mockAuthService.userData.next({ ...user, role: RolesEnum.MENTEE });
   ```

---

## Migration Guide

If you have existing routes that need role protection:

1. **Import the guard**:
   ```typescript
   import { mentorGuard } from '@core/guards';
   ```

2. **Add to route configuration**:
   ```typescript
   {
     path: 'mentor-route',
     component: MentorComponent,
     canActivate: [authGuard, mentorGuard] // Add guards
   }
   ```

3. **Update component logic** if needed:
   ```typescript
   // Remove manual role checks in ngOnInit
   // Guards now handle this automatically
   ```

---

## Troubleshooting

### Issue: User can't access route even with correct role
- **Check**: User role is set correctly in Supabase user_metadata
- **Check**: User role is mapped correctly in `mapSupabaseUserToIUser()`
- **Check**: Route guard is applied correctly

### Issue: Redirect loop
- **Check**: Don't apply `guestGuard` and `authGuard` to the same route
- **Check**: Ensure redirect paths don't have conflicting guards

### Issue: Role not updating
- **Check**: User metadata is updated in Supabase
- **Check**: `onAuthStateChange` listener is working
- **Check**: User data is refreshed after role change

---

*Last Updated: [Current Date]*

