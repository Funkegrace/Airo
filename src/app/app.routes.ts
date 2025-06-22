import { Routes } from '@angular/router';
import { FormPageComponent } from './form-page/form-page.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'form',
      pathMatch: 'full',
    },
    {
      path: 'form',
      component: FormPageComponent,
    }
  
  ];