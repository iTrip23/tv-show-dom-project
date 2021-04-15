let allEpisodes;
let allTVShows;
let selectedShow;
let allGenres;

const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.value = '';
const selectEpisodesEl = document.querySelector('#select');
const TVShowsEl = document.querySelector('#TVShows');
const optionALL = document.createElement('option');

optionALL.innerText = 'All TV Series';
optionALL.value = allTVShows;
optionALL.addEventListener('change', () => {
  rootEl.innerHTML = '';
  optionALL.value.forEach(show => {
    rootEl.innerHTML += getShowCard(show);
  });
});

TVShowsEl.appendChild(optionALL);

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




function getTVShows() {
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      allTVShows = data;
      displayAllShows();
      getAllGenres();
    })
}

getTVShows();

function displayAllShows(arr) {
  rootEl.innerHTML = '';
  allTVShows.forEach(show => {
    rootEl.innerHTML += getShowCard(show);
    let optionEl = document.createElement('option');
    optionEl.innerHTML = show.name;
    optionEl.value = show.id;
    TVShowsEl.appendChild(optionEl);
  })
}

TVShowsEl.addEventListener('change', () =>
  fetch(`http://api.tvmaze.com/shows/${TVShowsEl.value}/episodes`)
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      displaySelectedShow(allEpisodes);
    })
)

function getAllGenres() {
  let genres = [];
  allTVShows.forEach(show => show.genres.forEach(gen => genres.push(gen)));
  allGenres = [...new Set(genres)];
}

function fetchShowAndDisplay(id) {
  fetch(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      displaySelectedShow(allEpisodes);
    })
    .catch(error => console.log(error));
}


function getAndDisplayShowInfo() {
  return `<div></div>`
}


function displayShows(arr) {
  rootEl.innerHTML = '';
  arr.forEach(show => rootEl.innerHTML += getShowCard(show))
}

function displayEpisodes(arr) {
  rootEl.innerHTML = '';
  arr.forEach(episode => rootEl.innerHTML += getEpisodeCard(episode));
  searchResult.innerHTML = `Displaying ${arr.length}/${arr.length}`;
}

function createEpisodeSelect(arr) {
  selectEpisodesEl.innerHTML = '';
  let selectAllEpisodes = document.createElement('option');
  selectAllEpisodes.innerText = 'All Episodes';
  selectAllEpisodes.value = arr;
  selectAllEpisodes.addEventListener('change', displayEpisodes(arr));
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
}

selectEpisodesEl.addEventListener('change', () => {
  for (let ep of allEpisodes) {
    if (ep.id == selectEpisodesEl.value) {
      rootEl.innerHTML = getEpisodeCard(ep);
      searchResult.innerHTML = `Displaying 1/${allEpisodes.length} episodes`;
    }
  }
})

// searchInput.addEventListener('keyup', (input) => {
  //   const searchEl = input.target.value.toLowerCase();
  //   filteredEpisodes = allEpisodes.filter(episode => episode.name.toLowerCase().includes(searchEl) || episode.summary.toLowerCase().includes(searchEl));
  //   displayEpisodes(filteredEpisodes);
  //   searchResult.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length} episodes`;
  // });




  // function searchBar(content) {
    //   if (content[0].url.includes('shows')) {
      //     searchInput.addEventListener('keyup', (input) => {
        //       const searchEl = input.target.value.toLowerCase();
        //       let filteredResults = content.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl) || obj.genres.toLowerCase().includes(searchEl));
        //       rootEl.innerHTML = '';
        //       filteredResults.forEach(show => {
          //         rootEl.innerHTML += getShowCard(show);
          //       });
          //       searchResult.innerHTML = `Displaying ${filteredResults.length}/${content.length}`;
          //     });
          //   } else {
            //     searchInput.addEventListener('keyup', (input) => {
              //       const searchEl = input.target.value.toLowerCase();
              //       let filteredResults = content.filter(obj => obj.name.toLowerCase().includes(searchEl) || obj.summary.toLowerCase().includes(searchEl));
              //       displayEpisodes(filteredResults);
              //       searchResult.innerHTML = `Displaying ${filteredResults.length}/${content.length}`;
              //     });
              //   }
              // }