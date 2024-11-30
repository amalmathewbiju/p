import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService : AuthService,
    private router: Router,
    private snackbar : MatSnackBar,
    private loadingService: LoadingService
  ){
    this.registerForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      confirmPassword : ['',[Validators.required]]
    },{validators : this.passwordMatchValidator});
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    } else {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.loadingService.show();
      const {name, email, password} = this.registerForm.value;
      this.authService.registerUser( {name, email, password}).subscribe({
        next: (response)=>{
          this.snackbar.open('Registration Success','Close',{
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login'])
          this.loadingService.hide();
        },
        error: (error)=>{
          this.snackbar.open('Registration failed: '+error.message,'Close',{
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          })
          this.loadingService.hide();
        }
      })
 
    }
  }

  getErrorMessage(field: string) {
    const control = this.registerForm.get(field);

    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return `Please enter a valid email`;
    }
    if (control?.hasError('minlength')) {
      if (field === 'password') {
        return 'Password must be at least 6 characters long';
      }
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least 3 characters long`;
    }
    if (control?.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  togglePasswordVis(){
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVis(){
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }


}
