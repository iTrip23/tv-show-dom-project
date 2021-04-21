let allEpisodes;
let allTVShows;
let selectedShow;
let allGenres;

const searchShowsEl = document.querySelector('#searchShows');
const searchEpisodesEl = document.querySelector('#searchEpisodes');
const searchResult = document.querySelector('#search-result');
const selectEpisodesEl = document.querySelector('#select');
const selectShowEl = document.querySelector('#TVShows');
const episodesEl = document.querySelector('#episodes');
const showsEl = document.querySelector('#tvSeries');

const getEpisodeTitle = episode => 'S' + `${episode.season}`.padStart(2, 0) + 'E' + `${episode.number}`.padStart(2, 0) + ` - ${episode.name}`;

const getEpisodeCard = episode => `<div class="col-11 col-md-3 m-1 card">
  <figure class="card-body card-css">
    <h5 class="card-title text-center">${getEpisodeTitle(episode)}</h5>
    <hr>
      ${getImageAndDisplay(episode)}
    <p class="card-text">${episode.summary}</p>
  </figure>
</div>`;

const getShowCard = tvSeries => `<div class="card col-11 col-md-10 m-3 show-card g-0">
    <div class="row g-0">
      <figure class="col-12 col-md-3">
        ${getImageAndDisplay(tvSeries)}
      </figure>
      <section class="col-12 col-md-6">
        <div class="card-body">
          <h4 class="card-title text-center" onclick="fetchShowAndDisplay(${tvSeries.id})" style="cursor: pointer">${tvSeries.name}</h4>
          <p class="summary-p">${tvSeries.summary}</p>
        </div>
      </section>
      <section class="col-12 col-md-3">
        <div class="card-body">
          <p class="card-text"><strong>Rating:</strong> ${tvSeries.rating.average}</p>
          <p class="card-text"><strong>Genre:</strong> ${tvSeries.genres}</p>
          <p class="card-text"><strong>Status:</strong> ${tvSeries.status}</p>
          <p class="card-text"><strong>Runtime:</strong> ${tvSeries.runtime}</p>
        </div>
      </section>
    </div>
  </div>
</div>`;

function fetchAllShowsAndDisplay() {
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      allTVShows = data.sort((a, b) => {
        let sa = a.name.toLowerCase();
        let sb = b.name.toLowerCase();
        if (sa < sb) { return -1 }
        if (sa > sb) { return 1 }
        return 0
      });
      displayAllShows(allTVShows);
      searchShowsEl.value = '';
      getAllGenres();
    })
    .catch(error => console.log(error))
}

fetchAllShowsAndDisplay();

function fetchShowAndDisplay(id) {
  fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      displaySelectedShow(allEpisodes);
      searchShowsEl.value = '';
    })
    .catch(error => console.log(error));
}

const getImageAndDisplay = obj => obj.image !== null ?? undefined ? `<img src="${obj.image.original}" alt="${obj.name} image" class="img-fluid mx-auto" />`
  : `<img src="https://cdn.pixabay.com/photo/2018/01/05/00/20/test-image-3061864_960_720.png" alt="image not available" class="img-fluid mx-auto" />`;


function displayEpisodes(arr) {
  showsEl.setAttribute('style', 'display:none !important');
  episodesEl.setAttribute('style', 'display:inline');
  let allEpisodesHTML = '';
  arr.forEach(episode => allEpisodesHTML += getEpisodeCard(episode));
  episodesEl.innerHTML = allEpisodesHTML;
  searchResult.innerHTML = `Displaying ${arr.length}/${arr.length}`;
  searchShowsEl.setAttribute('style', 'display: none !important');
  searchEpisodesEl.setAttribute('style', 'display: inline');
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
  searchEpisodesEl.value = '';
  searchShowsEl.setAttribute('style', 'display: none !important');
  searchEpisodesEl.setAttribute('style', 'display: inline');
}

selectEpisodesEl.addEventListener('change', (e) => {
  if (e.target.value === 'selectAll') { displayEpisodes(allEpisodes); }
  for (let ep of allEpisodes) {
    if (ep.id == selectEpisodesEl.value) {
      episodesEl.innerHTML = getEpisodeCard(ep);
      searchResult.innerHTML = `Displaying 1/${allEpisodes.length}`;
    }
  }
})

selectShowEl.addEventListener('change', (e) => {
  if (e.target.value === 'allShows') {
    displayShows(allTVShows);
    searchEpisodesEl.value = '';
  };
  for (let show of allTVShows) {
    if (show.id == selectShowEl.value) { fetchShowAndDisplay(show.id); }
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
  showsEl.setAttribute('style', 'display:inline');
  episodesEl.setAttribute('style', 'display:none !important');
  let allShowsHTML = '';
  arr.forEach(show => allShowsHTML += getShowCard(show))
  showsEl.innerHTML = allShowsHTML;
  searchResult.innerHTML = `Displaying ${arr.length}/${arr.length}`;
  searchShowsEl.setAttribute('style', 'display: inline');
  searchEpisodesEl.setAttribute('style', 'display: none !important');
}

function displayAllShows(arr) {
  createShowSelect(arr);
  displayShows(arr);
  searchShowsEl.value = '';
  searchShowsEl.setAttribute('style', 'display: inline');
  searchEpisodesEl.setAttribute('style', 'display: none !important');
}

function getAllGenres() {
  let genres = [];
  allTVShows.forEach(show => show.genres.forEach(gen => genres.push(gen)));
  allGenres = [...new Set(genres)];
}

searchShowsEl.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  let filteredResults = allTVShows.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl) || obj.genres.forEach(gen => gen.toLowerCase().includes(searchEl)));
  displayShows(filteredResults);
  searchResult.innerHTML = `Displaying ${filteredResults.length}/${allTVShows.length}`;
})

searchEpisodesEl.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  let filteredResults = allEpisodes.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl));
  displayEpisodes(filteredResults);
  searchResult.innerHTML = `Displaying ${filteredResults.length}/${allEpisodes.length}`;
});