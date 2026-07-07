import { Difficulty } from "../config/difficulties.js";

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x || 1;
}

export function difficultyFactor(difficulty) {
  switch (difficulty) {
    case Difficulty.LETT:
      return 1;
    case Difficulty.MIDDELS:
      return 1.35;
    case Difficulty.VANSKELIG:
      return 1.8;
    default:
      return 1;
  }
}

export function normalizeDifficulty(selectedDifficulty, indexInSection) {
  if (selectedDifficulty !== Difficulty.BLANDET) {
    return selectedDifficulty;
  }

  const sequence = [
    Difficulty.LETT,
    Difficulty.LETT,
    Difficulty.MIDDELS,
    Difficulty.VANSKELIG,
    Difficulty.VANSKELIG
  ];

  return sequence[indexInSection] || Difficulty.MIDDELS;
}
