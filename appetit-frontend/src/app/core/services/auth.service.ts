import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly token = signal<string | null>('mock-bearer-token');

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string): void {
    this.token.set(token);
  }

  clearToken(): void {
    this.token.set(null);
  }
}
