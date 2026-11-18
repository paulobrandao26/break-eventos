import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import "@fontsource/dela-gothic-one/400.css";
import "@fontsource-variable/bricolage-grotesque/index.css";
import "@/shared/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
