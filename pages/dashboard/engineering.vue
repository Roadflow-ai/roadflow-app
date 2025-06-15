<template>
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-2xl font-semibold text-gray-900">Engineering</h1>
		<div class="flex space-x-4">
			<button
				class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800"
			>
				New Content
			</button>
			<button
				class="border border-green-700 text-green-700 px-4 py-2 rounded-full hover:bg-green-50"
			>
				Connect Source
			</button>
		</div>
	</div>

	<div class="space-y-8">
		<div>
			<h2 class="text-xl font-semibold mb-4">API Documentation</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ContentCard
					v-for="(item, index) in apiDocs"
					:key="index"
					:title="item.title"
					:description="item.description"
					:image="item.image"
				/>
			</div>
		</div>

		<div>
			<h2 class="text-xl font-semibold mb-4">Code Documentation</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ContentCard
					v-for="(item, index) in codeDocs"
					:key="index"
					:title="item.title"
					:description="item.description"
					:image="item.image"
				/>
			</div>
		</div>

		<div>
			<h2 class="text-xl font-semibold mb-4">Changelog</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ContentCard
					v-for="(item, index) in changelogs"
					:key="index"
					:title="item.title"
					:description="item.description"
					:image="item.image"
				/>
			</div>
		</div>

		<div>
			<h2 class="text-xl font-semibold mb-4">Internal Documentation</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ContentCard
					v-for="(item, index) in internalDocs"
					:key="index"
					:title="item.title"
					:description="item.description"
					:image="item.image"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
const apiDocs = [
	{
		title: 'Authentication API',
		description: 'Complete documentation for our authentication endpoints',
		image: 'https://via.placeholder.com/400x200'
	}
	// Add more items...
]

const codeDocs = [
	{
		title: 'Frontend Architecture',
		description: 'Detailed guide on our frontend code structure',
		image: 'https://via.placeholder.com/400x200'
	}
	// Add more items...
]

const changelogs = [
	{
		title: 'v2.0 Release Notes',
		description: 'Major updates and improvements',
		image: 'https://via.placeholder.com/400x200'
	}
	// Add more items...
]

const internalDocs = [
	{
		title: 'Team Guidelines',
		description: 'Internal team documentation and best practices',
		image: 'https://via.placeholder.com/400x200'
	}
	// Add more items...
]
</script>
