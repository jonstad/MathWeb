const ageSelect = document.getElementById("ageSelect");
const sheetCountInput = document.getElementById("sheetCountInput");
const difficultySelect = document.getElementById("difficultySelect");
const showFiguresCheckbox = document.getElementById("showFiguresCheckbox");
const generateBtn = document.getElementById("generateBtn");
const toggleAnswersBtn = document.getElementById("toggleAnswersBtn");
const printBtn = document.getElementById("printBtn");
const sheetsContainer = document.getElementById("sheetsContainer");

const SECTION_DEFS = [
  { id: "A", title: "Tekstoppgaver", key: "word" },
  { id: "B", title: "Addisjon og subtraksjon", key: "addSub" },
  { id: "C", title: "Multiplikasjon og divisjon", key: "mulDiv" },
  { id: "D", title: "Brøk og prosent", key: "fractionPercent" },
  { id: "E", title: "Geometri", key: "geometry" },
  { id: "F", title: "Trigonometri", key: "trigonometry" }
];

const Difficulty = {
  LETT: "lett",
  MIDDELS: "middels",
  VANSKELIG: "vanskelig",
  BLANDET: "blandet"
};

let answersVisible = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne(values) {
  return values[randomInt(0, values.length - 1)];
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x || 1;
}

function toFixedClean(value, decimals = 2) {
  return Number(value.toFixed(decimals)).toString();
}

function normalizeDifficulty(selectedDifficulty, indexInSection) {
  if (selectedDifficulty !== Difficulty.BLANDET) {
    return selectedDifficulty;
  }

  const sequence = [
    Difficulty.LETT,
    Difficulty.LETT,
    Difficulty.MIDDELS,
    Difficulty.VANSKELIG,
    Difficulty.VANSKELIG
  ];

  return sequence[indexInSection] || Difficulty.MIDDELS;
}

function getAgeProfile(age) {
  if (age === 10) {
    return {
      addMax: 100,
      mulMax: 12,
      percentBase: 100,
      geometryBase: 12,
      trigHypotenuse: 15
    };
  }

  return {
    addMax: 300,
    mulMax: 20,
    percentBase: 250,
    geometryBase: 20,
    trigHypotenuse: 25
  };
}

function difficultyFactor(difficulty) {
  switch (difficulty) {
    case Difficulty.LETT:
      return 1;
    case Difficulty.MIDDELS:
      return 1.35;
    case Difficulty.VANSKELIG:
      return 1.8;
    default:
      return 1;
  }
}

function makeRectangleSvg(width, height, label) {
  const rectX = 24;
  const rectY = 24;
  const rightMargin = 88;
  const bottomMargin = 24;

  const svgWidth = Math.max(240, rectX + width + rightMargin);
  const svgHeight = Math.max(110, rectY + height + bottomMargin);

  const widthLabelX = rectX + width / 2;
  const widthLabelY = rectY - 8;
  const heightLabelX = rectX + width + 10;
  const heightLabelY = rectY + height / 2 + 4;

  return `
    <svg width="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMinYMin meet" aria-label="${label}" role="img">
      <rect x="${rectX}" y="${rectY}" width="${width}" height="${height}" fill="#d3eef9" stroke="#176b8a" stroke-width="2"></rect>
      <text x="${widthLabelX}" y="${widthLabelY}" text-anchor="middle" fill="#11465d" font-size="12">b = ${width / 8}</text>
      <text x="${heightLabelX}" y="${heightLabelY}" fill="#11465d" font-size="12">h = ${height / 8}</text>
    </svg>
  `;
}

function makeTriangleSvg(a, b, c, angleLabel = "", anglePosition = "left", showAngleArc = false) {
  let angleLabelX = 64;
  let angleLabelY = 112;

  if (anglePosition === "top") {
    angleLabelX = 166;
    angleLabelY = 44;
  } else if (anglePosition === "right") {
    angleLabelX = 188;
    angleLabelY = 100;
  }

  const angleText = angleLabel
    ? `<text x="${angleLabelX}" y="${angleLabelY}" fill="#145f3d" font-size="12">${angleLabel}</text>`
    : "";

  let angleArc = "";
  if (showAngleArc) {
    if (anglePosition === "left") {
      angleArc = `<path d="M52 120 A22 22 0 0 0 48 106" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    } else if (anglePosition === "top") {
      angleArc = `<path d="M180 54 A24 24 0 0 0 164 42" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    } else if (anglePosition === "right") {
      angleArc = `<path d="M180 98 A20 20 0 0 1 167 112" fill="none" stroke="#145f3d" stroke-width="2"></path>`;
    }
  }

  return `
    <svg width="250" height="150" viewBox="0 0 250 150" aria-label="Rettvinklet trekant" role="img">
      <polygon points="30,120 180,120 180,30" fill="#e4f6ec" stroke="#1d7b4f" stroke-width="2"></polygon>
      <path d="M170 120 L170 110 L180 110" fill="none" stroke="#1d7b4f" stroke-width="2"></path>
      <text x="100" y="136" fill="#145f3d" font-size="12">${a}</text>
      <text x="190" y="82" fill="#145f3d" font-size="12">${b}</text>
      <text x="104" y="50" fill="#145f3d" font-size="12">${c}</text>
      <text x="186" y="116" fill="#145f3d" font-size="12">90°</text>
      ${angleArc}
      ${angleText}
    </svg>
  `;
}

function uniqueProblem(problemFactory, uniqueSet) {
  for (let tryCount = 0; tryCount < 30; tryCount += 1) {
    const candidate = problemFactory();
    if (!uniqueSet.has(candidate.key)) {
      uniqueSet.add(candidate.key);
      return candidate;
    }
  }

  return problemFactory();
}

function generateAddSubProblem(age, selectedDifficulty, indexInSection) {
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

function generateMulDivProblem(age, selectedDifficulty, indexInSection) {
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

function generateFractionPercentProblem(age, selectedDifficulty, indexInSection) {
  const profile = getAgeProfile(age);
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const factor = difficultyFactor(difficulty);
  const caseIndex = indexInSection;

  if (caseIndex === 0) {
    const d = randomInt(6, Math.round(20 * factor));
    const n = randomInt(2, d - 1);
    const div = gcd(n, d);
    return {
      key: `frac-simplify-${n}-${d}`,
      prompt: `Forkort brøken: $\\frac{${n}}{${d}}$`,
      answer: `$\\frac{${n / div}}{${d / div}}$`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 1) {
    const d = randomInt(6, age === 10 ? 12 : 20);
    const n1 = randomInt(1, d - 1);
    const n2 = randomInt(1, d - 1);
    return {
      key: `frac-add-${n1}-${n2}-${d}`,
      prompt: `Regn ut: $\\frac{${n1}}{${d}} + \\frac{${n2}}{${d}}$`,
      answer: `$\\frac{${n1 + n2}}{${d}}$`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 2) {
    const percent = pickOne([10, 15, 20, 25, 30, 40, 50]);
    const base = randomInt(20, Math.round(profile.percentBase * factor));
    const result = (percent / 100) * base;
    return {
      key: `percent-of-${percent}-${base}`,
      prompt: `Finn $${percent}\\%$ av $${base}$.`,
      answer: `${toFixedClean(result)}`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (caseIndex === 3) {
    const b = randomInt(20, Math.round(profile.percentBase * factor));
    const p = pickOne([10, 20, 25, 40, 50]);
    const a = Math.round((p / 100) * b);
    return {
      key: `which-percent-${a}-${b}`,
      prompt: `Hvor mange prosent er $${a}$ av $${b}$?`,
      answer: `${toFixedClean((a / b) * 100)}%`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  const start = randomInt(40, Math.round(profile.percentBase * factor));
  const change = pickOne([5, 10, 15, 20]);
  const increase = Math.random() > 0.5;
  const end = increase ? start * (1 + change / 100) : start * (1 - change / 100);
  return {
    key: `percent-change-${start}-${change}-${increase}`,
    prompt: `Start med $${start}$ ${increase ? "Øk" : "Reduser"} med $${change}\\%$: . Hva blir tallet?`,
    answer: `${toFixedClean(end)}`,
    hard: difficulty === Difficulty.VANSKELIG
  };
}

function generateGeometryProblem(age, selectedDifficulty, indexInSection) {
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

  const angleA = randomInt(20, 80);
  const angleB = randomInt(20, 80);
  const angleC = 180 - angleA - angleB;
  return {
    key: `geo-angles-${angleA}-${angleB}`,
    prompt: `I en trekant er to vinkler $${angleA}^\\circ$ og $${angleB}^\\circ$. Finn den siste vinkelen.`,
    answer: `${angleC}°`,
    hard: difficulty === Difficulty.VANSKELIG
  };
}

function generateTrigonometryProblem(age, selectedDifficulty, indexInSection) {
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


function generateWordProblem(age, selectedDifficulty, indexInSection) {
  const difficulty = normalizeDifficulty(selectedDifficulty, indexInSection);
  const profile = getAgeProfile(age);
  const factor = difficultyFactor(difficulty);

  if (indexInSection === 0) {
    const perBox = randomInt(6, Math.round(15 * factor));
    const boxes = randomInt(3, Math.round(10 * factor));
    return {
      key: `word-fruit-${perBox}-${boxes}`,
      prompt: `Ali har ${boxes} esker med ${perBox} epler i hver eske. Hvor mange epler har Ali totalt?`,
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
    return {
      key: `word-time-${distance}-${speed}`,
      prompt: `Sofie sykler ${distance} km med fart ${speed} km/t. Hvor lang tid bruker hun i timer?`,
      answer: `${toFixedClean(time, 2)} timer`,
      hard: difficulty === Difficulty.VANSKELIG
    };
  }

  if (indexInSection === 3) {
    const price = randomInt(30, 120);
    const count = randomInt(3, 10);
    const discount = pickOne([10, 15, 20]);
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

function generateSectionProblems(sectionKey, age, selectedDifficulty, uniqueSet) {
  const generatorMap = {
    addSub: generateAddSubProblem,
    mulDiv: generateMulDivProblem,
    fractionPercent: generateFractionPercentProblem,
    geometry: generateGeometryProblem,
    trigonometry: generateTrigonometryProblem,
    word: generateWordProblem
  };

  const generator = generatorMap[sectionKey];
  const items = [];

  for (let i = 0; i < 5; i += 1) {
    const item = uniqueProblem(() => generator(age, selectedDifficulty, i), uniqueSet);
    items.push(item);
  }

  return items;
}

function createProblemItemElement(problem, answerClassName) {
  const li = document.createElement("li");
  li.className = `problem-item${problem.hard ? " is-hard" : ""}`;

  const promptEl = document.createElement("span");
  promptEl.className = "problem-text";
  promptEl.innerHTML = problem.prompt;
  li.appendChild(promptEl);

  if (problem.figure) {
    const figureWrap = document.createElement("div");
    figureWrap.className = "figure";
    figureWrap.innerHTML = problem.figure;
    li.appendChild(figureWrap);
  }

  const answerEl = document.createElement("div");
  answerEl.className = `answer ${answerClassName}`;
  answerEl.innerHTML = `Fasit: ${problem.answer}`;
  li.appendChild(answerEl);

  return li;
}

function createSectionElement(sectionDef, problems, answerClassName) {
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

function buildWorksheetElement(sheetNumber, age, selectedDifficulty) {
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

function renderWorksheets() {
  const age = Number(ageSelect.value);
  const selectedDifficulty = difficultySelect.value;
  const sheetCount = Math.max(1, Math.min(8, Number(sheetCountInput.value) || 1));
  sheetCountInput.value = String(sheetCount);

  sheetsContainer.innerHTML = "";

  for (let i = 1; i <= sheetCount; i += 1) {
    const worksheet = buildWorksheetElement(i, age, selectedDifficulty);
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
