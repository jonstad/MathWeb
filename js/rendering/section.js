import { generatorMap } from "../generators/index.js";
import { createProblemItemElement } from "./problem.js";

const DOUBLE_COLUMN_SECTION_IDS = new Set(["A", "B", "C"]);

function getProblemCount(sectionKey) {
  if (sectionKey === "addSub" || sectionKey === "mulDiv" || sectionKey === "fractionPercent") {
    return 10;
  }

  return 5;
}

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
  const problemCount = getProblemCount(sectionKey);

  for (let i = 0; i < problemCount; i += 1) {
    const item = uniqueProblem(() => generator(age, selectedDifficulty, i), uniqueSet);
    items.push(item);
  }

  return items;
}

export function createSectionElement(sectionDef, problems, answerClassName) {
  const sectionEl = document.createElement("section");
  sectionEl.className = "section";

  const heading = document.createElement("h4");
  heading.textContent = `${sectionDef.id}. ${sectionDef.title} (${problems.length} oppgaver)`;
  sectionEl.appendChild(heading);

  if (DOUBLE_COLUMN_SECTION_IDS.has(sectionDef.id) && problems.length >= 10) {
    const columns = document.createElement("div");
    columns.className = "problem-columns";

    const leftList = document.createElement("ol");
    leftList.className = "problem-list";
    problems.slice(0, 5).forEach((problem) => {
      leftList.appendChild(createProblemItemElement(problem, answerClassName));
    });

    const rightList = document.createElement("ol");
    rightList.className = "problem-list";
    rightList.start = 6;
    problems.slice(5, 10).forEach((problem) => {
      rightList.appendChild(createProblemItemElement(problem, answerClassName));
    });

    columns.appendChild(leftList);
    columns.appendChild(rightList);
    sectionEl.appendChild(columns);
    return sectionEl;
  }

  const list = document.createElement("ol");
  list.className = "problem-list";

  problems.forEach((problem) => {
    list.appendChild(createProblemItemElement(problem, answerClassName));
  });

  sectionEl.appendChild(list);
  return sectionEl;
}
