import { InjectionToken, NgModule } from '@angular/core';

export const API_CONFIG = new InjectionToken('ApiConfig');

@NgModule({
  declarations: [],
  imports: [],
  providers: [{ provide: API_CONFIG, useValue: 'http://localhost:3000' }],
})
export class ServicesModule {}
