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

			<!-- Parameters Section -->
			<div class="border-t pt-4">
				<h3 class="text-lg font-medium text-gray-700 mb-3">Parameters</h3>

				<!-- To Field -->
				<div>
					<label
						for="parameters_to"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						To <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="parameters_to"
						v-model="formData.parameters.to"
						required
						:class="[
							'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
							errors.parameters_to
								? 'border-red-300 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
						]"
					/>
					<p v-if="errors.parameters_to" class="mt-1 text-sm text-red-600">
						{{ errors.parameters_to }}
					</p>
				</div>

				<!-- Subject Field -->
				<div class="mt-4">
					<label
						for="parameters_subject"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						Subject (Parameters) <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="parameters_subject"
						v-model="formData.parameters.Subject"
						required
						:class="[
							'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
							errors.parameters_subject
								? 'border-red-300 focus:ring-red-500 focus:border-red-500'
								: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
						]"
						placeholder="Result of the previous task"
					/>
					<p v-if="errors.parameters_subject" class="mt-1 text-sm text-red-600">
						{{ errors.parameters_subject }}
					</p>
				</div>
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
import { ref, computed, shallowReactive } from 'vue'

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

const isSubmitting = ref(false)
const generalError = ref('')

const formData = shallowReactive({
	task_template_id: '',
	parameters: {
		to: '',
		Subject: ''
	}
})

const errors = ref({
	task_template_id: '',
	parameters_to: '',
	parameters_subject: ''
})

const clearErrors = () => {
	errors.value = {
		task_template_id: '',
		parameters_to: '',
		parameters_subject: ''
	}
}

const validateForm = () => {
	clearErrors()
	let isValid = true

	if (!formData.task_template_id) {
		errors.value.task_template_id = 'Task type is required'
		isValid = false
	}
	if (!formData.parameters.to) {
		errors.value.parameters_to = 'To field is required'
		isValid = false
	}
	if (!formData.parameters.Subject) {
		errors.value.parameters_subject = 'Subject (Parameters) is required'
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
			'An error occurred while updating the workflow. Please try again.'
		console.error('Submit error:', error)
	} finally {
		isSubmitting.value = false
	}
}

const resetForm = () => {
	formData.task_template_id = ''
	formData.parameters.to = ''
	formData.parameters.Subject = ''
	clearErrors()
}

const handleCancel = () => {
	resetForm()
	emit('close')
}
</script>
