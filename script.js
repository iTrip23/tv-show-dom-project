let allEpisodes;
let allTVShows;
let selectedShow;
let allGenres;

const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
const selectEpisodesEl = document.querySelector('#select');
const selectShowEl = document.querySelector('#TVShows');

const getEpisodeTitle = obj => 'S' + `${obj.season}`.padStart(2, 0) + 'E' + `${obj.number}`.padStart(2, 0) + ` - ${obj.name}`;

const getEpisodeCard = obj => `<div class="col-md-3 m-1 card">
  <div class="card-body card-css">
    <h5 class="card-title text-center">${getEpisodeTitle(obj)}</h5>
    <hr>
    <img src="${obj.image.original}" class="card-img-top" alt="${getEpisodeTitle(obj)} image">
    <p class="card-text">${obj.summary}</p>
  </div>
</div>`;

const getShowCard = obj => `
  <div class="card col-12 col-md-10 m-3 show-card g-0" onclick="fetchShowAndDisplay(${obj.id})">
    <div class="row g-0">
      <div class="col-md-3">
        <img src="${obj.image.original}" alt="${obj.name} image" class="img-fluid show-image"/>
      </div>
      <div class="col-md-6">
        <div class="card-body">
          <h4 class="card-title">${obj.name}</h4>
          <p class="summary-p">${obj.summary}</p>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card-body">
          <p class="card-text"><strong>Rating:</strong> ${obj.rating.average}</p>
          <p class="card-text"><strong>Genre:</strong> ${obj.genres}</p>
          <p class="card-text"><strong>Status:</strong> ${obj.status}</p>
          <p class="card-text"><strong>Runtime:</strong> ${obj.runtime}</p>
        </div>
      </div>
    </div>
  </div>
</div>
`;

function fetchAllShowsAndDisplay() {
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      allTVShows = data;
      console.log(allTVShows[12]);
      displayAllShows(allTVShows);
      getAllGenres();
      searchBar(allTVShows);
    })
    .catch(error => console.log(error))
}

fetchAllShowsAndDisplay();

function fetchShowAndDisplay(id) {
  fetch(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      displaySelectedShow(allEpisodes);
      searchBar(allEpisodes);
    })
    .catch(error => console.log(error));
}


function displayEpisodes(arr) {
  let allEpisodesHTML = '';
  arr.forEach(episode => allEpisodesHTML += getEpisodeCard(episode));
  rootEl.innerHTML = allEpisodesHTML;
  searchResult.innerHTML = `Displaying ${arr.length}/${arr.length}`;
}

function createEpisodeSelect(arr) {
  selectEpisodesEl.innerHTML = '';
  let selectAllEpisodes = document.createElement('option');
  selectAllEpisodes.innerText = 'All Episodes';
  selectAllEpisodes.value = 'selectAll';
  selectEpisodesEl.appendChild(selectAllEpisodes);
  arr.forEach(episode => {
    let selectOption = document.createElement('option');
    selectOption.innerText = `${getEpisodeTitle(episode)}`;
    selectOption.value = episode.id;
    selectEpisodesEl.appendChild(selectOption);
  });
}

function displaySelectedShow(arr) {
  createEpisodeSelect(arr);
  displayEpisodes(arr);
  searchBar(arr);
  searchInput.value = '';
}

selectEpisodesEl.addEventListener('change', (e) => {
  if (e.target.value == 'selectAll') displayEpisodes(allEpisodes);
  for (let ep of allEpisodes) {
    if (ep.id == selectEpisodesEl.value) {
      rootEl.innerHTML = getEpisodeCard(ep);
      searchResult.innerHTML = `Displaying 1/${allEpisodes.length}`;
    }
  }
})

selectShowEl.addEventListener('change', (e) => {
  if (e.target.value == 'allShows') displayShows(allTVShows);
  for (let show of allTVShows) {
    if (show.id == selectShowEl.value) fetchShowAndDisplay(show.id);
  }
})

function createShowSelect(arr) {
  selectShowEl.innerHTML = '';
  let selectAllShows = document.createElement('option');
  selectAllShows.innerText = 'All Shows';
  selectAllShows.value = 'allShows';
  selectShowEl.appendChild(selectAllShows);
  arr.forEach(show => {
    let selectOption = document.createElement('option');
    selectOption.innerText = show.name;
    selectOption.value = show.id;
    selectShowEl.appendChild(selectOption);
  })
}

function displayShows(arr) {
  let allShowsHTML = '';
  arr.forEach(show => allShowsHTML += getShowCard(show))
  rootEl.innerHTML = allShowsHTML;
  searchResult.innerHTML = `Displaying ${arr.length}/${arr.length}`;
}

function displayAllShows(arr) {
  searchInput.value = '';
  createShowSelect(arr);
  displayShows(arr);
}


function getAllGenres() {
  let genres = [];
  allTVShows.forEach(show => show.genres.forEach(gen => genres.push(gen)));
  allGenres = [...new Set(genres)];
}

function searchBar(arr) {
  if (arr[0].genres != null) {
    searchInput.addEventListener('keyup', (input) => {
      const searchEl = input.target.value.toLowerCase();
      let filteredResults = arr.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl) || obj.genres.forEach(gen => gen.toLowerCase().includes(searchEl)));
      displayShows(filteredResults);
      searchResult.innerHTML = `Displaying ${filteredResults.length}/${arr.length}`;
    });
  } else {
    searchInput.addEventListener('keyup', (input) => {
      const searchEl = input.target.value.toLowerCase();
      let filteredResults = arr.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl));
      displayEpisodes(filteredResults);
      searchResult.innerHTML = `Displaying ${filteredResults.length}/${arr.length}`;
    });
  }
}