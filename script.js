let allEpisodes;
let filteredEpisodes;
const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.value = '';
const selectEl = document.querySelector('#select');
let selectOptions = document.createElement('option');
selectOptions.innerText = `All Episodes`;
selectEl.appendChild(selectOptions);

function displayAll() {
  let parentEl = allEpisodes.map(episode => {
    let seasonNr = String(episode.season).padStart(2, 0);
    let episodeNr = String(episode.number).padStart(2, 0);
    return `
          <div class='card-info'>
            <h3 class='card-title'>${episode.name} S${seasonNr}:E${episodeNr}</h3>
            <img src=${episode.image.medium} class='card-img'>
            <div class='card-summary'>${episode.summary}</div>
          </div>
        `
  }).join('');
  rootEl.innerHTML = parentEl;
  searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
}

function getApi() {
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then(res => res.json())
    .then(data => {
      allEpisodes = data
      buildWebPage();
    })
  selectOptions.addEventListener('click', displayAll);
}

getApi();

searchInput.addEventListener('keyup', (input) => {
  const searchEl = input.target.value.toLowerCase();
  rootEl.innerHTML = '';
  filteredEpisodes = allEpisodes.filter(episode => {
    return (episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  });
  searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
  let filterHTML = filteredEpisodes.map(episode => {
    let seasonNr = String(episode.season).padStart(2, 0);
    let episodeNr = String(episode.number).padStart(2, 0);
    return `
          <div class='card-info'>
            <h3 class='card-title'>${episode.name} S${seasonNr}:E${episodeNr}</h3>
            <img src=${episode.image.medium} class='card-img'>
            <div class='card-summary'>${episode.summary}</div>
          </div>
        `
  }).join('');
  rootEl.innerHTML = filterHTML;
});

function buildWebPage() {
  let parentEl = allEpisodes.map(episode => {
    let seasonNr = String(episode.season).padStart(2, 0);
    let episodeNr = String(episode.number).padStart(2, 0);
    let selectOption = document.createElement('option');
    selectOption.innerText = `S${seasonNr}:E${episodeNr} - ${episode.name}`;
    selectOption.addEventListener('click', function () {
      rootEl.innerHTML = `
            <div class='card-info'>
              <h3 class='card-title'>${episode.name} S${seasonNr}:E${episodeNr}</h3>
              <img src=${episode.image.medium} class='card-img'>
              <div class='card-summary'>${episode.summary}</div>
            </div>
          `
      searchResult.innerHTML = `Displaying 1/${allEpisodes.length}`;
    })
    selectEl.appendChild(selectOption);
    return `
          <div class='card-info'>
            <h3 class='card-title'>${episode.name} S${seasonNr}:E${episodeNr}</h3>
            <img src=${episode.image.medium} class='card-img'>
            <div class='card-summary'>${episode.summary}</div>
          </div>
        `
  }).join('');
  rootEl.innerHTML = parentEl;
  searchResult.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;

}