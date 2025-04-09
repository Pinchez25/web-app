import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'mifosx-survey-statistics',
  templateUrl: './survey-statistics.component.html',
  styleUrls: ['./survey-statistics.component.scss']
})
export class SurveyStatisticsComponent implements AfterViewInit {
  surveyData: any = {
    surveyName: 'Climate Change',
    totalResponses: 2,
    questions: [
      {
        questionCode: '1',
        questionText: 'How concerned are you about climate change?',
        choices: [
          { choiceText: 'Not at all concerned', count: 1, percentage: 14.29 },
          { choiceText: 'Slightly concerned', count: 3, percentage: 42.86 },
          { choiceText: 'Moderately concerned', count: 0, percentage: 0 },
          { choiceText: 'Very Concerned', count: 1, percentage: 14.29 },
          { choiceText: 'Extremely Concerned', count: 2, percentage: 28.57 }
        ]
      },
      {
        questionCode: '2',
        questionText: 'How often do you recycle?',
        choices: [
          { choiceText: 'Never', count: 1, percentage: 14.29 },
          { choiceText: 'Monthly', count: 1, percentage: 14.29 },
          { choiceText: 'Weekly', count: 1, percentage: 14.29 },
          { choiceText: 'Several times per week', count: 1, percentage: 14.29 },
          { choiceText: 'Daily', count: 3, percentage: 42.86 }
        ]
      },
      {
        questionCode: '3',
        questionText: 'Do you compost food waste?',
        choices: [
          { choiceText: 'Yes', count: 1, percentage: 14.29 },
          { choiceText: 'No', count: 4, percentage: 57.14 },
          { choiceText: 'Sometimes', count: 2, percentage: 28.57 }
        ]
      },
      {
        questionCode: '4',
        questionText: 'What is your primary mode of transportation?',
        choices: [
          { choiceText: 'Personal Car', count: 0, percentage: 0 },
          { choiceText: 'Public Transportation', count: 0, percentage: 0 },
          { choiceText: 'Wlaking', count: 1, percentage: 14.29 },
          { choiceText: 'Carpool', count: 1, percentage: 14.29 },
          { choiceText: 'Bicycle', count: 3, percentage: 42.86 },
          { choiceText: 'Other', count: 2, percentage: 28.57 }
        ]
      },
      {
        questionCode: '5',
        questionText: 'How many reusable bags do you own?',
        choices: [
          { choiceText: '0', count: 1, percentage: 14.29 },
          { choiceText: '1-2', count: 0, percentage: 0 },
          { choiceText: '3-5', count: 2, percentage: 28.57 },
          { choiceText: '6-10', count: 2, percentage: 28.57 },
          { choiceText: 'More than 10', count: 2, percentage: 28.57 }
        ]
      },
      {
        questionCode: '6',
        questionText: "How important is a company's environmental stance in your purchasing decisions?",
        choices: [
          { choiceText: 'Not Important', count: 0, percentage: 0 },
          { choiceText: 'Somewhat Important', count: 1, percentage: 14.29 },
          { choiceText: 'Important', count: 2, percentage: 28.57 },
          { choiceText: 'Very Important', count: 3, percentage: 42.86 },
          { choiceText: 'Crucial', count: 1, percentage: 14.29 }
        ]
      },
      {
        questionCode: '7',
        questionText: 'Are you willing to pay more for environmentally friendly products?',
        choices: [
          { choiceText: 'Yes', count: 1, percentage: 14.29 },
          { choiceText: 'No', count: 4, percentage: 57.14 },
          { choiceText: 'It depends on the price difference', count: 2, percentage: 28.57 }
        ]
      }
    ]
  };

  showPercentage = true;
  chartInstances: { [questionCode: string]: any } = {};
  chartTypes: { [questionCode: string]: string } = {};
  colourPalette: string[] = [];

  private readonly baseHues: number[] = [
    0, // Red
    120, // Green
    240, // Blue
    60, // Yellow
    180, // Cyan
    300, // Magenta
    30, // Orange
    150, // Lime
    210, // Light Blue
    330 // Pink

  ];

  private generateColourPalette(numberOfColours: number): string[] {
    const palette: string[] = [];
    const baseHueCount = this.baseHues.length;

    for (let i = 0; i < numberOfColours; i++) {
      const baseHueIndex = i % baseHueCount;
      const baseHue = this.baseHues[baseHueIndex];

      // Add slight variation to base hue for more distinct colours
      const hueVariation = (Math.random() - 0.5) * 20;
      const hue = (baseHue + hueVariation) % 360;

      // Use high saturation for vibrant colours
      const saturation = 85 + Math.random() * 15;

      // Use medium lightness for good contrast
      const lightness = 45 + Math.random() * 15;

      palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return palette;
  }

  ngAfterViewInit(): void {
    this.renderAllCharts();
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

  renderAllCharts(): void {
    // Generate enough colours for the largest question set
    const maxChoices = Math.max(...this.surveyData.questions.map((q: { choices: any[] }) => q.choices.length)) || 8;
    this.colourPalette = this.generateColourPalette(maxChoices);

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
        display: chartType === 'pie',
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
