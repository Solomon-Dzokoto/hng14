export const lengthUnits: Record<string, number> = {
  Meters: 1,
  Kilometers: 1000,
  Centimeters: 0.01,
  Millimeters: 0.001,
  Miles: 1609.34,
  Yards: 0.9144,
  Feet: 0.3048,
  Inches: 0.0254,
};

export const weightUnits: Record<string, number> = {
  Grams: 1,
  Kilograms: 1000,
  Milligrams: 0.001,
  Pounds: 453.592,
  Ounces: 28.3495,
};

export const tempUnits = ['Celsius', 'Fahrenheit', 'Kelvin'] as const;

export const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) return value;
  let celsius = value;
  if (from === 'Fahrenheit') celsius = (value - 32) * (5 / 9);
  if (from === 'Kelvin') celsius = value - 273.15;
  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * (9 / 5) + 32;
  if (to === 'Kelvin') return celsius + 273.15;
  return value;
};

export const convertStandard = (value: number, fromFactor: number, toFactor: number): number => {
  return (value * fromFactor) / toFactor;
};
