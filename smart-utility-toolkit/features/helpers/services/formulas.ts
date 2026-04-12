export const splitBill = (total: number, people: number): number =>
  people <= 0 ? 0 : total / people;

export const calculateTip = (bill: number, pct: number) => {
  const tip = bill * (pct / 100);
  return { tip, total: bill + tip };
};

export const fuelCost = (distance: number, efficiency: number, pricePerUnit: number): number =>
  efficiency <= 0 ? 0 : (distance / efficiency) * pricePerUnit;

export const percentage = (value: number, pct: number): number =>
  (value * pct) / 100;

export const percentageDiff = (oldVal: number, newVal: number): number =>
  oldVal === 0 ? 0 : ((newVal - oldVal) / Math.abs(oldVal)) * 100;
