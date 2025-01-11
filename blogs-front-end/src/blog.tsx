import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Blogs from "./Blogs.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Blogs />
  </StrictMode>,
);
