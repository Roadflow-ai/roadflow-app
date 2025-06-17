export const useApi = async <T>(
	endpoint: string,
	options: any = {},
	retries = 0
) => {
	const config = useRuntimeConfig()
	const baseURL = config.public.apiUrl || 'http://localhost:3000'
	const token = useCookie('auth_token')
	try {
		return await useFetch<T>(`${baseURL}/api/v1/${endpoint}`, {
			server: false,
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options.headers || {}),
				...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
			}
		})
	} catch (e: any) {
		console.error(e)
		if (e?.status === 403 || e?.status === 401) {
			console.log('Refreshing session...')
			try {
				if (retries > 3) {
					throw new Error('Max retries exceeded')
				}
				return await useApi(endpoint, options, retries + 1)
			} catch (refreshError) {
				console.error('Failed to refresh session:', refreshError)
			}
		}
		console.error('Failed to fetch data:', e)
	}
}
