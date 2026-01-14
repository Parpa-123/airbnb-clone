import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from '../public/redux/store/store';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import './leafletIcons';

const isDev = import.meta.env.MODE === 'development';

const AppWrapper = isDev ? React.StrictMode : React.Fragment;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppWrapper>
    <Provider store={store}>
      <MantineProvider

      >
        <App />
      </MantineProvider>
    </Provider>
  </AppWrapper>
);
