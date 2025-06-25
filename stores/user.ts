import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig } from 'nuxt/app'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
	const organizationId = ref<string | null>(null)
	const organization = ref<any>(null)
	const organizations = ref<any[]>([])
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

			// Obtener las organizaciones después del login
			await fetchOrganizations()

			return true
		} catch (error: any) {
			console.error('[Auth Error]', error)
			throw new Error(error.message || 'Error inesperado al iniciar sesión')
		}
	}

	async function fetchOrganizations() {
		if (!token.value) {
			organizationId.value = null
			organization.value = null
			organizations.value = []
			return
		}

		try {
			const res = await fetch(`${API}/api/v1/user/organizations`, {
				headers: {
					Authorization: `Bearer ${token.value}`
				}
			})

			if (!res.ok) {
				throw new Error('No se pudo obtener datos de las organizaciones')
			}

			const orgsData = await res.json()
			organizations.value = orgsData || []
			
			// If no current organization selected, select the first one
			if (!organizationId.value && orgsData.length > 0) {
				switchOrganization(orgsData[0].organizationId)
			} else if (organizationId.value) {
				// Ensure current organization is still valid
				const currentOrg = orgsData.find((org: any) => org.organizationId === organizationId.value)
				if (currentOrg) {
					organization.value = currentOrg.organization
				} else {
					// Current org no longer exists, switch to first available
					if (orgsData.length > 0) {
						switchOrganization(orgsData[0].organizationId)
					} else {
						organizationId.value = null
						organization.value = null
					}
				}
			}
		} catch (error) {
			console.error('Error fetching organizations:', error)
			organizationId.value = null
			organization.value = null
			organizations.value = []
		}
	}

	function switchOrganization(orgId: string) {
		const targetOrg = organizations.value.find((org: any) => org.organizationId === orgId)
		if (targetOrg) {
			organizationId.value = orgId
			organization.value = targetOrg.organization
		}
	}

	function logout() {
		token.value = null
		organizationId.value = null
		organization.value = null
		organizations.value = []
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

	return { 
		organizationId, 
		organization, 
		organizations, 
		token, 
		login, 
		logout, 
		isAuthenticated, 
		fetchOrganizations, 
		switchOrganization, 
		userData, 
		authorizationHeader 
	}
}, {
	persist: {
		paths: ['organizationId', 'organization', 'organizations', 'userData'],
		storage: typeof window !== 'undefined' ? localStorage : undefined
	}
})
