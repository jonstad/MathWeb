export function createProblemItemElement(problem, answerClassName) {
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
