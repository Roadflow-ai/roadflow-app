<template>
	<aside class="w-60 h-full bg-gray-100 py-6">
		<nav class="space-y-2">
			<NuxtLink
				v-for="(item, index) in menuItems"
				:key="index"
				:to="`${basePath}/${item.path}`"
				class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-200 rounded-lg transition-colors"
				:class="{
					'bg-green-100': activeRoute === `${basePath}/${item.path}`
				}"
			>
				<component :is="item.icon" class="w-5 h-5 text-gray-600" />
				<span class="text-gray-800">{{ item.label }}</span>
			</NuxtLink>
		</nav>
	</aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const basePath = '/dashboard'
const activeRoute = computed(() => route.path)

const menuItems = [
	{ label: 'Home', path: '', icon: 'HomeIcon' },
	{ label: 'Workflows', path: 'workflows', icon: 'WorkflowIcon' },
	{ label: 'Logs', path: 'logs', icon: 'LogsIcon' },
	{ label: 'Roadmap', path: 'roadmap', icon: 'RoadIcon' },
	{ label: 'Engineering', path: 'engineering', icon: 'CodeIcon' },
	{ label: 'Product', path: 'product', icon: 'ProductIcon' },
	{ label: 'Operations', path: 'operations', icon: 'OperationsIcon' },
	{ label: 'Customer Success', path: 'success', icon: 'CustomerIcon' },
	{ label: 'Growth', path: 'growth', icon: 'GrowthIcon' },
	{ label: 'Settings', path: 'settings', icon: 'SettingsIcon' }
]
</script>
