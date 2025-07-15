import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const settings = JSON.parse(localStorage.getItem("typingSettings")) || {};
const theme = settings.theme || "material"; // fallback if not set
// console.log(settings);

// Dynamically load the CSS file
const link = document.createElement("link");
link.rel = "stylesheet";
link.id = "style";
link.href = `./src/${theme.charAt(0).toUpperCase() + theme.slice(1)}.css`; // e.g. ./Brutal.css
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
