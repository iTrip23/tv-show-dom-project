//You can edit ALL of the code here
let allEpisodes;
const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.innerText = '';

searchInput.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  rootEl.innerHTML = '';
  const filteredEpisodes = allEpisodes.filter(episode => {
    return (episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  });
  searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
  displayEpisode(filteredEpisodes);
});

function setup() {
  allEpisodes = getAllEpisodes();
  displayEpisode(allEpisodes);
  displayEpisode(filteredEpisodes);
}

window.onload = setup;

function displayEpisode(episodeList) {
  for (let episode of episodeList) {
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
}
