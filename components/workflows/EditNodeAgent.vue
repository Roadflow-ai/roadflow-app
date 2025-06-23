<template>
	<ModalWrapper v-if="open">
		<h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Agent Node</h2>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<!-- Agent Selection -->
			<div>
				<label for="agent" class="block text-sm font-medium text-gray-700 mb-1">
					Agent <span class="text-red-500">*</span>
				</label>
				<select
					id="agent"
					v-model="formData.agent"
					required
					:class="[
						'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 capitalize',
						errors.agent
							? 'border-red-300 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
					]"
				>
					<option value="">Select an agent</option>
					<option
						v-for="agent in agentsList"
						:key="agent"
						:value="agent"
						class="capitalize"
					>
						{{ agent }}
					</option>
				</select>
				<p v-if="errors.agent" class="mt-1 text-sm text-red-600">
					{{ errors.agent }}
				</p>
			</div>

			<!-- Prompt -->
			<div>
				<label
					for="prompt"
					class="block text-sm font-medium text-gray-700 mb-1"
				>
					Prompt <span class="text-red-500">*</span>
				</label>
				<textarea
					id="prompt"
					v-model="formData.prompt"
					rows="4"
					required
					:class="[
						'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none',
						errors.prompt
							? 'border-red-300 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
					]"
					placeholder="Enter the agent prompt..."
				></textarea>
				<p v-if="errors.prompt" class="mt-1 text-sm text-red-600">
					{{ errors.prompt }}
				</p>
			</div>

			<!-- General Error Display -->
			<div v-if="generalError" class="p-3 bg-red-50 border border-red-200 rounded-md">
				<p class="text-sm text-red-600">{{ generalError }}</p>
			</div>

			<!-- Buttons -->
			<div class="flex justify-end space-x-3 pt-4">
				<button
					type="button"
					@click="handleCancel"
					class="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					:disabled="isSubmitting"
					:class="[
						'px-4 py-2 rounded-full transition-colors',
						isSubmitting
							? 'bg-gray-400 text-gray-200 cursor-not-allowed'
							: 'bg-green-700 text-white hover:bg-green-800'
					]"
				>
					{{ isSubmitting ? 'Updating...' : 'Update Agent' }}
				</button>
			</div>
		</form>
	</ModalWrapper>
</template>

<script setup>
import { ref, computed, shallowReactive, watch } from 'vue'

const props = defineProps({
	nodeId: String,
	open: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['close', 'edited'])

const { organizationId } = useUserStore()
const { data } = await useApi(`agents/${organizationId}/all`)
const agentsList = computed(() => data?.value?.data || [])

const isSubmitting = ref(false)
const generalError = ref('')

const formData = shallowReactive({
	agent: '',
	prompt: '',
	is_task: false,
	is_head: true // Will be set from loaded data
})

const errors = ref({
	agent: '',
	prompt: ''
})

const clearErrors = () => {
	errors.value = {
		agent: '',
		prompt: ''
	}
}

// Load existing node data when modal opens
const loadNodeData = async () => {
	if (!props.nodeId || !props.open) return
	
	try {
		const { data: nodeData } = await useApi(`workflow/${organizationId}/node/${props.nodeId}`)
		const node = nodeData.value?.data
		
		if (node) {
			formData.agent = node.agent || ''
			formData.prompt = node.prompt || ''
			formData.is_task = node.is_task || false
			formData.is_head = node.is_head || false
		}
	} catch (error) {
		console.error('Error loading node data:', error)
		generalError.value = 'Failed to load node data'
	}
}

// Watch for modal opening to load data
watch(() => props.open, (isOpen) => {
	if (isOpen) {
		loadNodeData()
	} else {
		resetForm()
	}
})

const validateForm = () => {
	clearErrors()
	generalError.value = ''
	let isValid = true

	if (!formData.agent) {
		errors.value.agent = 'Agent is required'
		isValid = false
	}

	if (!formData.prompt.trim()) {
		errors.value.prompt = 'Prompt is required'
		isValid = false
	} else if (formData.prompt.trim().length < 10) {
		errors.value.prompt = 'Prompt must be at least 10 characters long'
		isValid = false
	}

	return isValid
}

const handleSubmit = async () => {
	if (!validateForm()) return
	isSubmitting.value = true

	try {
		await useApi(`workflow/${organizationId}/node/${props.nodeId}`, {
			lazy: true,
			method: 'PATCH',
			body: { ...formData }
		})
		emit('edited')
		handleCancel()
	} catch (error) {
		generalError.value =
			'An error occurred while updating the agent node. Please try again.'
		console.error('Submit error:', error)
	} finally {
		isSubmitting.value = false
	}
}

const resetForm = () => {
	formData.agent = ''
	formData.prompt = ''
	formData.is_task = false
	formData.is_head = true
	clearErrors()
	generalError.value = ''
}

const handleCancel = () => {
	resetForm()
	emit('close')
}
</script>