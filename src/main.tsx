import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GardenProvider } from './state';
import App from './App';
import './styles.css';
import './redesign.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><GardenProvider><App/></GardenProvider></BrowserRouter></React.StrictMode>);
