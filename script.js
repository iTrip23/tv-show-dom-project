let allEpisodes;
let filteredEpisodes;
let allTVShows;
const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.value = '';
const selectEl = document.querySelector('#select');
let selectAll = document.createElement('option');
selectAll.addEventListener('click', () => {
  let parentEl = '';
  allEpisodes.forEach(episode => parentEl += getEpisodeCard(episode));
  rootEl.innerHTML = parentEl;
  searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
});
selectAll.innerText = `All Episodes`;
selectEl.appendChild(selectAll);

const getEpisodeTitle = obj => 'S' + `${obj.season}`.padStart(2, 0) + 'E' + `${obj.number}`.padStart(2, 0) + ` - ${obj.name}`;
const getEpisodeCard = obj => `<div class="row col-md-3 m-1 card">
  <div class="card-body">
    <h5 class="card-title text-center">${getEpisodeTitle(obj)}</h5>
    <hr>
    <img src="${obj.image.medium}" class="card-img-top" alt="">
    <p class="card-text">${obj.summary}</p>
  </div>
</div>`;

function displayEpisodes(arr) {
  let parentEl = '';
  arr.forEach(episode => parentEl += getEpisodeCard(episode));
  rootEl.innerHTML = parentEl;
  searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
}

function getGoT() {
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      buildWebPage();
    })
}

getGoT();

searchInput.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  filteredEpisodes = allEpisodes.filter(episode => episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
  displayEpisodes(filteredEpisodes);
});

function buildWebPage() {
  allEpisodes.forEach(episode => {
    let selectOption = document.createElement('option');
    selectOption.innerText = `${getEpisodeTitle(episode)}`;
    selectOption.addEventListener('click', () => rootEl.innerHTML = getEpisodeCard(episode), searchResult.innerHTML = `Displaying 1/${allEpisodes.length} episodes`);
    selectEl.appendChild(selectOption);
  })
  displayEpisodes(allEpisodes);
}

// function getTVShows() {
//   fetch('https://api.tvmaze.com/shows')
//     .then(res => res.json())
//     .then(data => {
//       allTVShows = data;
//       allTVShows.
//     })
// }
// getTVShows();