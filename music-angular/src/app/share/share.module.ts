import { ZorroModule } from './zorro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WyUiModule } from './wy-ui/wy-ui.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ZorroModule, WyUiModule],
  exports: [CommonModule, FormsModule, ZorroModule, WyUiModule],
})
export class ShareModule {}
