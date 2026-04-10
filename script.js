
const API_URL = "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=CEV%20Champions%20League";


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
  
  
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

async function fetchTeams() {
  loader.style.display = "block";
  error.style.display = "none";
  container.innerHTML = "";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Network response was not ok");
    
    const data = await res.json();
    if (!data.teams) throw new Error("No teams found in API response");

    allTeams = data.teams;
    populateFilters(allTeams);
    updateDisplay();
  } catch (err) {
    console.error("Fetch Error:", err);
    error.style.display = "block";
  } finally {
    loader.style.display = "none";
  }
}


function populateFilters(teams) {
  const countries = [...new Set(teams.map(t => t.strCountry).filter(Boolean))].sort();
  
  const optionsHtml = countries.map(c => `<option value="${c}">${c}</option>`).join("");
  filterSelect.innerHTML = `<option value="all">All Countries</option>${optionsHtml}`;
}


 
function updateDisplay() {
  let filtered = [...allTeams];

  
  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(team => 
      team.strTeam && team.strTeam.toLowerCase().includes(query)
    );
  }

  const country = filterSelect.value;
  if (country !== "all") {
    filtered = filtered.filter(team => team.strCountry === country);
  }


  const sort = sortSelect.value;
  if (sort === "asc") {
    filtered.sort((a, b) => (a.strTeam || "").localeCompare(b.strTeam || ""));
  } else if (sort === "desc") {
    filtered.sort((a, b) => (b.strTeam || "").localeCompare(a.strTeam || ""));
  }

  displayTeams(filtered);
}


function displayTeams(teams) {
  container.innerHTML = "";

  if (teams.length === 0) {
    container.innerHTML = '<div class="no-results">🏐 No teams match your search.</div>';
    return;
  }

  teams.forEach(team => {
    const card = document.createElement("div");
    card.classList.add("card");

    const badge = team.strBadge ? `${team.strBadge}/preview` : null;
    const desc = team.strDescriptionEN || "No description available.";

    card.innerHTML = `
      <div class="card-visual">
        ${badge ? `<img src="${badge}" alt="${team.strTeam}" loading="lazy">` : '<div class="fallback-icon">🏐</div>'}
      </div>
      <div class="card-content">
        <h3>${team.strTeam}</h3>
        <span class="country">${team.strCountry || "Unknown"}</span>
        <p class="desc">${desc}</p>
      </div>
    `;

    container.appendChild(card);
  });
}


searchInput.addEventListener("input", updateDisplay);
sortSelect.addEventListener("change", updateDisplay);
filterSelect.addEventListener("change", updateDisplay);


fetchTeams();
