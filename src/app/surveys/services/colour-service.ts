import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColourService {
  private readonly baseHues: number[] = [
    0, // Red
    210, // Blue
    120, // Green
    45, // Orange
    275, // Purple
    180, // Cyan
    330, // Pink
    150, // Lime
    240, // Indigo
    60 // Yellow

  ];

  /**
   * Generates a deterministic, visually distinct colour palette
   * @param numberOfColours The number of colours needed
   * @param options Optional configuration parameters
   * @returns Array of HSL colour strings
   */
  generateColourPalette(
    numberOfColours: number,
    options: {
      saturation?: number;
      lightness?: number;
      distribution?: 'even' | 'golden' | 'base';
    } = {}
  ): string[] {
    const palette: string[] = [];
    const { saturation = 85, lightness = 55, distribution = 'golden' } = options;

    // Choose distribution strategy
    if (distribution === 'even') {
      // Even distribution across the colour wheel
      for (let i = 0; i < numberOfColours; i++) {
        const hue = Math.round(((i * 360) / numberOfColours) % 360);
        palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
    } else if (distribution === 'golden') {
      // Golden ratio distribution for maximum distinction
      const goldenRatioConjugate = 0.618033988749895;
      let h = Math.random(); // Random starting point

      for (let i = 0; i < numberOfColours; i++) {
        h = (h + goldenRatioConjugate) % 1;
        const hue = Math.round(h * 360);
        palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
      }
    } else {
      // Use base hues with intelligent spacing
      const baseHueCount = this.baseHues.length;

      for (let i = 0; i < numberOfColours; i++) {
        // If we need more colours than our base set
        if (i >= baseHueCount) {
          // For additional colours, introduce variations based on the position
          const baseIndex = i % baseHueCount;
          const cycleNumber = Math.floor(i / baseHueCount);
          const baseHue = this.baseHues[baseIndex];

          // Alternate between lighter and darker variants
          const adjustedLightness = cycleNumber % 2 === 0 ? lightness + 15 : lightness - 10;

          // Alternate between more and less saturated variants
          const adjustedSaturation = cycleNumber % 2 === 0 ? saturation - 10 : saturation;

          // Slight hue shift for variety
          const hueShift = 10 * ((cycleNumber % 3) - 1);
          const hue = (baseHue + hueShift + 360) % 360;

          palette.push(`hsl(${hue}, ${adjustedSaturation}%, ${adjustedLightness}%)`);
        } else {
          // Use base hues directly for the first set
          palette.push(`hsl(${this.baseHues[i]}, ${saturation}%, ${lightness}%)`);
        }
      }
    }

    return palette;
  }

  /**
   * Checks if a palette has sufficient contrast between colours
   * @param palette The colour palette to check
   * @returns true if the palette has good contrast
   */
  hasSufficientContrast(palette: string[]): boolean {
    // Simple implementation - can be enhanced with actual colour distance calculations
    const minimumHueDifference = 30;

    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const hue1 = this.extractHue(palette[i]);
        const hue2 = this.extractHue(palette[j]);

        const hueDiff = Math.min(Math.abs(hue1 - hue2), 360 - Math.abs(hue1 - hue2));

        if (hueDiff < minimumHueDifference) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Extracts the hue value from an HSL colour string
   */
  private extractHue(hslColour: string): number {
    const match = hslColour.match(/hsl\((\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Generates an accessible palette with colour-blindness considerations
   * @param numberOfColours The number of colours needed
   * @returns Array of colourblind-friendly HSL colour strings
   */
  generateAccessiblePalette(numberOfColours: number): string[] {
    // ColourBlind-friendly base hues (avoiding red-green confusion)
    const accessibleHues = [
      215, // Blue
      45, // Yellow/Orange
      270, // Purple
      180, // Cyan/Teal
      330, // Pink/Magenta
      150, // Blue-green
      90, // Yellow-green
      20 // Orange-red

    ];

    const palette: string[] = [];

    for (let i = 0; i < numberOfColours; i++) {
      if (i < accessibleHues.length) {
        // Use base colours first
        palette.push(`hsl(${accessibleHues[i]}, 75%, 55%)`);
      } else {
        // Then use variations with different lightness
        const index = i % accessibleHues.length;
        const cycle = Math.floor(i / accessibleHues.length);
        const lightness = 55 - cycle * 15;

        if (lightness < 30) {
          // If too dark, switch to lighter colours with lower saturation
          palette.push(`hsl(${accessibleHues[index]}, 60%, ${70 + (cycle - 2) * 10}%)`);
        } else {
          palette.push(`hsl(${accessibleHues[index]}, 75%, ${lightness}%)`);
        }
      }
    }

    return palette;
  }
}
