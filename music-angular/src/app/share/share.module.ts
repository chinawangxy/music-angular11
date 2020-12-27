import { ZorroModule } from './zorro.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ZorroModule],
  exports: [CommonModule, FormsModule, ZorroModule],
})
export class ShareModule {}
