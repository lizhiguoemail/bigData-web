import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';
import { TranslateModule } from '@ngx-translate/core';
import { ParticlesModule } from './particle';

import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { UtilModule } from '../utils/utils.module';

const THIRDMODULES = [
  TranslateModule,
  CountUpModule
];
const COMPONENTS_ENTRY = [
];
const COMPONENTS = [
];
const DIRECTIVES = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ParticlesModule,
    UtilModule,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ParticlesModule,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule { }
