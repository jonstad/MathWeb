import { Difficulty } from "../config/difficulties.js";
import { getAgeProfile } from "../profiles/ages.js";
import { randomInt } from "../utils/random.js";
import { difficultyFactor, normalizeDifficulty } from "../utils/math.js";
import { toFixedClean } from "../utils/formatting.js";
import { makeRectangleSvg } from "../figures/rectangle.js";
import { makeTriangleSvg } from "../figures/triangle.js";
import { makeCircleSvg } from "../figures/circle.js";

export function generateGeometryProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const factor = difficultyFactor(difficulty) + indexInSection * 0.12;
  const base = Math.max(3, Math.round(profile.geometryBase * factor));

  if (indexInSection === 0) {
    const b = randomInt(4, base);
    const h = randomInt(3, base);
    return {
      key: `geo-area-${b}-${h}`,
      prompt: `Finn arealet av rektangelet med bredde $${b}$ og høyde $${h}$.`,
      answer: `${b * h}`,
      figure: makeRectangleSvg(b * 8, h * 8, "Rektangel"),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 1) {
    const b = randomInt(4, base + 2);
    const h = randomInt(4, base + 2);
    return {
      key: `geo-perimeter-${b}-${h}`,
      prompt: `Finn omkretsen av et rektangel med sider $${b}$ og $${h}$.`,
      answer: `${2 * (b + h)}`,
      figure: makeRectangleSvg(b * 8, h * 8, "Rektangel med sidekanter"),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 2) {
    const l = randomInt(3, base);
    const w = randomInt(3, base);
    const h = randomInt(3, base);
    return {
      key: `geo-volume-${l}-${w}-${h}`,
      prompt: `Et rett prisme har lengde $${l}$, bredde $${w}$ og høyde $${h}$. Finn volumet.`,
      answer: `${l * w * h}`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 3) {
    const a = randomInt(3, base);
    const b = randomInt(4, base + 2);
    const c = toFixedClean(Math.sqrt(a * a + b * b));
    return {
      key: `geo-pyth-${a}-${b}`,
      prompt: `Bruk Pytagoras: $a=${a}$ og $b=${b}$. Finn hypotenusen $c$.`,
      answer: `${c}`,
      figure: makeTriangleSvg(`a=${a}`, `b=${b}`, "c=?"),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  const radius = randomInt(3, base);
  const area = toFixedClean(3.14 * radius * radius);
  const circumference = toFixedClean(2 * 3.14 * radius);
  return {
    key: `geo-circle-${radius}`,
    prompt: `En sirkel har radius $${radius}$. Finn areal og omkrets (bruk $\\pi \\approx 3{,}14$).`,
    answer: `A = ${area}, O = ${circumference}`,
    figure: makeCircleSvg(radius * 8, "Sirkel"),
    hard: difficulty === Difficulty.VANSKELIG
  };
}
