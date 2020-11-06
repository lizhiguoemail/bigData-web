import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { UtilModule } from '@utils';
// passport pages
import { UserLoginComponent } from './login/login.component';
import { UserRegisterComponent } from './register/register.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PassportRoutingModule } from './passport-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PassportRoutingModule,
    SharedModule,
    UtilModule
  ],
  declarations: [
    // passport pages
    UserLoginComponent,
    UserRegisterComponent,
  ]
})
export class PassportModule {}
