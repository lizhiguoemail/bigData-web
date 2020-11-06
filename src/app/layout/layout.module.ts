import { LayoutModule as CDKLayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

// passport
import { LayoutPassportComponent } from './passport/passport.component';
import { LayoutDefaultComponent } from './default/default.component';

const PASSPORT = [LayoutPassportComponent, LayoutDefaultComponent];

@NgModule({
  imports: [SharedModule, CDKLayoutModule],
  declarations: [...PASSPORT],
  exports: [...PASSPORT],
})
export class LayoutModule {}
