import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';
import { ContenteditComponent } from './contentedit/contentedit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewPageComponent } from './view-page/view-page.component';

const routes: Routes = [{ path: '', component: ContentComponent, children: [
  {path: 'createArticle', component: ContenteditComponent},
  {path: 'createArticle/:id', component: ContenteditComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'viewPage/:id', component: ViewPageComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
