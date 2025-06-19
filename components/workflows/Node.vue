<template>
	<div class="bg-white p-4 rounded-xl shadow-sm w-fit">
		<h3 class="font-medium text-gray-900 mb-2">{{ title }}</h3>
		<p class="text-sm text-gray-600 mb-4">{{ description }}</p>
		<button
			class="bg-green-50 text-green-700 rounded-md px-3 py-1 hover:bg-green-100"
		>
			View
		</button>
	</div>
</template>

<script setup>
defineProps({
	title: String,
	description: String
})
</script>
