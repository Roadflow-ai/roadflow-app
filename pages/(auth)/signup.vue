<template>
	<div>
		<h2 class="text-center text-3xl capitalize font-extrabold text-gray-900">
			Create new account
		</h2>
	</div>
	<form class="mt-8 space-y-6" @submit.prevent="handleLogin">
		<div class="rounded-md shadow-sm -space-y-px">
			<div>
				<label for="firstname" class="sr-only">First Name</label>
				<input
					id="firstname"
					name="firstname"
					type="text"
					required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
					placeholder="First Name"
					v-model="form.firstname"
				/>
			</div>
			<div>
				<label for="lastname" class="sr-only">Last Name</label>
				<input
					id="lastname"
					name="lastname"
					type="text"
					required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
					placeholder="Last Name"
					v-model="form.lastname"
				/>
			</div>
			<div>
				<label for="email" class="sr-only">Email address</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
					placeholder="Email address"
					v-model="form.email"
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
					v-model="form.password"
				/>
			</div>
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
</template>

<script setup>
definePageMeta({
	layout: 'auth'
})
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
	firstname: '',
	lastname: '',
	email: '',
	password: ''
})

const handleLogin = () => {
	// TODO: Implement actual authentication
	router.push('/dashboard')
}
</script>
