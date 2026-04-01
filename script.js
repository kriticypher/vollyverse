// DOM elements
const container = document.getElementById("teamsContainer");
const loader = document.getElementById("loader");
const error = document.getElementById("error");
const searchInput = document.getElementById("searchInput");

// Store all teams
let allTeams = [];

// Fetch teams from API
async function fetchTeams() {
  loader.style.display = "block";
  error.style.display = "none";
  container.innerHTML = "";

  try {
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=CEV%20Champions%20League");
    const data = await res.json();

    if (!data.teams) throw new Error("No teams");

    allTeams = data.teams;
    displayTeams(allTeams);
  } catch (err) {
    error.style.display = "block";
  }

  loader.style.display = "none";
}

// Display team cards
function displayTeams(teams) {
  container.innerHTML = "";

  if (teams.length === 0) {
    container.innerHTML = '<div class="no-results">No teams found.</div>';
    return;
  }

  teams.forEach(team => {
    const card = document.createElement("div");
    card.classList.add("card");

    const badge = team.strBadge ? team.strBadge + "/preview" : "";
    const desc = team.strDescriptionEN || "";

    card.innerHTML = `
      ${badge ? `<img src="${badge}" alt="${team.strTeam}">` : '<div style="font-size:2.5rem;margin-bottom:12px;">🏐</div>'}
      <h3>${team.strTeam}</h3>
      <span class="country">${team.strCountry || "Unknown"}</span>
      ${desc ? `<p class="desc">${desc}</p>` : ""}
    `;

    container.appendChild(card);
  });
}

// Search filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allTeams.filter(t => t.strTeam.toLowerCase().includes(query));
  displayTeams(filtered);
});


fetchTeams();