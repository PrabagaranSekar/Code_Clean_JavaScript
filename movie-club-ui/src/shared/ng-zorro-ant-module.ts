
import { NgModule } from '@angular/core';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  exports: [
    NzAutocompleteModule,
    NzCardModule,
    NzLayoutModule,
    NzAnchorModule
  ]
})
export class NgZorroAntdModule {

}
