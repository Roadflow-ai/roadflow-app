import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useUserStore } from '../stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
	const { isAuthenticated } = useUserStore()

	if (!isAuthenticated() && !['/login', '/signup'].includes(to.path)) {
		return navigateTo('/login')
	}
})
