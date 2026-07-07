import { Difficulty } from "../config/difficulties.js";
import { getAgeProfile } from "../profiles/ages.js";
import { randomInt } from "../utils/random.js";
import { normalizeDifficulty, difficultyFactor } from "../utils/math.js";

export function generateAddSubProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const factor = difficultyFactor(difficulty) + indexInSection * 0.14;
  const maxValue = Math.round(profile.addMax * factor);
  const useAddition = indexInSection < 2 || Math.random() > 0.45;

  let a = randomInt(5, maxValue);
  let b = randomInt(3, maxValue);

  if (!useAddition && b > a) {
    [a, b] = [b, a];
  }

  const symbol = useAddition ? "+" : "-";
  const answer = useAddition ? a + b : a - b;
  const prompt = `Regn ut: $${a} ${symbol} ${b}$`;

  return {
    key: `addsub-${a}-${symbol}-${b}`,
    prompt,
    answer: `${answer}`,
    hard: difficulty === Difficulty.VANSKELIG
  };
}
