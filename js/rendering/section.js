import { generatorMap } from "../generators/index.js";
import { createProblemItemElement } from "./problem.js";

export function uniqueProblem(problemFactory, uniqueSet) {
  for (let tryCount = 0; tryCount < 30; tryCount += 1) {
    const candidate = problemFactory();
    if (!uniqueSet.has(candidate.key)) {
      uniqueSet.add(candidate.key);
      return candidate;
    }
  }

  return problemFactory();
}

export function generateSectionProblems(sectionKey, age, selectedDifficulty, uniqueSet) {
  const generator = generatorMap[sectionKey];
  const items = [];

  for (let i = 0; i < 5; i += 1) {
    const item = uniqueProblem(() => generator(age, selectedDifficulty, i), uniqueSet);
    items.push(item);
  }

  return items;
}

export function createSectionElement(sectionDef, problems, answerClassName) {
  const sectionEl = document.createElement("section");
  sectionEl.className = "section";

  const heading = document.createElement("h4");
  heading.textContent = `${sectionDef.id}. ${sectionDef.title} (5 oppgaver)`;
  sectionEl.appendChild(heading);

  const list = document.createElement("ol");
  list.className = "problem-list";

  problems.forEach((problem) => {
    list.appendChild(createProblemItemElement(problem, answerClassName));
  });

  sectionEl.appendChild(list);
  return sectionEl;
}
