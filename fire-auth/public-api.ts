
// Export all exposable angular assets from ./src folder, like components, services, pipes, directives etc.
export * from './src/fire-auth.module';
export * from './src/constants/fire-auth.constants';
export * from './src/services/fire-auth-ui.service';
export * from './src/services/fire-auth.service';
export * from './src/components/login/login.component';
export * from './src/components/login-status/login-status.component';
// Auth Guards

export * from './src/guards/is-logged-in.guard';
export * from './src/guards/role-admin.guard';
export * from './src/guards/role-author.guard';
export * from './src/guards/role-editor.guard';
export * from './src/guards/role-manager.guard';
export * from './src/guards/role-paid-member.guard';
export * from './src/guards/role-reader.guard';
export * from './src/guards/role-student.guard';
export * from './src/guards/role-teacher.guard';
