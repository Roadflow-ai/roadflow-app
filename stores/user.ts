import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig } from 'nuxt/app'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
	const organizationId = ref(null)
	const organization = ref<any>(null)
	const token = useCookie('auth_token')
	const userData = ref<any>(null)
	const config = useRuntimeConfig()
	const API = config.public.apiUrl

	async function login(email: string, password: string) {
		try {
			const res = await fetch(`${API}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})

			const result = await res.json()

			if (!res.ok) {
				const message = result.message || 'Credenciales inválidas'
				throw new Error(message)
			}

			const data = result.data || {}
			const { access_token } = data

			if (!access_token) {
				throw new Error('Token de autenticación no recibido')
			}

			token.value = access_token
			userData.value = data

			// Obtener la organización después del login
			await fetchOrganization()

			return true
		} catch (error: any) {
			console.error('[Auth Error]', error)
			throw new Error(error.message || 'Error inesperado al iniciar sesión')
		}
	}

	async function fetchOrganization() {
		if (!token.value) {
			organizationId.value = null
			organization.value = null
			return
		}

		try {
			const res = await fetch(`${API}/api/v1/user/organizations`, {
				headers: {
					Authorization: `Bearer ${token.value}`
				}
			})

			if (!res.ok) {
				throw new Error('No se pudo obtener datos de la organización')
			}

			const orgs = await res.json()
			organizationId.value = orgs[0]?.organizationId || null
			organization.value = orgs[0]?.organization || null
		} catch (error) {
			organizationId.value = null
			organization.value = null
			token.value = null
		}
	}

	function logout() {
		token.value = null
		organizationId.value = null
		organization.value = null
		userData.value = null
	}

	function isAuthenticated() {
		return Boolean(token.value)
	}

	const authorizationHeader = computed(() => {
		if (userData.value?.access_token) {
			return `Bearer ${userData.value.access_token}`
		}
		return ''
	})

	return { organizationId, organization, token, login, logout, isAuthenticated, fetchOrganization, userData, authorizationHeader }
})
