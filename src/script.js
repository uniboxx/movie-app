const mainEl = document.querySelector(`#main`);
const form = document.querySelector(`#form`);
const search = document.querySelector(`#search`);
const pagesEl = document.querySelector(`.paginate`);

const API_URL =
  'https://api.themoviedb.org/3/discover/movie?api_key=766ef7fd1f98b23bae29eb3c070c1e60&language=it&page=1';
const IMAGE_PATH = `https://image.tmdb.org/t/p/w300`;
const SEARCH_URL = API_URL.replace('discover', 'search') + '&query=';

let currentUrl = API_URL;
let page;
//^ Get initial movies
getMovies(currentUrl);

async function getMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results;
    if (!results[0]) {
      mainEl.innerHTML = `<h1 style='color: #fff;font-size: 40px;'>No results found!</h1>`;
      return;
    }

    // const movie = results[0];
    results.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      let imgEl;
      if (movie.poster_path) {
        imgEl = document.createElement('img');
        imgEl.src = `${IMAGE_PATH}${movie.poster_path}`;
        imgEl.alt = `Poster image of the movie: ${movie.title}`;
      } else {
        imgEl = document.createElement('p');
        imgEl.textContent = 'Immagine non disponibile ⚠️';
        imgEl.style.margin = '0 0 6px';
        imgEl.style.height = '450px';
        imgEl.style.textAlign = 'center';
        imgEl.style.padding = '200px 10px';
        imgEl.style.fontSize = '30px';
        imgEl.style.color = '#fff';
        imgEl.style.borderBottom = '1px solid #22254b';
      }
      movieEl.appendChild(imgEl);

      const movieInfoEl = document.createElement('div');
      movieInfoEl.classList.add('movie-info');
      const h3titleEl = document.createElement('h3');
      h3titleEl.innerText = movie.title;
      movieInfoEl.appendChild(h3titleEl);
      const spanEl = document.createElement('span');
      let rating = (Math.round(movie.vote_average * 10) / 10).toString();
      if (rating.length === 1) rating += '.0';
      if (rating < 4) spanEl.classList.add('red');
      if (rating >= 4 && rating < 7) spanEl.classList.add('orange');
      if (rating >= 7 && rating <= 10) spanEl.classList.add('green');
      spanEl.innerText = rating;
      movieInfoEl.appendChild(spanEl);
      movieEl.appendChild(movieInfoEl);

      const overviewEl = document.createElement('div');
      overviewEl.classList.add('overview');
      const h3OverEl = document.createElement('h3');
      h3OverEl.innerText = 'Descrizione';
      overviewEl.appendChild(h3OverEl);
      const overText = document.createTextNode(movie.overview);
      if (movie.overview) {
        overviewEl.appendChild(overText);
      } else {
        overviewEl.textContent = 'Nessuna Descrizione!';
      }
      movieEl.appendChild(overviewEl);

      mainEl?.appendChild(movieEl);
    });
  } catch (err) {
    console.error(err);
  }
}

//^ Search listener

form.addEventListener('submit', async e => {
  e.preventDefault();
  const query = search?.value;
  if (query && query !== '') {
    search.value = '';
    currentUrl = `${SEARCH_URL}${query}`;
    mainEl.innerHTML = '';

    getMovies(currentUrl);
  }
});

pagesEl?.addEventListener('click', e => {
  page = e.target.textContent;
  currentUrl = currentUrl.replace(/page=\d+/, `page=${page}`);
  console.log(currentUrl);
  mainEl.innerHTML = '';
  getMovies(currentUrl);
});