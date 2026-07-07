import { SECTION_DEFS } from "../config/sections.js";
import { createSectionElement, generateSectionProblems } from "./section.js";

export function buildWorksheetElement(sheetNumber, age, selectedDifficulty, answersVisible) {
  const uniqueSet = new Set();
  const answerClassName = answersVisible ? "" : "hidden";

  const sheetEl = document.createElement("article");
  sheetEl.className = "worksheet";

  const header = document.createElement("div");
  header.className = "worksheet-header";
  header.innerHTML = `
    <h3>Matteark ${sheetNumber}</h3>
    <p class="worksheet-meta">Alder: ${age} år | Vanskelighetsgrad: ${selectedDifficulty}</p>
  `;
  sheetEl.appendChild(header);

  SECTION_DEFS.forEach((sectionDef) => {
    const problems = generateSectionProblems(sectionDef.key, age, selectedDifficulty, uniqueSet);
    sheetEl.appendChild(createSectionElement(sectionDef, problems, answerClassName));
  });

  const legend = document.createElement("p");
  legend.className = "legend";
  legend.textContent = "Oppgaver med lys bakgrunn er mer krevende og passer ekstra øving.";
  sheetEl.appendChild(legend);

  return sheetEl;
}
