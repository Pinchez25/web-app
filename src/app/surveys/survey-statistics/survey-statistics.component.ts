import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SurveysService } from '../services/surveys.service';
import Chart from 'chart.js';
import { ColourService } from '../services/colour-service';

@Component({
  selector: 'mifosx-survey-statistics',
  templateUrl: './survey-statistics.component.html',
  styleUrls: ['./survey-statistics.component.scss']
})
export class SurveyStatisticsComponent implements OnInit {
  surveys: any[] = [];
  selectedSurveyId: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  surveyData: any = {
    surveyName: '',
    totalResponses: 0,
    questions: []
  };

  showPercentage = true;
  chartInstances: { [questionCode: string]: any } = {};
  chartTypes: { [questionCode: string]: string } = {};
  colourPalette: string[] = [];
  useAccessiblePalette = false;

  surveyId: number;
  surveyName: string;

  constructor(
    private surveysService: SurveysService,
    private colourService: ColourService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { title: string }) => {
      this.titleService.setTitle(data.title);
    });

    this.route.params.subscribe((params) => {
      this.surveyId = +params['id'];
      this.loadSurveyData();
    });
  }

  private loadSurveyData(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.surveysService.getSurveys().subscribe(
      (data: any[]) => {
        this.surveys = data;
        if (this.surveys.length > 0) {
          this.selectedSurveyId = this.surveys[0].id;
          this.loadSurveyAnalytics(this.surveys[0].name);
        } else {
          this.isLoading = false;
          this.errorMessage = 'No surveys available.';
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load surveys. Please try again later.';
        console.error('Error loading surveys:', error);
      }
    );
  }

  loadSurveyAnalytics(surveyName: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.surveysService.getSurveyAnalytics(surveyName).subscribe(
      (data: any) => {
        this.surveyData = data;
        this.isLoading = false;
        setTimeout(() => {
          this.renderAllCharts();
        }, 0);
        this.route.data.subscribe((data: { title: string }) => {
          this.titleService.setTitle(`${surveyName} - ${data.title}`);
        });
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load survey analytics. Please try again later.';
        console.error('Error loading survey analytics:', error);
      }
    );
  }

  onSurveyChange(surveyId: number): void {
    this.selectedSurveyId = surveyId;
    const selectedSurvey = this.surveys.find((survey) => survey.id === surveyId);
    if (selectedSurvey) {
      this.loadSurveyAnalytics(selectedSurvey.name);
    }
  }

  toggleDataType(): void {
    this.showPercentage = !this.showPercentage;
    this.renderAllCharts();
  }

  toggleChartType(questionCode: string): void {
    const currentType = this.chartTypes[questionCode] || 'pie';
    const nextType = currentType === 'pie' ? 'bar' : 'pie';
    this.chartTypes[questionCode] = nextType;
    this.renderChart(questionCode);
  }

  toggleAllCharts(): void {
    for (const question of this.surveyData.questions) {
      this.toggleChartType(question.questionCode);
    }
  }

  toggleAccessiblePalette(): void {
    this.useAccessiblePalette = !this.useAccessiblePalette;
    this.renderAllCharts();
  }

  renderAllCharts(): void {
    // Generate enough colours for the largest question set
    const maxChoices = Math.max(...this.surveyData.questions.map((q: { choices: any[] }) => q.choices.length)) || 8;

    if (this.useAccessiblePalette) {
      this.colourPalette = this.colourService.generateAccessiblePalette(maxChoices);
    } else {
      this.colourPalette = this.colourService.generateColourPalette(maxChoices, {
        distribution: 'golden',
        saturation: 85,
        lightness: 55
      });
    }

    for (const question of this.surveyData.questions) {
      this.chartTypes[question.questionCode] = 'pie';
      this.renderChart(question.questionCode);
    }
  }

  renderChart(questionCode: string): void {
    const question = this.surveyData.questions.find((q: any) => q.questionCode === questionCode);
    if (!question) return;

    const canvasId = 'chart-' + questionCode;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!ctx) return;

    const chart = this.chartInstances[questionCode];
    if (chart) {
      (chart as any).destroy();
    }

    const chartType = this.chartTypes[questionCode] || 'pie';
    const data = {
      labels: question.choices.map((choice: any) => choice.choiceText),
      datasets: [
        {
          label: this.showPercentage ? 'Percentage' : 'Count',
          data: question.choices.map((choice: any) => (this.showPercentage ? choice.percentage : choice.count)),
          backgroundColor: this.colourPalette
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 800,
        easing: 'easeInOutQuart'
      },
      legend: {
        display: true,
        position: 'top',
        align: 'center',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: question.questionText,
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          top: 8,
          bottom: 16
        }
      },
      scales:
        chartType === 'bar'
          ? {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              ]
            }
          : undefined,
      plugins: {
        tooltip: {
          titleFont: {
            size: 13,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          padding: 8,
          cornerRadius: 4
        }
      }
    };

    this.chartInstances[questionCode] = new Chart(ctx, {
      type: chartType,
      data,
      options
    });
  }
}
