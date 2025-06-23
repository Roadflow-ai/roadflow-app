<template>
	<div
		v-if="organization && organization.name"
		class="text-xl font-semibold text-green-900 mb-2"
	>
		{{ organization.name }}
	</div>
	Communication that moves at the speed of your product

	<section>
		<h2 class="text-xl font-semibold my-4">Users</h2>

		<ul v-if="organization.users">
			<li v-for="user in organization.users">
				{{ user }}
			</li>
		</ul>

		<div v-else>
			<p>There's no users</p>
			<button
				class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800"
			>
				Invite someone
			</button>
		</div>
	</section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { organization } = storeToRefs(userStore)

useSeoMeta({
	title: 'RoadFlow AI'
})
</script>
