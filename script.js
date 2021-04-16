let allEpisodes;
let allTVShows;
let selectedShow;
let allGenres;

const rootEl = document.querySelector('#root');
const searchInput = document.querySelector('#search-input');
const searchResult = document.querySelector('#search-result');
searchInput.value = '';
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

function getTVShows() {
  fetch('https://api.tvmaze.com/shows')
    .then(res => res.json())
    .then(data => {
      allTVShows = data;
      displayAllShows(allTVShows);
      getAllGenres();
    })
    .catch(error => console.log(error))
}

getTVShows();

function fetchShowAndDisplay(id) {
  fetch(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then(res => res.json())
    .then(data => {
      allEpisodes = data;
      displaySelectedShow(allEpisodes);
    })
    .catch(error => console.log(error));
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
}

selectEpisodesEl.addEventListener('change', (e) => {
  if (e.target.value == 'selectAll') displayEpisodes(allEpisodes);
  for (let ep of allEpisodes) {
    if (ep.id == selectEpisodesEl.value) {
      rootEl.innerHTML = getEpisodeCard(ep);
      searchResult.innerHTML = `Displaying 1/${allEpisodes.length} episodes`;
    }
  }
})

selectShowEl.addEventListener('change', (e) => {
  if (e.target.value == 'allShows') {
    displayShows(allTVShows);
  }
  for (let show of allTVShows) {
    if (show.id == selectShowEl.value) {
      fetchShowAndDisplay(show.id);
    }
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
  console.time('Display Shows');
  let allShowsHTML = '';
  let firstTen = arr.slice(0, 10);
  let restOf = arr.slice(10);
  firstTen.forEach(show => allShowsHTML += getShowCard(show));
  rootEl.innerHTML = allShowsHTML;
  setTimeout(() => displayMoreShows(restOf), 100);
  console.timeEnd('Display Shows');
}

function displayMoreShows(arr) {
  let restOfHTML = '';
  arr.forEach(show => restOfHTML += getShowCard(show));
  rootEl.innerHTML += restOfHTML;
}

function displayAllShows(arr) {
  createShowSelect(arr);
  displayShows(arr);
}


function getAllGenres() {
  let genres = [];
  allTVShows.forEach(show => show.genres.forEach(gen => genres.push(gen)));
  allGenres = [...new Set(genres)];
}

























// fetch(`http://api.tvmaze.com/shows/${e.target.value}/episodes`)
//   .then(res => res.json())
//   .then(data => {
//     allEpisodes = data;
//     displaySelectedShow(allEpisodes);
//   })
//   .catch(error => console.log(error))







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