import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // Create Form on component load
  }

  // Create registration form
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail // Custom validation
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername // Custom validation
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword // Custom validation
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') }); // Additional validator for matching passwords
  }

  // Disable the registration form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // Enable the registration form
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  // Validate e-mail is proper format
  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  // Function to validate password
  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  // Ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  // Submit form
  onRegisterSubmit() {
     // Set to processing and disable the form
    this.processing = true;
    this.disableForm();

    // Create user object form inputs
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    // Authentication service to register user
    this.authService.registerUser(user).subscribe(data => {
      if (!data.success) {
        // Set an error message
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
         // Re-enable form and submit button
        this.processing = false;
        this.enableForm();
      } else {
        // Set a success message
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // After timeout, navigate to the login page
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login view
        }, 1000);
      }
    });

  }

  // Check if e-mail is taken
  checkEmail() {
    // Authentication file to check if e-mail is taken
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false;
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true;
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  // Check if username is available
  checkUsername() {
    // Authentication file to check if username is taken
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false;
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true;
        this.usernameMessage = data.message; // Return success message
      }
    });
  }

  ngOnInit() {
  }

}