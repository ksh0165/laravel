import React from 'react';
import {createRoot}  from 'react-dom/client';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './modules/index';
const store =createStore(rootReducer);
const root = createRoot(document.getElementById("root"))
root.render
(
  <Provider store={store}>
    <App />
  </Provider>
)