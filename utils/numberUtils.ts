export const scale = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const getRandomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
