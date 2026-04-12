import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TextFieldComponent, NgIcon],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  emailErrors: Record<string, string> = {
    required: 'E-mail é obrigatório.',
    email: 'Informe um e-mail válido.',
  };

  passwordErrors: Record<string, string> = {
    required: 'Senha é obrigatória.',
    minlength: 'A senha deve ter pelo menos 6 caracteres.',
  };

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/products']);
        } else {
          this.errorMessage.set(response.message || 'Credenciais inválidas.');
          this.loading.set(false);
        }
      },
      error: () => {
        this.errorMessage.set('Não foi possível conectar ao servidor. Tente novamente.');
        this.loading.set(false);
      },
    });
  }
}
