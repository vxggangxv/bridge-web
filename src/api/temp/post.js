// n 밀리세컨드동안 기다리는 프로미스를 만들어주는 함수
let sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

// 가짜 포스트 목록 데이터
let posts = [
  {
    id: 1,
    title: '리덕스 미들웨어를 배워봅시다',
    body: '리덕스 미들웨어를 직접 만들어보면 이해하기 쉽죠.',
    // createdAt: Date.now() - 1
    createdAt: Date.now(),
  },
  {
    id: 2,
    title: 'redux-thunk를 사용해봅시다',
    body: 'redux-thunk를 사용해서 비동기 작업을 처리해봅시다!',
    // createdAt: Date.now()
    createdAt: Date.now() - 1,
  },
  {
    id: 3,
    title: 'redux-saga도 사용해봅시다',
    body:
      '나중엔 redux-saga를 사용해서 비동기 작업을 처리하는 방법도 배워볼 거예요.',
    createdAt: Date.now() - 2,
  },
];

export const createPost = async (data) => {
  await sleep(500); // 0.5초 쉬고
  const lastItem = posts.sort((a, b) => b.id - a.id)[0];
  data.id = lastItem ? lastItem.id + 1 : 1;
  data.createAt = Date.now();
  posts = [data, ...posts];
};

// 포스트 목록을 가져오는 비동기 함수
export const fetchPosts = async () => {
  await sleep(500);
  return posts.sort((a, b) => b.createdAt - a.createdAt); // posts 배열
};

// ID로 포스트를 조회하는 비동기 함수
export const fetchPostById = async (id) => {
  await sleep(500);
  return posts.find((post) => post.id === id); // id 로 찾아서 반환
};

export const editPostById = async (id, data) => {
  await sleep(500);
  const idx = posts.findIndex((post) => post.id === id);
  if (idx > -1) posts.splice(idx, 1, data);
};

export const deletePostById = async (id) => {
  await sleep(500);
  const idx = posts.findIndex((post) => post.id === id);
  if (idx > -1) posts.splice(idx, 1);
};

// import axios from 'axios';

// fetchPosts, fetchPostById, createPost, editPostById, deletePostById

// export const fetchPosts = async () => {
//   const response = await axios.get('/posts');
//   return response.data;
// };

// export const fetchPostById = async id => {
//   const response = await axios.get(`/posts/${id}`);
//   return response.data;
// };
