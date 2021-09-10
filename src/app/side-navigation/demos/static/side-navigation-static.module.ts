import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { USWDSSidenavModule } from 'uswds-components';
import { SideNavigationStaticComponent } from './side-navigation-static.component';


@NgModule({
  imports: [
    CommonModule,
    USWDSSidenavModule
  ],
  declarations: [
    SideNavigationStaticComponent
  ],
  exports: [
    SideNavigationStaticComponent
  ]
})
export class SideNavigationStaticModule { }
