import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '../core/route/route.service';
import { SharedModule } from '../shared/shared.module';
import { ColourService } from './services/colour-service';
import { SurveysService } from './services/surveys.service';
import { SurveyStatisticsComponent } from './survey-statistics/survey-statistics.component';

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
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    SurveyStatisticsComponent
  ],
  exports: [
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ColourService,
    SurveysService
  ]
})
export class SurveysModule {}
