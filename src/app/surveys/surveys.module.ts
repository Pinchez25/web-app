import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyStatisticsComponent } from './survey-statistics/survey-statistics.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Route } from '../core/route/route.service';
import { ColourService } from './services/colour-service';

const routes: Routes = [
  Route.withShell([
    {
      path: 'surveys',
      data: { title: 'Surveys', breadcrumb: 'Surveys' },
      children: [
        {
          path: 'statistics',
          component: SurveyStatisticsComponent,
          data: { title: 'Survey Statistics', breadcrumb: 'Statistics' }
        }
      ]
    }
  ])

];

@NgModule({
  declarations: [
    SurveyStatisticsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)],
  providers: [
    ColourService
  ]
})
export class SurveysModule {}
