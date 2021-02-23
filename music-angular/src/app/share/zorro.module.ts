import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  declarations: [],
  imports: [
    NzButtonModule,
    NzMenuModule,
    NzIconModule,
    NzLayoutModule,
    NzInputModule,
    NzCarouselModule,
  ],
  exports: [
    NzButtonModule,
    NzMenuModule,
    NzIconModule,
    NzLayoutModule,
    NzInputModule,
    NzCarouselModule,
  ],
})
export class ZorroModule {}
