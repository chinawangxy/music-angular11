import { ShareModule } from './../../share/share.module';
import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WyCarouselComponent } from './components/wy-carousel';
import { MemberCardComponent } from './components/member-card/member-card.component';

@NgModule({
  declarations: [HomeComponent, WyCarouselComponent, MemberCardComponent],
  imports: [ShareModule, HomeRoutingModule],
})
export class HomeModule {}
