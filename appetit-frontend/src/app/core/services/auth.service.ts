import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseAuth } from '../../interfaces/ResponseAuth';
import { AUTH_TOKEN_KEY } from '../auth.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this._token());

  getToken(): string | null {
    return this._token();
  }

  login(email: string, password: string): Observable<ResponseAuth> {
    return this.http
      .post<ResponseAuth>(`${environment.apiUrl}/Auth/Login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success && response.accessToken) {
            localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
            this._token.set(response.accessToken);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}
