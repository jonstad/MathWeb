import { buildWorksheetElement } from "./rendering/worksheet.js";

const ageSelect = document.getElementById("ageSelect");
const sheetCountInput = document.getElementById("sheetCountInput");
const difficultySelect = document.getElementById("difficultySelect");
const showFiguresCheckbox = document.getElementById("showFiguresCheckbox");
const generateBtn = document.getElementById("generateBtn");
const toggleAnswersBtn = document.getElementById("toggleAnswersBtn");
const printBtn = document.getElementById("printBtn");
const sheetsContainer = document.getElementById("sheetsContainer");

let answersVisible = false;

function renderWorksheets() {
  const age = Number(ageSelect.value);
  const selectedDifficulty = difficultySelect.value;
  const sheetCount = Math.max(1, Math.min(8, Number(sheetCountInput.value) || 1));
  sheetCountInput.value = String(sheetCount);

  sheetsContainer.innerHTML = "";

  for (let i = 1; i <= sheetCount; i += 1) {
    const worksheet = buildWorksheetElement(i, age, selectedDifficulty, answersVisible);
    sheetsContainer.appendChild(worksheet);
  }

  toggleAnswersBtn.disabled = false;
  printBtn.disabled = false;

  if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
    window.MathJax.typesetPromise();
  }
}

function updateAnswerVisibility() {
  const answerNodes = sheetsContainer.querySelectorAll(".answer");
  answerNodes.forEach((node) => {
    node.classList.toggle("hidden", !answersVisible);
  });
  toggleAnswersBtn.textContent = answersVisible ? "Skjul fasit" : "Vis fasit";
}

function updateFigureVisibility() {
  document.body.classList.toggle("hide-figures", !showFiguresCheckbox.checked);
}

generateBtn.addEventListener("click", () => {
  answersVisible = false;
  renderWorksheets();
  updateAnswerVisibility();
});

toggleAnswersBtn.addEventListener("click", () => {
  answersVisible = !answersVisible;
  updateAnswerVisibility();
});

printBtn.addEventListener("click", () => {
  window.print();
});

showFiguresCheckbox.addEventListener("change", updateFigureVisibility);
updateFigureVisibility();
