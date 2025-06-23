<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
			<h2 class="text-2xl font-bold text-gray-800 mb-4">
				Invitación a la organización
			</h2>

			<div v-if="pending" class="text-gray-600">Validando invitación...</div>

			<div v-else-if="error" class="text-red-600 font-semibold">
				{{ error }}
			</div>

			<div v-else class="text-green-700 text-lg font-medium">
				¡Ahora formas parte de la organización!
			</div>
		</div>
	</div>
</template>

<script setup>
useSeoMeta({
	title: 'Join Organization',
	description: 'Join an organization using the invitation link.'
})
import { useRoute } from 'nuxt/app'

const { token } = useRoute().query

const { pending, error } = await useApi(`organization/invite/${token}`)
</script>
