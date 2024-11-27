
import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbar : MatSnackBar,
    private loadingService: LoadingService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingService.show();
      const { email ,password } = this.loginForm.value
      this.authService.login({email,password}).subscribe({
        next: (response)=>{
          this.snackbar.open('Login succesfull !', 'Close',{
            duration : 3000,
            horizontalPosition: 'center',
            verticalPosition : 'top'
          })
          this.router.navigate(['/dashboard']);
          this.loadingService.hide();
        },
        error: (error)=>{
          this.snackbar.open('Login Failed! invalid credentials.','Close',{
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          })
          this.loadingService.hide();
        }
      })
    }
  }

  getErrorMessage(field: string): string {
    if (this.loginForm.get(field)?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (this.loginForm.get(field)?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (this.loginForm.get(field)?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}