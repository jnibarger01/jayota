import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const el = document.getElementById("root");
if (!el) {
  throw new Error('GitHub Pages shell is missing #root');
}

startTransition(() => {
  createRoot(el).render(
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
