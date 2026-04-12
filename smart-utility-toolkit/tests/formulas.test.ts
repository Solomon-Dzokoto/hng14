import { splitBill, calculateTip, fuelCost, percentage, percentageDiff } from '@/features/helpers/services/formulas';
import { convertStandard, convertTemperature, lengthUnits } from '@/features/converter/services/conversions';

describe('Helper Formulas', () => {
  it('splits bill evenly', () => {
    expect(splitBill(100, 4)).toBe(25);
    expect(splitBill(100, 0)).toBe(0);
  });

  it('calculates tip', () => {
    const { tip, total } = calculateTip(50, 20);
    expect(tip).toBe(10);
    expect(total).toBe(60);
  });

  it('estimates fuel cost', () => {
    expect(fuelCost(100, 10, 1.5)).toBe(15);
    expect(fuelCost(100, 0, 1.5)).toBe(0);
  });

  it('calculates percentage', () => {
    expect(percentage(200, 15)).toBe(30);
  });

  it('calculates percentage difference', () => {
    expect(percentageDiff(50, 75)).toBe(50);
    expect(percentageDiff(0, 10)).toBe(0);
  });
});

describe('Converter Formulas', () => {
  it('converts km to m', () => {
    expect(convertStandard(1, lengthUnits.Kilometers, lengthUnits.Meters)).toBe(1000);
  });

  it('converts temperature C->F', () => {
    expect(convertTemperature(100, 'Celsius', 'Fahrenheit')).toBe(212);
  });

  it('converts temperature F->C', () => {
    expect(convertTemperature(32, 'Fahrenheit', 'Celsius')).toBe(0);
  });
});
