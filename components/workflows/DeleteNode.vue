<template>
	<ModalWrapper v-if="open">
		<div class="text-center">
			<div
				class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"
			>
				<svg
					class="h-6 w-6 text-red-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
					/>
				</svg>
			</div>

			<h2 class="text-lg font-semibold text-gray-900 mb-2">Delete Node</h2>

			<p class="text-sm text-gray-500 mb-6">
				Are you sure you want to delete this Node? This action cannot be undone.
			</p>

			<div class="flex justify-center space-x-3">
				<button
					type="button"
					@click="handleCancel"
					class="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
				>
					Cancel
				</button>
				<button
					type="button"
					@click="handleDelete"
					:disabled="isDeleting"
					:class="[
						'px-4 py-2 rounded-full transition-colors',
						isDeleting
							? 'bg-gray-400 text-gray-200 cursor-not-allowed'
							: 'bg-red-500 text-white hover:bg-red-700'
					]"
				>
					{{ isDeleting ? 'Deleting...' : 'Delete' }}
				</button>
			</div>
		</div>
	</ModalWrapper>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	nodeId: {
		type: String,
		required: false
	}
})

const emit = defineEmits(['close', 'deleted'])
const { organizationId } = useUserStore()
const isDeleting = ref(false)

const handleDelete = async () => {
	if (!props.nodeId) {
		console.error('No workflow ID provided')
		return
	}

	isDeleting.value = true

	try {
		await useApi(`workflow/${organizationId}/node/${props.nodeId}`, {
			lazy: true,
			method: 'DELETE'
		})
		emit('deleted')
		handleCancel()
	} catch (error) {
		console.error('Delete error:', error)
	} finally {
		isDeleting.value = false
	}
}

const handleCancel = () => {
	emit('close')
}
</script>
