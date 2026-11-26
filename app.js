// Curated catalog data stored in memory (original fictional titles and SVG art)
const GAMES = [
  {
    id: 1,
    title: "Starlight Drifter",
    genre: "Action",
    difficulty: "Balanced",
    year: 2023,
    mainHours: 9,
    extraHours: 5,
    rating: "9.1/10",
    image: "images/game-1.svg",
    alt: "Orange pixel starship flying past a bright blue planet in space",
    description: "Fast-paced space dogfights paired with quiet outpost trading."
  },
  {
    id: 2,
    title: "Chrono Forge",
    genre: "RPG",
    difficulty: "Challenging",
    year: 2022,
    mainHours: 28,
    extraHours: 14,
    rating: "9.4/10",
    image: "images/game-2.svg",
    alt: "Glowing golden clock face emblem on a deep violet background",
    description: "Turn-based tactics where every party spell rewinds the turn order."
  },
  {
    id: 3,
    title: "Moss & Iron",
    genre: "Adventure",
    difficulty: "Relaxed",
    year: 2024,
    mainHours: 7,
    extraHours: 3,
    rating: "8.8/10",
    image: "images/game-3.svg",
    alt: "Small stone cottage nestled between emerald pine mountain peaks",
    description: "Explore overgrown ruins and rebuild a mossy mountain shrine."
  },
  {
    id: 4,
    title: "Neon Courier 88",
    genre: "Action",
    difficulty: "Challenging",
    year: 2021,
    mainHours: 6,
    extraHours: 4,
    rating: "8.9/10",
    image: "images/game-4.svg",
    alt: "Pink and cyan synthwave sports car speeding along a neon highway",
    description: "High-speed arcade deliveries set to a pulsing 80s synth soundtrack."
  },
  {
    id: 5,
    title: "Hollow Tides",
    genre: "Adventure",
    difficulty: "Balanced",
    year: 2023,
    mainHours: 14,
    extraHours: 6,
    rating: "9.0/10",
    image: "images/game-5.svg",
    alt: "Small wooden sailboat crossing layered midnight blue ocean waves",
    description: "Sail a shifting archipelago and chart forgotten sea lighthouses."
  },
  {
    id: 6,
    title: "Skyward Orchard",
    genre: "Simulation",
    difficulty: "Relaxed",
    year: 2024,
    mainHours: 18,
    extraHours: 12,
    rating: "8.7/10",
    image: "images/game-6.svg",
    alt: "Red-roofed farmhouse beside a fruit tree under a bright yellow sun",
    description: "Cozy floating-island farming sim with seasonal weather puzzles."
  },
  {
    id: 7,
    title: "Echoes of Ash",
    genre: "RPG",
    difficulty: "Challenging",
    year: 2020,
    mainHours: 32,
    extraHours: 18,
    rating: "9.3/10",
    image: "images/game-7.svg",
    alt: "Volcanic obsidian mountain glowing with warm amber embers",
    description: "Atmospheric dungeon crawler built around campfire resource choices."
  },
  {
    id: 8,
    title: "Circuit Breaker DX",
    genre: "Puzzle",
    difficulty: "Balanced",
    year: 2025,
    mainHours: 8,
    extraHours: 5,
    rating: "9.2/10",
    image: "images/game-8.svg",
    alt: "Glowing cyan and amber logic circuit board inside a dark console",
    description: "Clever logic-gate puzzle chambers with instant undo and zero timers."
  }
];

// In-memory array of saved game IDs (resets when page reloads)
let savedGameIds = [];

// Cached DOM elements
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const difficultyFilter = document.getElementById("difficultyFilter");
const resultCount = document.getElementById("resultCount");
const catalogGrid = document.getElementById("catalogGrid");

const backlogList = document.getElementById("backlogList");
const backlogSummary = document.getElementById("backlogSummary");
const clearBacklogBtn = document.getElementById("clearBacklogBtn");

const plannerGame = document.getElementById("plannerGame");
const mainHoursInput = document.getElementById("mainHoursInput");
const extraHoursInput = document.getElementById("extraHoursInput");
const completionMode = document.getElementById("completionMode");
const dailyHoursInput = document.getElementById("dailyHoursInput");
const plannerResult = document.getElementById("plannerResult");

const requestForm = document.getElementById("requestForm");
const releaseYearInput = document.getElementById("releaseYear");
const releaseYearLabel = document.getElementById("releaseYearLabel");
const formConfirmation = document.getElementById("formConfirmation");
const confirmationDetails = document.getElementById("confirmationDetails");
const submitAnotherBtn = document.getElementById("submitAnotherBtn");

// --- Feature 1: Live Search & Multi-Filter ---

function getFilteredGames() {
  const query = searchInput.value.trim().toLowerCase();
  const chosenGenre = genreFilter.value;
  const chosenDifficulty = difficultyFilter.value;

  return GAMES.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.genre.toLowerCase().includes(query);

    const matchesGenre =
      chosenGenre === "all" || game.genre === chosenGenre;

    const matchesDifficulty =
      chosenDifficulty === "all" || game.difficulty === chosenDifficulty;

    return matchesSearch && matchesGenre && matchesDifficulty;
  });
}

function renderCatalog() {
  const filteredGames = getFilteredGames();
  resultCount.textContent = `Showing ${filteredGames.length} of ${GAMES.length} titles`;

  if (filteredGames.length === 0) {
    catalogGrid.innerHTML = `
      <div class="empty-state">
        <p>No games matched your current search and filters. Try clearing a filter.</p>
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = filteredGames
    .map((game) => {
      const isSaved = savedGameIds.includes(game.id);
      return `
        <article class="game-card">
          <img src="${game.image}" alt="${game.alt}">
          <div class="card-body">
            <div class="card-meta">
              <span class="genre-badge">${game.genre}</span>
              <span>${game.difficulty} &bull; <time datetime="${game.year}">${game.year}</time> &bull; ${game.rating}</span>
            </div>
            <h3>${game.title}</h3>
            <p class="card-desc">${game.description}</p>
            <div class="card-footer">
              <span class="card-hours">${game.mainHours}h main</span>
              <button
                type="button"
                class="save-btn"
                data-game-id="${game.id}"
                aria-pressed="${isSaved}"
              >
                ${isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// --- Feature 2: In-Memory Backlog Queue ---

function syncBacklogViews() {
  renderCatalog();
  renderBacklog();
}

function toggleSavedGame(gameId) {
  if (savedGameIds.includes(gameId)) {
    savedGameIds = savedGameIds.filter((id) => id !== gameId);
  } else {
    savedGameIds.push(gameId);
  }

  // Re-render both views so card buttons and sidebar stay in sync
  syncBacklogViews();
}

function removeSavedGame(gameId) {
  savedGameIds = savedGameIds.filter((id) => id !== gameId);
  syncBacklogViews();
}

function clearBacklog() {
  savedGameIds = [];
  syncBacklogViews();
}

function renderBacklog() {
  const savedGames = GAMES.filter((game) => savedGameIds.includes(game.id));

  if (savedGames.length === 0) {
    backlogList.innerHTML = `
      <li class="backlog-empty">No games saved yet. Click "Save" on any card.</li>
    `;
    backlogSummary.textContent = "Total Queue: 0 games (0 hrs)";
    return;
  }

  backlogList.innerHTML = savedGames
    .map(
      (game) => `
      <li class="backlog-item">
        <div class="backlog-item-info">
          <strong>${game.title}</strong>
          <small>${game.mainHours} hrs main &bull; ${game.genre}</small>
        </div>
        <button
          type="button"
          class="remove-btn"
          data-remove-id="${game.id}"
          aria-label="Remove ${game.title} from backlog"
        >
          Remove
        </button>
      </li>
    `
    )
    .join("");

  const totalHours = savedGames.reduce((sum, game) => sum + game.mainHours, 0);
  backlogSummary.textContent = `Total Queue: ${savedGames.length} game(s) (${totalHours} hrs)`;
}

// --- Feature 3: Live Playtime & Finish-Date Estimator ---

function populatePlannerDropdown() {
  const options = GAMES.map(
    (game) => `<option value="${game.id}">${game.title} (${game.mainHours}h)</option>`
  ).join("");
  plannerGame.insertAdjacentHTML("beforeend", options);
}

function fillPlannerFromGame() {
  const selectedId = Number(plannerGame.value);
  const chosenGame = GAMES.find((game) => game.id === selectedId);

  if (chosenGame) {
    mainHoursInput.value = chosenGame.mainHours;
    extraHoursInput.value = chosenGame.extraHours;
  }

  updatePlaytimeEstimate();
}

function updatePlaytimeEstimate() {
  const mainHours = Math.max(0, Number(mainHoursInput.value) || 0);
  const extraHours = Math.max(0, Number(extraHoursInput.value) || 0);
  const dailyHours = Number(dailyHoursInput.value);

  if (!dailyHours || dailyHours <= 0) {
    plannerResult.innerHTML = `
      <h3>Estimated Finish</h3>
      <p class="planner-note">Enter at least 0.5 hours per day to calculate a timeline.</p>
    `;
    return;
  }

  const totalHours =
    completionMode.value === "full" ? mainHours + extraHours : mainHours;
  const daysNeeded = Math.max(1, Math.ceil(totalHours / dailyHours));

  // Calculate projected finish date by adding estimated days to today
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysNeeded);
  const formattedDate = finishDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  plannerResult.innerHTML = `
    <h3>Estimated Finish</h3>
    <p class="planner-stat">${daysNeeded} day${daysNeeded === 1 ? "" : "s"}</p>
    <p class="planner-note">
      <strong>${totalHours} total hours</strong> at ${dailyHours} hrs/day.<br>
      Target completion date: <strong>${formattedDate}</strong>
    </p>
  `;
}

// --- Form Validation & Conditional Field Logic ---

function syncConditionalFields() {
  const selectedType = requestForm.querySelector(
    'input[name="requestType"]:checked'
  ).value;
  const isSuggestion = selectedType === "suggest";

  releaseYearInput.required = isSuggestion;
  releaseYearLabel.textContent = isSuggestion
    ? "Release Year (required for new suggestions)"
    : "Release Year (optional for error reports)";
}

function handleFormSubmit(event) {
  event.preventDefault();

  // Trigger native browser validation messages if any field is invalid
  if (!requestForm.reportValidity()) {
    return;
  }

  const name = document.getElementById("visitorName").value.trim();
  const title = document.getElementById("requestTitle").value.trim();
  const selectedType = requestForm.querySelector(
    'input[name="requestType"]:checked'
  ).value;
  const actionLabel =
    selectedType === "suggest" ? "new title suggestion" : "issue report";

  confirmationDetails.textContent = `${name}, we logged your ${actionLabel} for "${title}". (Demo mode: no backend server is connected.)`;

  requestForm.hidden = true;
  formConfirmation.hidden = false;
}

function resetFormView() {
  requestForm.reset();
  syncConditionalFields();
  formConfirmation.hidden = true;
  requestForm.hidden = false;
}

// --- Event Listeners & Initial Setup ---

searchInput.addEventListener("input", renderCatalog);
genreFilter.addEventListener("change", renderCatalog);
difficultyFilter.addEventListener("change", renderCatalog);

// Event delegation lets one listener handle dynamically rendered card buttons
catalogGrid.addEventListener("click", (event) => {
  const saveBtn = event.target.closest(".save-btn");
  if (!saveBtn) return;
  toggleSavedGame(Number(saveBtn.dataset.gameId));
});

backlogList.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".remove-btn");
  if (!removeBtn) return;
  removeSavedGame(Number(removeBtn.dataset.removeId));
});

clearBacklogBtn.addEventListener("click", clearBacklog);

plannerGame.addEventListener("change", fillPlannerFromGame);
mainHoursInput.addEventListener("input", updatePlaytimeEstimate);
extraHoursInput.addEventListener("input", updatePlaytimeEstimate);
completionMode.addEventListener("change", updatePlaytimeEstimate);
dailyHoursInput.addEventListener("input", updatePlaytimeEstimate);

requestForm.addEventListener("change", (event) => {
  if (event.target.name === "requestType") {
    syncConditionalFields();
  }
});
requestForm.addEventListener("submit", handleFormSubmit);
submitAnotherBtn.addEventListener("click", resetFormView);

// Initial render on page load
populatePlannerDropdown();
renderCatalog();
renderBacklog();
updatePlaytimeEstimate();
syncConditionalFields();

