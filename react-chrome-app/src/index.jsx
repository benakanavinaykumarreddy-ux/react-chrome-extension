import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import './colors.css';

const rootElement = document.createElement("div");
rootElement.id = "react-chrome-app";

const globalStyles = document.createElement("style");
globalStyles.innerHTML = `
  #${rootElement.id} {
  position: fixed;
  right: auto;
  top: 0;
  width: 15rem;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #c2c2c2;
  border-right: 1px solid #c2c2c2;
  z-index: 9999;
  float: right;
  overflow: hidden;
  }
`;
document.body.appendChild(rootElement);
document.body.appendChild(globalStyles);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
