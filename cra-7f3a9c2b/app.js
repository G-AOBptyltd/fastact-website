const dimensions = [
  ["Market Demand", 86, "Will the world need what you do?"],
  ["AI Resilience", 68, "How exposed are your tasks to automation?"],
  ["Human Advantage", 84, "What do humans still do better?"],
  ["Adaptability", 78, "Can you learn, pivot, and reinvent?"],
  ["AI Fluency", 61, "Can you work with AI, not against it?"],
  ["Reputation Capital", 74, "What are you known for and who knows it?"],
  ["Personal Alignment", 88, "Does your work fit what you value?"],
  ["Future Positioning", 77, "Are you moving toward the future?"],
];

const missions = [
  ["AI Task Audit", "Risk", "Map five tasks in your role and mark which should be automated, augmented, or protected."],
  ["Prompt Challenge", "AI Fluency", "Use AI to improve a real work output, then record what changed and what still needed judgement."],
  ["LinkedIn Positioning", "Reputation", "Rewrite your headline and about section around future value, not past responsibilities."],
  ["Coach Prep", "Handoff", "Write three questions for your roadmap review and identify one decision you need help making."],
];

const dimensionList = document.querySelector("#dimensionList");
const sliderStack = document.querySelector("#sliderStack");
const missionGrid = document.querySelector("#missionGrid");
const liveScore = document.querySelector("#liveScore");
const scoreLabel = document.querySelector("#scoreLabel");
const scoreAdvice = document.querySelector("#scoreAdvice");

function renderDimensions() {
  dimensionList.innerHTML = dimensions
    .map(([name, score, question]) => `
      <article class="dimension">
        <span>${score}</span>
        <strong>${name}</strong>
        <small>${question}</small>
      </article>
    `)
    .join("");
}

function renderSliders() {
  sliderStack.innerHTML = dimensions
    .map(([name, score], index) => `
      <div class="slider-row">
        <label for="dimension-${index}">${name}</label>
        <input id="dimension-${index}" type="range" min="20" max="100" value="${score}" data-index="${index}" />
        <strong>${score}</strong>
      </div>
    `)
    .join("");
}

function renderMissions() {
  missionGrid.innerHTML = missions
    .map(([title, badge, body]) => `
      <article class="mission-card">
        <span class="badge">${badge}</span>
        <h3>${title}</h3>
        <p>${body}</p>
        <button type="button">Start mission</button>
      </article>
    `)
    .join("");
}

function updateScore() {
  const scores = [...document.querySelectorAll(".slider-row input")].map((input) => Number(input.value));
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const lowScore = scores.some((score) => score < 60);

  liveScore.textContent = average;
  scoreLabel.textContent = average >= 80 ? "Future ready" : average >= 68 ? "On track" : "Needs attention";
  scoreAdvice.textContent = lowScore
    ? "A coach review is recommended because one or more dimensions are below the safe threshold."
    : "Use self-serve missions to keep momentum, then validate the roadmap with a coach.";
}

function setView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
}

document.addEventListener("click", (event) => {
  const viewTarget = event.target.closest("[data-view], [data-view-link]");
  if (!viewTarget) return;
  setView(viewTarget.dataset.view || viewTarget.dataset.viewLink);
});

renderDimensions();
renderSliders();
renderMissions();
updateScore();

sliderStack.addEventListener("input", (event) => {
  if (!event.target.matches("input")) return;
  const valueLabel = event.target.nextElementSibling;
  valueLabel.textContent = event.target.value;
  updateScore();
});
