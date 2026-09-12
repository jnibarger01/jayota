import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";

const el = document.getElementById("root");
if (!el) {
  throw new Error('GitHub Pages shell is missing #root');
}

const router = getRouter();

startTransition(() => {
  createRoot(el).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
});
