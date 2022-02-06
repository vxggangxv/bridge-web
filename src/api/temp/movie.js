import { movies } from './index';

export const fetchMoviesNowPlaying = () => {
  return movies.get('movie/now_playing');
};
export const fetchMoviesUpcoming = () => {
  return movies.get('movie/upcoming');
};
export const fetchMoviesPopular = () => {
  return movies.get('movie/popular');
};

export const fetchMovieById = (id) => {
  return movies.get(`movie/${id}`, {
    params: {
      append_to_response: 'videos',
    },
  });
};

//   upcoming: () => instance.get('movie/upcoming'),
//   popular: () => instance.get('movie/popular'),
//   movieDetail: (id) =>
//     instance.get(`movie/${id}`, {
//       params: {
//         append_to_response: 'videos',
//       },
//     }),
//   search: (term) =>
//     instance.get('search/movie', {
//       params: {
//         query: encodeURIComponent(term),
//       },
//     }),
// };
