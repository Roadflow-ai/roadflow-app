import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated() && !['/login', '/signup'].includes(to.path)) {
		return navigateTo('/login')
	}
})
