import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WyCarouselComponent } from './components/wy-carousel';

@NgModule({
  declarations: [HomeComponent, WyCarouselComponent],
  imports: [ShareModule, HomeRoutingModule],
})
export class HomeModule {}
