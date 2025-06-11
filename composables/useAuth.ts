import { useCookie, useRuntimeConfig } from 'nuxt/app'
import { ref } from 'vue'

const user = ref(null)

export function useAuth() {
	const config = useRuntimeConfig()
	const API = config.public.apiUrl
	const token = useCookie('auth_token')

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

			const { access_token, ...userData } = result.data || {}

			if (!access_token) {
				throw new Error('Token de autenticación no recibido')
			}

			token.value = access_token
			user.value = userData

			return true
		} catch (error) {
			console.error('[Auth Error]', error)
			throw new Error(error.message || 'Error inesperado al iniciar sesión')
		}
	}

	function logout() {
		token.value = null
		user.value = null
	}

	function isAuthenticated() {
		return Boolean(token.value)
	}

	return { user, login, logout, isAuthenticated }
}
