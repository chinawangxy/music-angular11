import { ServicesModule } from './../services/services.module';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [],
  imports: [HomeModule, ServicesModule],
  exports: [HomeModule],
})
export class PagesModule {}
