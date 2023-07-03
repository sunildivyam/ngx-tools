import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BASE64_USER } from '../../constants/fire-auth.constants';
import { FireAuthService } from '../../services/fire-auth.service';

@Component({
  selector: 'anu-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.scss']
})
export class LoginStatusComponent implements OnInit {
  @Input() loginPageUrl: string = '';
  @Input() profilePageUrl: string = '';
  @Input() loggedOutPageUrl: string = '';
  @Input() theme: string = '';

  @Output() signInClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() signOutClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() profileClicked: EventEmitter<void> = new EventEmitter<void>();

  user: any;
  loading: boolean = false;
  userIcon: string = BASE64_USER;

  constructor(private fireAuthService: FireAuthService, private router: Router) {
    this.fireAuthService.authStateChanged().subscribe(u => {
      this.user = u;
    });
  }

  ngOnInit(): void {
    this.user = this.fireAuthService.getCurrentUser();
  }

  private async logout(): Promise<void> {
    this.loading = true;
    try {
      await this.fireAuthService.logout();
    } catch (error: any) {
      console.log(error)
      this.loading = false;
    }
    this.loading = false;
    this.router.navigate([this.loggedOutPageUrl])
  }

  public loggedInProfileClicked(event: any) {
    this.profileClicked.emit();
  }

  public loginClicked(event: any) {
    this.signInClicked.emit();
  }

  public logoutClicked(event: any) {
    event.preventDefault();
    this.signOutClicked.emit();
    this.logout();
  }
}
