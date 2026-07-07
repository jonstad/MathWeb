import { Difficulty } from "../config/difficulties.js";
import { getAgeProfile } from "../profiles/ages.js";
import { randomInt, pickOne } from "../utils/random.js";
import { difficultyFactor, normalizeDifficulty } from "../utils/math.js";
import { toFixedClean } from "../utils/formatting.js";
import { makeTriangleSvg } from "../figures/triangle.js";

export function generateTrigonometryProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const maxHypotenuse = Math.round(profile.trigHypotenuse * difficultyFactor(difficulty));

  if (indexInSection === 0) {
    const opp = randomInt(3, maxHypotenuse - 1);
    const hyp = randomInt(opp + 1, maxHypotenuse + 2);
    return {
      key: `trig-sin-${opp}-${hyp}`,
      prompt: `Finn $\\sin(v)$ når motstående side er $${opp}$ og hypotenusen er $${hyp}$.`,
      answer: `${toFixedClean(opp / hyp, 3)}`,
      figure: makeTriangleSvg(`m=${opp}`, "n", `h=${hyp}`, "v", "left", true),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 1) {
    const adj = randomInt(3, maxHypotenuse - 1);
    const hyp = randomInt(adj + 1, maxHypotenuse + 3);
    return {
      key: `trig-cos-${adj}-${hyp}`,
      prompt: `Finn $\\cos(v)$ når hosliggende side er $${adj}$ og hypotenusen er $${hyp}$.`,
      answer: `${toFixedClean(adj / hyp, 3)}`,
      figure: makeTriangleSvg(`h=${adj}`, "n", `hyp=${hyp}`, "v", "left", true),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 2) {
    const opp = randomInt(3, 12);
    const adj = randomInt(3, 12);
    return {
      key: `trig-tan-${opp}-${adj}`,
      prompt: `Finn $\\tan(v)$ når motstående side er $${opp}$ og hosliggende side er $${adj}$.`,
      answer: `${toFixedClean(opp / adj, 3)}`,
      figure: makeTriangleSvg(`m=${opp}`, `h=${adj}`, "hyp", "v", "left", true),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 3) {
    const angle = pickOne([20, 25, 30, 35, 40, 45, 50, 55, 60]);
    const hyp = randomInt(8, maxHypotenuse + 5);
    const opposite = Math.sin((angle * Math.PI) / 180) * hyp;
    return {
      key: `trig-side-${angle}-${hyp}`,
      prompt: `I en rettvinklet trekant er $v=${angle}^\\circ$ og hypotenusen $${hyp}$. Finn motstående side.`,
      answer: `${toFixedClean(opposite, 2)}`,
      figure: makeTriangleSvg("m=?", "h", `hyp=${hyp}`, `v=${angle}°`, "left"),
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  const opposite = randomInt(3, 12);
  const hyp = randomInt(opposite + 2, 18);
  const angle = (Math.asin(opposite / hyp) * 180) / Math.PI;
  return {
    key: `trig-angle-${opposite}-${hyp}`,
    prompt: `Finn vinkelen $v$ når motstående side er $${opposite}$ og hypotenusen er $${hyp}$.`,
    answer: `${toFixedClean(angle, 1)}°`,
    figure: makeTriangleSvg(`m=${opposite}`, "h", `hyp=${hyp}`, "v=?", "left", true),
    hard: difficulty === Difficulty.VANSKELIG
  };
}
