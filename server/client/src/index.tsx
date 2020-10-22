import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import App from './App';

// Render the app
ReactDOM.render((<App/>),document.getElementById('root'));

// Can change to register to use service worker
serviceWorker.unregister();
