import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.scss';
import App from './App';
import {createRoot} from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <div className="video-container">
        <video src={process.env.PUBLIC_URL + `/videos/city.mp4`} autoPlay loop muted className='video-bg'/>
      </div>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
)
