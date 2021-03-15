//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (let episode of episodeList) {
    displayEpisode(episode);
  }
}

window.onload = setup;


function displayEpisode(episode) {
  const rootEl = document.querySelector('#root');
  const seasonNr = String(episode.season).padStart(2, 0);
  const episodeNr = String(episode.number).padStart(2, 0);
  const cardEl = document.createElement('div');
  cardEl.className = 'card-info';
  const epTitleEl = document.createElement('h1');
  epTitleEl.className = 'card-title';
  epTitleEl.innerText = `${episode.name} S${seasonNr}E${episodeNr}`;
  cardEl.appendChild(epTitleEl);
  const pictureEl = document.createElement('img');
  pictureEl.src = episode.image.medium;
  pictureEl.className = 'card-img';
  cardEl.appendChild(pictureEl);
  const summaryEl = document.createElement('div');
  summaryEl.innerHTML = episode.summary;
  summaryEl.className = 'card-summary';
  cardEl.appendChild(summaryEl);
  rootEl.appendChild(cardEl);
}