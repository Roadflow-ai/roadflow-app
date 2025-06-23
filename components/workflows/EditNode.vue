<template>
	<ModalWrapper v-if="open">
		<h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Current Node</h2>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<!-- Task Type -->
			<div>
				<label
					for="task_template_id"
					class="block text-sm font-medium text-gray-700 mb-1"
				>
					Task Type <span class="text-red-500">*</span>
				</label>
				<select
					id="task_template_id"
					v-model="formData.task_template_id"
					required
					:class="[
						'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
						errors.task_template_id
							? 'border-red-300 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
					]"
				>
					<option value="">Select a task type</option>
					<option v-for="task in tasksList" :value="task.id">
						{{ task.title }}
					</option>
				</select>
				<p v-if="errors.task_template_id" class="mt-1 text-sm text-red-600">
					{{ errors.task_template_id }}
				</p>
			</div>

			<!-- Dynamic Parameters Section -->
			<WorkflowsDynamicTaskForm
				:selectedTask="selectedTask"
				v-model="formData.parameters"
				:errors="parameterErrors"
			/>

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
					{{ isSubmitting ? 'Loading...' : 'Update' }}
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

const emit = defineEmits(['close', 'added', 'edited'])

const { organizationId } = useUserStore()
const { data } = await useApi('workflow/task/all')
const tasksList = computed(() => data?.value?.data || [])

// Get selected task object
const selectedTask = computed(() => {
	if (!formData.task_template_id) return null
	return tasksList.value.find(task => task.id === formData.task_template_id)
})

// Helper function to get parameter fields (matches DynamicTaskForm logic)
const getParameterFields = (task) => {
	const defaultSchema = {
		to: { type: 'email', label: 'To Email', required: true },
		Subject: { type: 'text', label: 'Subject', required: true }
	}
	
	// Return task schema if available, otherwise default
	return task.parameters_schema || defaultSchema
}

const isSubmitting = ref(false)
const generalError = ref('')

// Load existing node data when modal opens
const loadNodeData = async () => {
	if (!props.nodeId || !props.open) return
	
	try {
		const { data: nodeData } = await useApi(`workflow/${organizationId}/node/${props.nodeId}`)
		const node = nodeData.value?.data
		
		if (node) {
			formData.task_template_id = node.task_template_id || ''
			formData.parameters = { ...node.parameters } || {}
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

const formData = shallowReactive({
	task_template_id: '',
	parameters: {}
})

const errors = ref({
	task_template_id: ''
})

const parameterErrors = ref({})

const clearErrors = () => {
	errors.value = {
		task_template_id: ''
	}
	parameterErrors.value = {}
}

const validateForm = () => {
	clearErrors()
	generalError.value = ''
	let isValid = true

	if (!formData.task_template_id) {
		errors.value.task_template_id = 'Task type is required'
		isValid = false
	}

	// Dynamic parameter validation
	if (selectedTask.value) {
		const paramFields = getParameterFields(selectedTask.value)
		Object.entries(paramFields).forEach(([fieldName, field]) => {
			if (field.required && !formData.parameters[fieldName]) {
				parameterErrors.value[fieldName] = `${field.label} is required`
				isValid = false
			}
			
			// Email validation
			if (field.type === 'email' && formData.parameters[fieldName]) {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				if (!emailRegex.test(formData.parameters[fieldName])) {
					parameterErrors.value[fieldName] = 'Please enter a valid email address'
					isValid = false
				}
			}
		})
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
			'An error occurred while updating the workflow. Please try again.'
		console.error('Submit error:', error)
	} finally {
		isSubmitting.value = false
	}
}

const resetForm = () => {
	formData.task_template_id = ''
	formData.parameters = {}
	clearErrors()
}

const handleCancel = () => {
	resetForm()
	emit('close')
}
</script>
