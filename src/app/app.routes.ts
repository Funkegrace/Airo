import { Routes } from '@angular/router';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'form',
      pathMatch: 'full',
    },
    {
      path: 'form',
      component: FormPageComponent,
    },
    {
        path: 'result',
        component:ResultPageComponent,
      }
  
  ];