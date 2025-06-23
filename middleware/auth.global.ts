import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";
import { useUserStore } from "../stores/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, fetchOrganization, organization } = useUserStore();

  if (import.meta.client && !organization) {
    await fetchOrganization();
  }

  const publicPages = ["/login", "/signup", "/verify"];

  if (!isAuthenticated() && !publicPages.includes(to.path)) {
    const redirectCookie = useCookie("redirectTo");
    redirectCookie.value = to.fullPath;
    return navigateTo("/login");
  }
});
