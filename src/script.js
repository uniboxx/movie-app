const mainEl = document.querySelector(`#main`);
const form = document.querySelector(`#form`);
const search = document.querySelector(`#search`);
const paginate = document.querySelector(`.paginate`);
const pages = document.querySelectorAll(`.paginate ul li`);
const prev = document.querySelector(`#prev`);
const next = document.querySelector(`#next`);
const controls = document.querySelectorAll(`.button`);
const menuEls = document.querySelectorAll(`#menu li`);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

console.log(urlParams);

let resource = urlParams.get('resource') || 'movie';

const API_URL = `https://api.themoviedb.org/3/discover/${resource}?api_key=${
  import.meta.env.VITE_API_KEY
}&language=it&page=1/?resource=movie`;

const IMAGE_PATH = `https://image.tmdb.org/t/p/w300`;
const SEARCH_URL = API_URL.replace('discover', 'search') + '&query=';

console.log(resource);
let page = 1;
let pagePlus = page + 1;
let currentUrl = API_URL;
let nextUrl = API_URL.replace(/page=\d/, `page=${pagePlus}`);

function displayMsg(text) {
  mainEl.style.display = 'block';
  mainEl.innerHTML = '';
  mainEl.innerHTML = `<h1 style='text-align:center;color: #fff;font-size: 40px;'>${text}</h1>`;
  paginate.style.display = 'none';
}

function createPagination() {
  const paginationEl = document.createElement('li');
  const anchor = document.createElement('a');
  anchor.textContent = paginationEl;
  paginationEl.appendChild(anchor);
}

function highlight(page) {
  pages.forEach(el => {
    el.classList.remove('highlight');
  });
  pages[page - 1].classList.add('highlight');
}

next.addEventListener('click', e => {
  page++;
  goToPage(page);
});

prev.addEventListener('click', e => {
  page--;
  goToPage(page);
});

function goToPage(page) {
  currentUrl = currentUrl
    .replace(/page=\d+/, `page=${page}`)
    .replace(/resource=/, `?resource=${resource}`);
  nextUrl = currentUrl
    .replace(/page=\d+/, `page=${page + 1}`)
    .replace(/resource=/, `?resource=${resource}`);
  // highlight(page);
  getMedia(currentUrl, nextUrl);
}

//^ Get initial movies
displayMsg('Sto caricando....');
getMedia(currentUrl, nextUrl);

//^ GET MEDIA

async function getMedia(url, nextUrl) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results;
    const resPlus = await fetch(nextUrl);
    const dataPlus = await resPlus.json();
    const resultsPlus = dataPlus.results;
    if (!resultsPlus[0]) {
      next?.setAttribute('disabled', '');
    }
    if (!results[0]) {
      displayMsg(`Non sono stati trovati risultati!`);
      return;
    }
    // const movie = results[0];
    mainEl.innerHTML = '';
    mainEl.style.display = 'grid';
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
        imgEl.style.height = '375px';
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
      h3titleEl.innerText = movie.title || movie.name;
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
      if (resource === 'movie') Array.from(menuEls)[0].classList.add('high');
      if (resource === 'tv') menuEls[1].classList.add('high');
      mainEl.appendChild(movieEl);

      paginate.style.display = 'flex';
      if (page > 1) prev.removeAttribute('disabled');
      else prev.setAttribute('disabled', '');
    });
  } catch (err) {
    console.error(err);
  }
}

//^ Search listener

form.addEventListener('submit', e => {
  e.preventDefault();
  const query = search?.value;
  if (query && query !== '') {
    search.value = '';
    page = 1;
    currentUrl = `${SEARCH_URL}${query}`;
    console.log(currentUrl);
    displayMsg(`Ricerca in corso...`);
  }
  goToPage(page);
});

paginate?.addEventListener('click', e => {
  const pageEl = e.target.closest('LI');
  // console.log(pageEl);
  if (pageEl) {
    page = +pageEl.textContent;
    goToPage(page);
  }
});
