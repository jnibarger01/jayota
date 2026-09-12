import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent, NotFoundComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  // Vite BASE_URL is "/" or "/jayota/". Router basepath must be absolute path form.
  const raw =
    typeof import.meta !== "undefined" && typeof import.meta.env?.BASE_URL === "string"
      ? import.meta.env.BASE_URL
      : "/";
  let basepath = raw || "/";
  if (basepath !== "/" && basepath.endsWith("/")) basepath = basepath.slice(0, -1);
  if (basepath && !basepath.startsWith("/")) basepath = `/${basepath}`;

  return createRouter({
    routeTree,
    basepath,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
  });
}
