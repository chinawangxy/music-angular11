import { NgModule } from '@angular/core';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import { PlayCountPipe } from '../pipes/play-count.pipe';

@NgModule({
  declarations: [SingleSheetComponent, PlayCountPipe],
  exports: [SingleSheetComponent, PlayCountPipe],
})
export class WyUiModule {}
