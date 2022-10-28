import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./components/App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

let windowHeight = 0;
window.addEventListener("resize", () => {
  let newHeight =
    typeof window.visualViewport !== "undefined"
      ? window.visualViewport.height
      : window.innerHeight;
  if (windowHeight !== newHeight) {
    windowHeight = newHeight;
    rootElement.style.height = newHeight + "px";
  }
});

root.render(<App />);
