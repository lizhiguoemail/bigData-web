import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: UserLoginComponent, data: { title: '登录' }, },
  { path: 'register', component: UserRegisterComponent, data: { title: '注册' }, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassportRoutingModule {}
