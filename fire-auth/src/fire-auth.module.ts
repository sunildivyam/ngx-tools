
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SpinnerModule } from '@annuadvent/ngx-common-ui/spinner';
import { ErrorModule } from '@annuadvent/ngx-common-ui/error';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { FireCommonModule } from '@annuadvent/ngx-tools/fire-common';
// Guards
import { IsLoggedInGuard } from './guards/is-logged-in.guard';
import { RoleAdminGuard } from './guards/role-admin.guard';
import { RoleAuthorGuard } from './guards/role-author.guard';
import { RoleEditorGuard } from './guards/role-editor.guard';
import { RoleManagerGuard } from './guards/role-manager.guard';
import { RolePaidMemberGuard } from './guards/role-paid-member.guard';
import { RoleReaderGuard } from './guards/role-reader.guard';
import { RoleStudentGuard } from './guards/role-student.guard';
import { RoleTeacherGuard } from './guards/role-teacher.guard';



@NgModule({
  declarations: [
    LoginComponent,
    LoginStatusComponent,
  ],
  providers: [
    // Guards
    IsLoggedInGuard,
    RoleAdminGuard,
    RoleAuthorGuard,
    RoleEditorGuard,
    RoleManagerGuard,
    RolePaidMemberGuard,
    RoleReaderGuard,
    RoleStudentGuard,
    RoleTeacherGuard,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SpinnerModule,
    ErrorModule,
    FireCommonModule,
  ],
  exports: [
    LoginComponent,
    LoginStatusComponent,
  ],
})
export class FireAuthModule { }
