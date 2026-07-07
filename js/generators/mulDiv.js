import { Difficulty } from "../config/difficulties.js";
import { getAgeProfile } from "../profiles/ages.js";
import { randomInt } from "../utils/random.js";
import { normalizeDifficulty, difficultyFactor } from "../utils/math.js";

export function generateMulDivProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const factor = difficultyFactor(difficulty) + indexInSection * 0.1;
  const maxValue = Math.max(4, Math.round(profile.mulMax * factor));
  const useMultiplication = indexInSection < 2 || Math.random() > 0.45;

  let a;
  let b;
  let prompt;
  let answer;

  if (useMultiplication) {
    a = randomInt(2, maxValue);
    b = randomInt(2, maxValue);
    prompt = `Regn ut: $${a} \\times ${b}$`;
    answer = `${a * b}`;
  } else {
    b = randomInt(2, maxValue);
    answer = randomInt(2, maxValue);
    a = b * Number(answer);
    prompt = `Regn ut: $${a} \\div ${b}$`;
  }

  return {
    key: `muldiv-${a}-${b}-${useMultiplication}`,
    prompt,
    answer,
    hard: difficulty === Difficulty.VANSKELIG
  };
}
