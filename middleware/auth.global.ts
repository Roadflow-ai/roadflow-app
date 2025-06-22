import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useUserStore } from '../stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { isAuthenticated, fetchOrganization, organization } = useUserStore()

	if (import.meta.client && !organization) {
		await fetchOrganization()
	}

	if (!isAuthenticated() && !['/login', '/signup'].includes(to.path)) {
		return navigateTo('/login')
	}
})
