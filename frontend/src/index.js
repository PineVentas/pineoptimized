import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

console.log("Iniciando Pine Opti...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("No se encontró el elemento root");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
