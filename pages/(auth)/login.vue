<template>
	<div class="flex flex-col items-center">
		<img src="/roadflow.png" alt="Roadflow Logo" class="mb-8 w-42 h-20 object-contain" />
		<h2 class="text-center text-3xl font-extrabold text-gray-900">
			Sign in 
		</h2>
	</div>
	<form class="mt-8 space-y-6" @submit.prevent="handleLogin">
		<div class="rounded-md shadow-sm -space-y-px">
			<div>
				<label for="email" class="sr-only">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
					placeholder="Email address"
					v-model="email"
				/>
			</div>
			<div>
				<label for="password" class="sr-only">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
					placeholder="Password"
					v-model="password"
				/>
			</div>
		</div>
		<div
			v-if="errorMessage"
			class="text-red-600 mt-2 text-center font-semibold"
		>
			{{ errorMessage }}
		</div>
		<div>
			<button
				type="submit"
				class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
			>
				Sign in
			</button>
		</div>
	</form>
	<p>
		Don't have an account?
		<NuxtLink to="/signup" class="text-green-500 font-bold"
			>Sign up here</NuxtLink
		>.
	</p>
</template>

<script setup>
definePageMeta({
	layout: 'auth'
})
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const email = ref('')
const password = ref('')
const { login } = useUserStore()

const errorMessage = ref('')

const handleLogin = async () => {
	errorMessage.value = ''
	try {
		await login(email.value, password.value)
		router.push('/dashboard')
	} catch (error) {
		errorMessage.value = error.message || 'Error en el login'
	}
}
</script>
