import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Create login form with form builder
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Disable the form
  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

  // Enable the form
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  // Submit form and login
  onLoginSubmit() {
    // Set to processing and disable form
    this.processing = true;
    this.disableForm();

    // Create user object from input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    // Send login data to API
    this.authService.login(user).subscribe(data => {
      if (!data.success) {
         // Set error message
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        // Enable submit button and form editing
        this.processing = false;
        this.enableForm();
      } else {
         // Set success message
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // Store user's token in client local storage
        this.authService.storeUserData(data.token, data.user);
        // Redirect to dashboard page
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    });
  }

  ngOnInit() {
  }

}