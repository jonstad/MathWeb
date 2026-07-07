import { Difficulty } from "../config/difficulties.js";
import { getAgeProfile } from "../profiles/ages.js";
import { pickOne, randomInt } from "../utils/random.js";
import { difficultyFactor, gcd, normalizeDifficulty } from "../utils/math.js";
import { toFixedClean } from "../utils/formatting.js";

export function generateFractionPercentProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const factor = difficultyFactor(difficulty);
  const caseIndex = indexInSection;

  if (caseIndex === 0) {
    const d = randomInt(6, Math.round(20 * factor));
    const n = randomInt(2, d - 1);
    const div = gcd(n, d);
    return {
      key: `frac-simplify-${n}-${d}`,
      prompt: `Forkort brøken: $\\frac{${n}}{${d}}$`,
      answer: `$\\frac{${n / div}}{${d / div}}$`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 1) {
    const d = randomInt(6, age === 10 ? 12 : 20);
    const n1 = randomInt(1, d - 1);
    const n2 = randomInt(1, d - 1);
    return {
      key: `frac-add-${n1}-${n2}-${d}`,
      prompt: `Regn ut: $\\frac{${n1}}{${d}} + \\frac{${n2}}{${d}}$`,
      answer: `$\\frac{${n1 + n2}}{${d}}$`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 2) {
    const percent = pickOne([10, 15, 20, 25, 30, 40, 50]);
    const base = randomInt(20, Math.round(profile.percentBase * factor));
    const result = (percent / 100) * base;
    return {
      key: `percent-of-${percent}-${base}`,
      prompt: `Finn $${percent}\\%$ av $${base}$.`,
      answer: `${toFixedClean(result)}`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 3) {
    const b = randomInt(20, Math.round(profile.percentBase * factor));
    const p = pickOne([10, 20, 25, 40, 50]);
    const a = Math.round((p / 100) * b);
    return {
      key: `which-percent-${a}-${b}`,
      prompt: `Hvor mange prosent er $${a}$ av $${b}$?`,
      answer: `${toFixedClean((a / b) * 100)}%`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  const start = randomInt(40, Math.round(profile.percentBase * factor));
  const change = pickOne([5, 10, 15, 20]);
  const increase = Math.random() > 0.5;
  const end = increase ? start * (1 + change / 100) : start * (1 - change / 100);
  return {
    key: `percent-change-${start}-${change}-${increase}`,
    prompt: `Start med $${start}$ ${increase ? "Øk" : "Reduser"} med $${change}\\%$: . Hva blir tallet?`,
    answer: `${toFixedClean(end)}`,
    hard: difficulty === Difficulty.VANSKELIG
  };
}
