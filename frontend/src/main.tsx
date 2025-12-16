import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from '../public/redux/store/store';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

import './leafletIcons';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider
        
      >
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);

