import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../../core/auth/services/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService:AuthService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  loginError = signal<string | null>(null); // partie 0

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]], // partie 0
    password: ['', [Validators.required, Validators.minLength(6)] ]
  })

  onSubmit() {
    if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loginError.set(null);

    const credentials = this.loginForm.getRawValue()
    this.authService.login(credentials)
      .subscribe({
      next: () => {
        this.router.navigate(['/tasks'])
      },
      error: () => {
        this.loginError.set('Nom d’utilisateur ou mot de passe incorrect');
      },
    });
  }


}
