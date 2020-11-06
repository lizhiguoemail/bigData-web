import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-passport-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
  })
  export class UserRegisterComponent implements OnDestroy {
    constructor(){
    }

    ngOnDestroy(): void {
    }
  }
