import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import AppTemplate from 'components/base/template/AppTemplate';
import { color } from 'styles/utils';
import moment from 'moment';
import { readRemoteFile } from 'react-papaparse';
import T from 'components/common/text/T';
import { useTranslation } from 'react-i18next';
import useAsync from 'lib/hooks/useAsync';
import axios from 'axios';
import { useDidUpdateEffect } from 'lib/utils';
import {
  atom,
  atomFamily,
  RecoilRoot,
  selector,
  selectorFamily,
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';

const Container = styled.div`
  position: relative;
  width: 460px;
  margin: 0 auto;
  margin-top: 100px;
  border: 1px solid #ddd;
`;
// const SvgContainer = styled.div`
//   background: ${`url(${teeth_v2_bg}) no-repeat center / cover`};
// `;

const getTodos = async () => {
  // const response = await axios.get('https://jsonplaceholder.typicode.com/todosa');
  // if (response.error) throw response.error;
  // return response.data;
  return await axios.get('https://jsonplaceholder.typicode.com/todos');
  // try {
  //   const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
  //   return response.data;
  // } catch (error) {
  //   throw error;
  // }
  // try {
  //   const response = await axios.get('https://jsonplaceholder.typicode.com/todosa');
  //   return [response.data, null];
  // } catch (error) {
  //   // console.log(error);
  //   // console.log(error.response.status);
  //   // console.log(error.message);
  //   return [null, error];
  // }
};

export default props => {
  // const [todo, setTodo] = useState('');
  const [{ loading, data: todosData, error: todosError }, refetchTodos] = useAsync(getTodos, []);

  const fetchTodos = async () => {
    // const response = await axios.get('https://jsonplaceholder.typicode.com/todosa');
    // console.log('response', response);
    // if (response.error) {
    //   console.log('response.error', response.error.response.status);
    //   throw response.error;
    // }
    // return response.data;
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      return response.data;
    } catch (error) {
      console.log('error', error.response.status);
      throw error;
    }
    // try {
    //   const [data, error] = await getTodos();
    //   // console.log(data[0]);
    //   setTodo(data[0]);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useDidUpdateEffect(() => {
    console.log('todosData', todosData);
    console.log('!!todosData?.length', !!todosData?.length);
    if (todosData) console.log('todosData[0]', todosData[0]);
    // setTodo(todosData[0]);
  }, [todosData]);

  useEffect(() => {
    console.log('todosData', todosData);
    fetchTodos();
  }, []);

  // useEffect(() => {
  //   console.log('langText', langText);
  //   // console.log('langText[1]', typeof langText[1]);
  //   // console.log('langText[1]', langText[1]?.Test);
  // }, [langText]);

  const { t } = useTranslation();

  return (
    <RecoilRoot>
      <React.Suspense fallback={'...로딩중'}>
        <AppTemplate title={'Jun'}>
          <Container>
            {/* {todosData?.map(item => (
            <p key={item.id}>{item.title}</p>
          ))} */}
            <hr />
            {/* {!!todosData?.length && todosData.map(item => <p key={item.id}>{item.title}</p>)} */}
            {/* <ul>{langText[1]?.Test}</ul>
        <ul>{langText[2]?.Test2}</ul> */}
            {/* <T>Transactions</T>
        <br />
        {t('Test', { username: 'jun', date: '05-11' })} */}
            <Todo></Todo>
          </Container>
        </AppTemplate>
      </React.Suspense>
    </RecoilRoot>
  );
};

const getTodo = id => {
  return axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
};

const todoState = atom({
  key: 'todo/todo',
  default: null,
});

// const getTodoState = atomFamily({
//   key: 'todo/getTodoState',
//   default: selector({
//     key: 'todo/getTodoState/default',
//     get: id => async () => {
//       try {
//         const response = await getTodo(id);
//         console.log('response.data', response.data);
//         return response.data;
//       } catch (error) {
//         throw error;
//       }
//     },
//   }),
// });

const getTodoState = atomFamily({
  key: 'todo/getTodoState',
  default: id => getTodo(id),
});

const todoQuery = selectorFamily({
  key: 'todo/getTodo',
  get: id => async () => {
    try {
      const response = await getTodo(id);
      console.log('response', response);
      console.log('response.data', response.data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  // set: ({ set }, newValue) => {
  //   set(todoState, newValue);
  // },
  set: ({ set }, newValue) => {
    set(todoState, newValue);
  },
});

// const fetchTodo = () => {
//   // const { state, contents } = useRecoilValueLoadable(todoQuery(1));
//   // return { state, contents };

//   const todoLoadable = useRecoilValueLoadable(todoQuery(1));

//   return () => ({ state: todoLoadable.state, contents: todoLoadable.contents });
//   // const returnValue = () => {
//   // };

//   // return returnValue;
// };

const useTodo = () => {
  // const setTodo = useSetRecoilState(todoState);
  const [todo, setTodo] = useRecoilState(todoState);
  // state: { loading: getTodoLoading, data: getTodoData, error: getTodoError },
  // const [
  //   getTodoState,
  //   refetchTodo,
  // ] = useAsync(getTodo(1), [], true);

  const fetchTodoQuery = async id => {
    const { data } = await getTodo(id);
    setTodo(data);
  };

  const fetchTodo = async id => {
    const { data } = await getTodo(id);
    setTodo(data);
  };

  const editTodo = title => {
    setTodo({
      title,
    });
  };

  return { todo, setTodo, getTodoState, fetchTodo, editTodo };
};

export const Todo = () => {
  // const [todo, setTodo] = useRecoilState(todoState);
  // const todo1 = useRecoilState(todoQuery(1));
  // const [todo1, setTodo1] = useRecoilState(getTodoState(1));
  // const todo1 = useRecoilValueLoadable(todoQuery(1));
  const [number, setNumber] = useState(1);
  const { data: todo1 } = useRecoilValue(todoQuery(number));
  const { todo, setTodo, editTodo } = useTodo();

  // const getTodo = id => {
  //   return useRecoilValue(todoQuery(1));
  // };

  const handleEditTodo = useRecoilCallback(({ snapshot, set }) => id => {
    console.log(
      'snapshot.getLoadable(todoQuery(id))',
      snapshot.getLoadable(todoQuery(id)).contents,
    );
    snapshot.getLoadable(todoQuery(id)); // pre-fetch user info
    // const gotoSnapshot = useGotoRecoilSnapshot()(snapshot.getLoadable(todoQuery(id).contents));
    // setTodo(snapshot.getLoadable(todoQuery(id)).contents);
    // set(todoState, snapshot.getLoadable(todoQuery(id)).contents);
    // console.log("State: ", snapshot.getLoadable(myAtom).contents);
    // set(todoQuery)
    // set(currentUserIDState, userID); // change current user to start new render
  });

  // const editTodo = title => {
  //   setTodo({
  //     title,
  //   });
  // };
  const handleNumber = () => {
    setNumber(draft => draft + 1);
  };

  useEffect(() => {
    // useRecoilState(todoQuery(2));
    // fetchTodo(1);
    // setTodo1(2);
    handleEditTodo(3);

    // editTodo('jun');
  }, []);

  return (
    <>
      <div>todo1: {todo1?.title}</div>
      <div>todo: {todo?.title}</div>
      <button onClick={handleNumber}>HandleNumber</button>
      {/* <button onClick={() => handleEditTodo(5)}>handleEditTodo</button> */}
    </>
  );
};
