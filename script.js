
const container = document.getElementById("teamsContainer");
const loader = document.getElementById("loader");
const error = document.getElementById("error");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterSelect = document.getElementById("filterSelect");
const themeToggle = document.getElementById("themeToggle");


let allTeams = [];


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

async function fetchTeams() {
  loader.style.display = "block";
  error.style.display = "none";
  container.innerHTML = "";

  try {
    const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=CEV%20Champions%20League");
    const data = await res.json();

    if (!data.teams) throw new Error("No teams");

    allTeams = data.teams;
    populateFilters(allTeams);
    updateDisplay();
  } catch (err) {
    error.style.display = "block";
  }

  loader.style.display = "none";
}


function populateFilters(teams) {

  const countries = [...new Set(teams.map(t => t.strCountry).filter(Boolean))].sort();
  

  const defaultOption = '<option value="all">All Countries</option>';
  const optionsHtml = countries.map(c => `<option value="${c}">${c}</option>`).join("");
  
  filterSelect.innerHTML = defaultOption + optionsHtml;
}


function updateDisplay() {
  let filtered = [...allTeams];


  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(team => team.strTeam && team.strTeam.toLowerCase().includes(query));
  }


  const country = filterSelect.value;
  if (country !== "all") {
    filtered = filtered.filter(team => team.strCountry === country);
  }


  const sort = sortSelect.value;
  if (sort === "asc") {
    filtered.sort((a, b) => a.strTeam > b.strTeam ? 1 : -1);
  } else if (sort === "desc") {
    filtered.sort((a, b) => a.strTeam < b.strTeam ? 1 : -1);
  }

  displayTeams(filtered);
}


searchInput.addEventListener("input", updateDisplay);
sortSelect.addEventListener("change", updateDisplay);
filterSelect.addEventListener("change", updateDisplay);





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

fetchTeams();