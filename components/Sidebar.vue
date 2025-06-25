<template>
	<aside class="w-60 h-full bg-gray-100 py-6 flex flex-col">
		<!-- Organization Selector -->
		<div class="px-4 pb-4 border-b border-gray-200 mb-4">
			<div class="relative" v-if="organizations.length > 1">
				<button
					@click="showOrgDropdown = !showOrgDropdown"
					class="w-full flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
				>
					<div class="flex items-center space-x-2">
						<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
							<span class="text-white text-sm font-medium">
								{{ organization?.name?.charAt(0).toUpperCase() || 'O' }}
							</span>
						</div>
						<div class="text-left">
							<p class="text-sm font-medium text-gray-900">{{ organization?.name || 'Organization' }}</p>
							<p class="text-xs text-gray-500">{{ organizations.length }} organizations</p>
						</div>
					</div>
					<svg class="w-4 h-4 text-gray-400" :class="{ 'rotate-180': showOrgDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				<!-- Dropdown -->
				<div v-if="showOrgDropdown" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
					<button
						v-for="org in organizations"
						:key="org.organizationId"
						@click="handleOrgSwitch(org.organizationId)"
						class="w-full flex items-center space-x-2 p-3 hover:bg-gray-50 transition-colors text-left"
						:class="{ 'bg-green-50 border-l-2 border-green-500': org.organizationId === organizationId }"
					>
						<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
							<span class="text-white text-xs font-medium">
								{{ org.organization?.name?.charAt(0).toUpperCase() || 'O' }}
							</span>
						</div>
						<div>
							<p class="text-sm font-medium text-gray-900">{{ org.organization?.name || 'Organization' }}</p>
							<p class="text-xs text-gray-500">{{ org.organizationId }}</p>
						</div>
						<div v-if="org.organizationId === organizationId" class="ml-auto">
							<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</div>
					</button>
				</div>
			</div>

			<!-- Single Organization Display -->
			<div v-else-if="organization" class="flex items-center space-x-2 p-3 bg-white rounded-lg border">
				<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
					<span class="text-white text-sm font-medium">
						{{ organization?.name?.charAt(0).toUpperCase() || 'O' }}
					</span>
				</div>
				<div>
					<p class="text-sm font-medium text-gray-900">{{ organization?.name || 'Organization' }}</p>
					<p class="text-xs text-gray-500">Current organization</p>
				</div>
			</div>
		</div>

		<!-- Navigation Menu -->
		<nav class="space-y-2 flex-1">
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const userStore = useUserStore()
const basePath = '/dashboard'
const activeRoute = computed(() => route.path)
const showOrgDropdown = ref(false)

// Reactive references to store data
const organizationId = computed(() => userStore.organizationId)
const organization = computed(() => userStore.organization)
const organizations = computed(() => userStore.organizations)

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

function handleOrgSwitch(orgId) {
	userStore.switchOrganization(orgId)
	showOrgDropdown.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
	if (!event.target.closest('.relative')) {
		showOrgDropdown.value = false
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside)
})
</script>
