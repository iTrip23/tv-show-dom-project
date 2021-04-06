let allEpisodes;
let filteredEpisodes;
let allTVShows;
let selectedShow;

const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.value = '';
const selectEpisodesEl = document.querySelector('#select');
const TVShowsEl = document.querySelector('#TVShows');
const optionALL = document.createElement('option');

optionALL.innerText = 'All TV Series';
optionALL.addEventListener('click', () => {
  console.log(allTVShows);
  let parentEl = '';
  allTVShows.forEach(show => parentEl += getShowCard(show))
  rootEl.innerHTML = parentEl;
});
TVShowsEl.appendChild(optionALL);

const getEpisodeTitle = obj => 'S' + `${obj.season}`.padStart(2, 0) + 'E' + `${obj.number}`.padStart(2, 0) + ` - ${obj.name}`;
const getEpisodeCard = obj => `<div class="col-md-3 m-1 card">
  <div class="card-body card-css">
    <h5 class="card-title text-center">${getEpisodeTitle(obj)}</h5>
    <hr>
    <img src="${obj.image.medium}" class="card-img-top" alt="${getEpisodeTitle(obj)} image">
    <p class="card-text">${obj.summary}</p>
  </div>
</div>`;
const getShowCard = obj => `
<div class="card col-10 m-3">
  <div class="row g-0">
    <div class="col-md-3">
      <div class="card-body">
        <img src="${obj.image.medium}" alt="${obj.name} image" class="img-fluid"/>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card-body">
        <h4 class="card-title">${obj.name}</h4>
        <p class="card-text">${obj.summary}</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card-body">
        <p class="card-text">Rating: ${obj.rating.average}</p>
        <p class="card-text">Genre: ${obj.genres}</p>
        <p class="card-text">Status: ${obj.status}</p>
        <p class="card-text">Runtime: ${obj.runtime}</p>
        <p class="card-text">Runtime: ${obj.officialsite}</p>
      </div>
    </div>
  </div>
</div>
`;

function displayEpisodes(arr) {
  let parentEl = '';
  arr.forEach(episode => parentEl += getEpisodeCard(episode));
  rootEl.innerHTML = parentEl;
  searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
}

// function getGoT() {
//   fetch('https://api.tvmaze.com/shows/82/episodes')
//     .then(res => res.json())
//     .then(data => {
//       allEpisodes = data;
//       displayShow();
//     })
// }

// getGoT();

searchInput.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  filteredEpisodes = allEpisodes.filter(episode => episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  displayEpisodes(filteredEpisodes);
  searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
});

function displayShow() {
  selectEpisodesEl.innerHTML = '';
  const selectAll = document.createElement('option');
  selectAll.addEventListener('click', () => {
    let parentEl = '';
    allEpisodes.forEach(episode => parentEl += getEpisodeCard(episode));
    rootEl.innerHTML = parentEl;
    searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
  });
  selectAll.innerText = `All Episodes`;
  selectEpisodesEl.appendChild(selectAll);
  allEpisodes.forEach(episode => {
    let selectOption = document.createElement('option');
    selectOption.innerText = `${getEpisodeTitle(episode)}`;
    selectEpisodesEl.appendChild(selectOption);
    selectOption.addEventListener('click', () => { rootEl.innerHTML = getEpisodeCard(episode); searchResult.innerHTML = `Displaying 1/${allEpisodes.length} episodes` });
  })
  displayEpisodes(allEpisodes);
}

function getTVShows() {
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      allTVShows = data;
      displayAllShows();
    })
}

getTVShows();

function displayAllShows() {
  let parentEl = '';
  allTVShows.forEach(show => {
    parentEl += getShowCard(show);
    rootEl.innerHTML = parentEl;
    let optionEl = document.createElement('option');
    optionEl.innerHTML = show.name;
    TVShowsEl.appendChild(optionEl);
    optionEl.addEventListener('click', () => {
      fetch(`${show._links.self.href}/episodes`)
        .then(res => res.json())
        .then(data => {
          allEpisodes = data;
          displayShow();
        })
    });
  })
}