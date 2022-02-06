import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
// import customLogger from 'store/customLogger';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import storage from 'redux-persist/lib/storage/session';
import { keys } from 'lib/storage';
import rootReducer, { rootSaga } from 'store/modules';
// import rootSaga from 'store/sagas';
import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';

const persistConfig = {
  key: keys.persist,
  storage,
  // whitelist: [],
  blacklist: ['app', 'base', 'auth', 'user', 'bin', 'project'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
let middlewares = [sagaMiddleware];

if (ENV_MODE_DEV) {
  middlewares = [...middlewares, logger];
}

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
const enhancers = composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(rootReducer, enhancers);
// const store = createStore(persistedReducer, enhancers);
// export const persistor = persistStore(store);
sagaMiddleware.run(rootSaga);

export default store;
