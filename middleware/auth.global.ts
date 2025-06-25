import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { useUserStore } from "../stores/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchOrganizations, organization } = useUserStore();

  if (import.meta.client && !organization) {
    await fetchOrganizations();
  }

  const publicPages = ["/login", "/signup", "/verify", "/"];
  const authPages = ["/login", "/signup"];

  // Redirect authenticated users away from auth pages
  if (isAuthenticated() && authPages.includes(to.path)) {
    return navigateTo("/dashboard");
  }

  // Redirect unauthenticated users to login for protected pages
  if (!isAuthenticated() && !publicPages.includes(to.path)) {
    const redirectCookie = useCookie("redirectTo");
    redirectCookie.value = to.fullPath;
    return navigateTo("/login");
  }
});
