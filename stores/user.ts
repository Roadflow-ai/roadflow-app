import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig } from 'nuxt/app'

export const useUserStore = defineStore('user', () => {
	const organizationId = ref(null)
	const token = useCookie('auth_token')
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

			const { access_token } = result.data || {}

			if (!access_token) {
				throw new Error('Token de autenticación no recibido')
			}

			token.value = access_token

			await fetchUser()

			return true
		} catch (error: any) {
			console.error('[Auth Error]', error)
			throw new Error(error.message || 'Error inesperado al iniciar sesión')
		}
	}

	async function fetchUser() {
		if (!token.value) {
			organizationId.value = null
			return
		}

		try {
			const res = await fetch(`${API}/api/v1/user/organizations`, {
				headers: {
					Authorization: `Bearer ${token.value}`
				}
			})

			if (!res.ok) {
				throw new Error('No se pudo obtener datos del usuario')
			}

			const userData = await res.json()

			organizationId.value = userData[0].organizationId
		} catch (error) {
			organizationId.value = null
			token.value = null
		}
	}

	function logout() {
		token.value = null
		organizationId.value = null
	}

	function isAuthenticated() {
		return Boolean(token.value)
	}

	return { organizationId, token, login, logout, isAuthenticated, fetchUser }
})
