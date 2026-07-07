import { generateAddSubProblem } from "./addSub.js";
import { generateMulDivProblem } from "./mulDiv.js";
import { generateFractionPercentProblem } from "./fractionPercent.js";
import { generateGeometryProblem } from "./geometry.js";
import { generateTrigonometryProblem } from "./trigonometry.js";
import { generateWordProblem } from "./word.js";

export const addSub = generateAddSubProblem;
export const mulDiv = generateMulDivProblem;
export const fractionPercent = generateFractionPercentProblem;
export const geometry = generateGeometryProblem;
export const trigonometry = generateTrigonometryProblem;
export const word = generateWordProblem;

export const generatorMap = {
  addSub,
  mulDiv,
  fractionPercent,
  geometry,
  trigonometry,
  word
};
