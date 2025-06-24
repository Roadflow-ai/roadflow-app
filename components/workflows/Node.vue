<template>
	<div
		:class="[
			'bg-white rounded-lg border hover:shadow-md w-full relative transition-all duration-200 group',
			isHead ? 'border-green-200 hover:border-green-300 shadow-green-50' :
			isTask ? 'border-gray-200 hover:border-gray-300' :
			'border-blue-200 hover:border-blue-300 shadow-blue-50'
		]"
		@mouseleave="menuOpen = false"
	>
		<!-- Header -->
		<div class="p-4 flex items-center justify-between">
			<div class="flex items-center gap-3 flex-1 min-w-0">
				<!-- Node Type Dot -->
				<div :class="[
					'w-3 h-3 rounded-full flex-shrink-0',
					isHead ? 'bg-green-500' :
					isTask ? 'bg-gray-400' :
					'bg-blue-500'
				]"></div>
				
				<!-- Content -->
				<div class="flex-1 min-w-0">
					<h3 class="font-medium text-gray-900 text-sm truncate mb-1">{{ title }}</h3>
					<div class="flex items-center gap-2 text-xs text-gray-500">
						<span :class="[
							'uppercase tracking-wide font-medium',
							isHead ? 'text-green-600' :
							isTask ? 'text-gray-600' :
							'text-blue-600'
						]">
							{{ isHead ? 'HEAD' : isTask ? 'TASK' : 'AGENT' }}
						</span>
						<span v-if="executionOrder" class="text-gray-300">•</span>
						<span v-if="executionOrder" class="text-gray-600 font-medium">Step {{ executionOrder }}</span>
						<span v-if="agent || function_name" class="text-gray-300">•</span>
						<span v-if="agent" class="capitalize truncate">{{ agent }}</span>
						<span v-else-if="function_name" class="font-mono truncate">{{ function_name }}</span>
					</div>
				</div>
			</div>
			
			<!-- Menu Button -->
			<button
				aria-label="Node menu"
				type="button"
				class="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all flex-shrink-0"
				@click="toggleMenu"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
				</svg>
			</button>

			<!-- Dropdown Menu -->
			<div
				v-show="menuOpen"
				class="absolute top-12 right-4 bg-white border border-gray-200 rounded-lg shadow-xl w-32 z-50 py-1"
			>
				<button
					@click="handleEdit"
					class="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
					type="button"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
					</svg>
					Edit
				</button>
				<button
					v-if="!isHead"
					@click="handleDelete"
					class="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
					type="button"
				>
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Delete
				</button>
			</div>
		</div>

		<!-- Parameters (Minimal) -->
		<div v-if="Object.keys(parameters || {}).length" class="px-4 pb-4">
			<div class="pt-3 border-t border-gray-100">
				<div class="text-xs text-gray-500 mb-2">Parameters</div>
				<div class="space-y-1">
					<div v-for="(value, key) in parameters" :key="key" class="flex items-center gap-2 text-xs">
						<span class="text-gray-600 font-medium capitalize w-16 truncate">{{ key }}</span>
						<span class="text-gray-400">:</span>
						<span class="text-gray-800 truncate flex-1">{{ value }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Edit Modals -->
		<WorkflowsEditNode
			v-if="isTask"
			:open="showModal"
			@close="showModal = false"
			:nodeId="nodeId"
			@edited="emit('edited', $event)"
		/>
		<WorkflowsEditNodeAgent
			v-else
			:open="showModal"
			@close="showModal = false"
			:nodeId="nodeId"
			@edited="emit('edited', $event)"
		/>
		<WorkflowsDeleteNode
			:open="showDeleteModal"
			@close="showDeleteModal = false"
			:nodeId="nodeId"
			@deleted="emit('deleted', $event)"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	nodeId: String,
	title: String,
	agent: String,
	function_name: String,
	isHead: Boolean,
	isTask: Boolean,
	parameters: Object,
	executionOrder: Number
})
const emit = defineEmits(['edited', 'deleted'])

const showModal = ref(false)
const showDeleteModal = ref(false)
const menuOpen = ref(false)

function toggleMenu() {
	menuOpen.value = !menuOpen.value
}

function openModal() {
	showModal.value = true
	menuOpen.value = false
}

function handleEdit() {
	openModal()
}

function handleDelete() {
	showDeleteModal.value = true
	menuOpen.value = false
}
</script>
