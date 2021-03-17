//You can edit ALL of the code here
let allEpisodes;
let filteredEpisodes = [];
const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.innerText = '';
const selectEl = document.querySelector('#select');

function setup() {
  allEpisodes = getAllEpisodes();
  displayEpisodes(allEpisodes);
  for (let episode of allEpisodes) {
    let optionEl = document.createElement('option');
    let seasonNr = String(episode.season).padStart(2, 0);
    let episodeNr = String(episode.number).padStart(2, 0);
    optionEl.innerHTML = `S${seasonNr}:E${episodeNr} - ${episode.name}`;
    optionEl.value = episode.id;
    selectEl.appendChild(optionEl);
    optionEl.addEventListener('click', function () {
      rootEl.innerHTML = '';
      displayEpisode(episode);
    });
  }
  displayEpisodes(filteredEpisodes);
}

window.onload = setup;

function displayEpisode(episode) {
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


function displayEpisodes(episodeList) {
  for (let episode of episodeList) {
    displayEpisode(episode);
  }
}

searchInput.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  rootEl.innerHTML = '';
  filteredEpisodes = allEpisodes.filter(episode => {
    return (episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  });
  searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
  displayEpisodes(filteredEpisodes);
});

function selectEpisode(allEpisodes) {
  let selectOptions = allEpisodes.map(elem => {
    let seasonNr = String(episode.season).padStart(2, 0);
    let episodeNr = String(episode.number).padStart(2, 0);
    return `<option value='${elem.name}'>S${seasonNr}E${episodeNr}: ${elem.name}</option>`;
  }).join('');
  selectOptions = '<option>All Episodes</option>' + selectOptions;
  selectEl.innerHTML = selectOptions;
}

let option = document.createElement('option');
option.innerText = 'All Episodes';
option.value = 'allEpisodes';
option.addEventListener('click', function () {
  rootEl.innerHTML = '';
  displayEpisodes(allEpisodes);
})
selectEl.appendChild(option);

function createOptions() {
  selectEpisode(allEpisodes);
}