export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickOne(values) {
  return values[randomInt(0, values.length - 1)];
}
