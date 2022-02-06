import React from 'react';
import { HashRouter, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import store, { persistor } from 'store';
import 'lang/i18n';
import { PersistGate } from 'redux-persist/integration/react';
import { AppProvider } from 'contexts/AppContext';
import { ENV_MODE_PROD } from 'lib/setting';
// import { hot } from 'react-hot-loader/root';

// let Router = HashRouter;
// Router = BrowserRouter;
// if (ENV_MODE_PROD) {
//   Router = BrowserRouter;
// }

if (ENV_MODE_PROD) console.log = () => {};

function Root(props) {
  return (
    <Router basename="/">
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <AppProvider>
          <App />
        </AppProvider>
        {/* </PersistGate> */}
      </Provider>
    </Router>
  );
}

// export default hot(Root);
export default Root;
