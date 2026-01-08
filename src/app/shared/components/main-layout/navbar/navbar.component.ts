import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PATHS } from '@core/paths';
import { RolesEnum } from '@core/enums/roles.enum';
import { AuthenticationService } from '@core/services/authentication.service';
import { IUser } from '@core/interfaces/user.interface';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

interface NavLink {
  label: string;
  route: string;
  visible?: (user: IUser | null) => boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  readonly PATHS = PATHS;
  
  isAuthenticated$: Observable<boolean>;
  userData$: Observable<IUser | null>;
  vm$: Observable<{
    isAuthenticated: boolean;
    user: IUser | null;
  }>;

  navLinks: NavLink[] = [
    {
      label: 'Find a mentor',
      route: `../${PATHS.DISCOVER}`,
      visible: () => true,
    },
  ];

  constructor(
    private readonly _authService: AuthenticationService,
    private readonly _router: Router
  ) {
    this.isAuthenticated$ = this._authService.isAuthenticated;
    this.userData$ = this._authService.userData;
    
    this.vm$ = combineLatest([
      this.isAuthenticated$,
      this.userData$,
    ]).pipe(
      map(([isAuthenticated, user]) => ({
        isAuthenticated,
        user,
      }))
    );
  }

  ngOnInit(): void {
    // Component initialization
  }

  getUserMenuItems(user: IUser | null): MenuItem[] {
    if (!user) {
      return [];
    }

    return [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.navigateToProfile(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.navigateToSettings(),
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.handleLogout(),
      },
    ];
  }

  getDisplayName(user: IUser | null): string {
    if (!user) return '';
    return user.fullName || user.email || 'User';
  }

  getUserInitials(user: IUser | null): string {
    if (!user) return '';
    const name = user.fullName || user.email || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || 'U';
  }

  handleLogout(): void {
    this._authService.logout().subscribe({
      next: () => {
        // Navigation is handled by the service
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Error handling is done by the service
      },
    });
  }

  navigateToSignIn(): void {
    this._router.navigate([`../${PATHS.AUTH__SIGN_IN}`]);
  }

  navigateToSignUp(): void {
    this._router.navigate([`../${PATHS.AUTH__SIGN_UP}`]);
  }

  navigateToProfile(): void {
    // TODO: Implement profile navigation when profile page is available
    console.log('Navigate to profile');
  }

  navigateToSettings(): void {
    // TODO: Implement settings navigation when settings page is available
    console.log('Navigate to settings');
  }

  navigateToHome(): void {
    this._router.navigate([`/${PATHS.HOME}`]);
  }
}
