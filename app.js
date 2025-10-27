// app.js — ferdig versjon for Netlify

// Når brukeren klikker på knappen, hent bibelverset
document.querySelector("button").addEventListener("click", hentVers);

async function hentVers() {
  const input = document.querySelector("input").value.trim();
  const version = document.querySelector("select").value;

  // API-nøkkel fra API.Bible (bruk din egen fra dashboardet)
  const API_KEY = "51658bcd81eabe502071d3f9b2d28780";

  if (!input) {
    visFeil("Skriv inn et bibelsted (for eksempel John 3:16)");
    return;
  }

  // Gjør klar URL til API.Bible
  let apiUrl = `https://api.scripture.api.bible/v1/passages/${encodeURIComponent(
    input
  )}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&version=${version}`;

  // Hvis vi kjører på Netlify, bruk proxy for å unngå CORS
  if (window.location.hostname.includes("netlify.app")) {
    apiUrl = "/.netlify/functions/proxy?url=" + encodeURIComponent(apiUrl);
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP-feil: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.content) {
      visVers(data.data.content);
    } else {
      visFeil("Fant ikke verset, prøv et annet sted eller språk.");
    }
  } catch (error) {
    visFeil("Feil: " + error.message);
  }
}

// Viser verset i HTML-en
function visVers(html) {
  let versEl = document.getElementById("vers");
  if (!versEl) {
    versEl = document.createElement("div");
    versEl.id = "vers";
    document.body.appendChild(versEl);
  }
  versEl.innerHTML = html;
}

// Viser feilmelding
function visFeil(melding) {
  let versEl = document.getElementById("vers");
  if (!versEl) {
    versEl = document.createElement("div");
    versEl.id = "vers";
    document.body.appendChild(versEl);
  }
  versEl.innerHTML = `<span style="color:red">${melding}</span>`;
}