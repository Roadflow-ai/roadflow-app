<template>
	<div
		class="bg-white p-5 rounded-xl shadow-sm w-full relative min-h-44 flex flex-col justify-between"
		@mouseleave="menuOpen = false"
	>
		<header class="flex items-start justify-between gap-4">
			<h3 class="font-medium text-gray-900">{{ title }}</h3>
			<template v-if="isTask">
				<button
					aria-label="Abrir menú"
					type="button"
					class=""
					@click="toggleMenu"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 flex text-gray-600"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<circle cx="5" cy="12" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="19" cy="12" r="2" />
					</svg>
				</button>

				<div
					v-show="menuOpen"
					class="absolute top-10 right-5 bg-gray-50 border rounded shadow-md w-36 z-50 transition-opacity duration-150"
				>
					<button
						@click="handleEdit"
						class="block w-full text-left px-4 py-2 hover:bg-gray-200 text-gray-700 focus:outline-none"
						type="button"
					>
						Editar
					</button>
					<button
						@click="handleDelete"
						class="block w-full text-left px-4 py-2 hover:bg-red-200 hover:rounded-b text-red-600 focus:outline-none"
						type="button"
					>
						Eliminar
					</button>
				</div>
			</template>
		</header>

		<div class="flex-1 mt-1">
			<p v-if="agent" class="text-sm text-gray-600 mb-4 capitalize">
				agent: {{ agent }}
			</p>

			<p v-if="function_name" class="text-sm text-gray-600 mb-4 capitalize">
				function: {{ function_name }}
			</p>

			<p
				v-if="Object.keys(parameters).length"
				class="text-sm text-gray-600 mb-4 capitalize"
			>
				parameters: {{ parameters }}
			</p>
		</div>

		<footer>
			<span
				v-if="isHead"
				class="bg-green-50 text-green-700 rounded-md px-3 py-1 text-sm"
			>
				Head
			</span>
			<span
				v-else
				class="bg-gray-50 text-gray-700 rounded-md px-3 py-1 text-sm"
			>
				Task
			</span>
		</footer>

		<!-- Modal WorkflowsEditNode -->
		<WorkflowsEditNode
			:open="showModal"
			@close="showModal = false"
			:nodeId="nodeId"
			@edited="emit('eddited', $event)"
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
	parameters: String
})
const emit = defineEmits(['edited', 'delete'])

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
