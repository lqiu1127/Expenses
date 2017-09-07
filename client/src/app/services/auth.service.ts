import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  domain = "http://localhost:3000"; // Development Domain
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    // Get token to attach to headers
    this.loadToken(); 
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  // Get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');
  }

  // Register user accounts
  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  // Check if username is taken
  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  // Check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  // Login user
  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  // Logout
  logout() {
    // Clear the current user information
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // Store user's data in client local storage
  storeUserData(token, user) {
     // Set user and token in local storage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Assign token  and user for later use
    this.authToken = token; 
    this.user = user;
  }

  // Get user's profile data
  getProfile() {
     // Create headers before sending to API
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  // Check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }
}