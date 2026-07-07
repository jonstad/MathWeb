import { Difficulty } from "../config/difficulties.js";
import { APPROVED_NAMES } from "../config/names.js";
import { getAgeProfile } from "../profiles/ages.js";
import { randomInt, pickOne } from "../utils/random.js";
import { difficultyFactor, normalizeDifficulty } from "../utils/math.js";
import { toFixedClean } from "../utils/formatting.js";

export function generateWordProblem(age, selectedDifficulty, indexInSection) {
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const profile = getAgeProfile(age);
  const factor = difficultyFactor(difficulty);

  if (indexInSection === 0) {
    const perBox = randomInt(6, Math.round(15 * factor));
    const boxes = randomInt(3, Math.round(10 * factor));
    const name = pickOne(APPROVED_NAMES);
    return {
      key: `word-fruit-${perBox}-${boxes}`,
      prompt: `${name} har ${boxes} esker med ${perBox} epler i hver eske. Hvor mange epler har ${name} totalt?`,
      answer: `${perBox * boxes}`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 1) {
    const start = randomInt(80, Math.round(profile.addMax * factor));
    const sold = randomInt(10, Math.floor(start / 2));
    return {
      key: `word-shop-${start}-${sold}`,
      prompt: `En butikk har ${start} blyanter. De selger ${sold}. Hvor mange er igjen?`,
      answer: `${start - sold}`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 2) {
    const distance = randomInt(2, 8) * 5;
    const speed = randomInt(3, 8) * 5;
    const time = distance / speed;
    const name = pickOne(APPROVED_NAMES);
    return {
      key: `word-time-${distance}-${speed}`,
      prompt: `${name} sykler ${distance} km med fart ${speed} km/t. Hvor lang tid bruker ${name} i timer?`,
      answer: `${toFixedClean(time, 2)} timer`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 3) {
    const price = randomInt(30, 120);
    const count = randomInt(3, 10);
    const discount = pickOne([10, 15, 20,30, 40, 50]);
    const total = price * count;
    const finalAmount = total * (1 - discount / 100);
    return {
      key: `word-discount-${price}-${count}-${discount}`,
      prompt: `En klasse kjøper ${count} billetter til ${price} kr per stykk. De får ${discount}% rabatt. Hva blir totalprisen?`,
      answer: `${toFixedClean(finalAmount, 2)} kr`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }
  

  const liters = randomInt(30, 120);
  const share = pickOne([1 / 2, 1 / 3, 1 / 4]);
  const used = liters * share;
  return {
    key: `word-fuel-${liters}-${share}`,
    prompt: `En tank har ${liters} liter vann. En dag brukes ${toFixedClean(share * 100, 0)}% av vannet. Hvor mange liter brukes?`,
    answer: `${toFixedClean(used, 2)} liter`,
    hard: difficulty === Difficulty.VANSKELIG
  };
}
