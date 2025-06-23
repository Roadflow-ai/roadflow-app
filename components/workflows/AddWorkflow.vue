<template>
	<ModalWrapper v-if="open">
		<h2 class="text-xl font-semibold text-gray-800 mb-4">
			Create New Workflow
		</h2>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div>
				<label
					for="prompt"
					class="block text-sm font-medium text-gray-700 mb-1"
				>
					Prompt <span class="text-red-500">*</span>
				</label>
				<input
					id="prompt"
					v-model="formData.prompt"
					type="text"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
						errors.prompt
							? 'border-red-300 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
					]"
					placeholder="Enter your prompt"
					required
				/>
				<p v-if="errors.prompt" class="mt-1 text-sm text-red-600">
					{{ errors.prompt }}
				</p>
			</div>

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

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Events <span class="text-red-500">*</span>
				</label>
				<button
					type="button"
					@click="showDropdown = !showDropdown"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-left bg-gray-50 flex justify-between items-center',
						errors.events
							? 'border-red-300 focus:ring-red-500 focus:border-red-500'
							: 'border-gray-300 focus:ring-green-500 focus:border-green-500'
					]"
				>
					<span>
						{{
							formData.events.length > 0
								? `${formData.events.length} events selected`
								: 'Select events'
						}}
					</span>
					<svg
						class="w-5 h-5 text-gray-400 transform transition-transform"
						:class="{ 'rotate-180': showDropdown }"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 9-7 7-7-7"
						></path>
					</svg>
				</button>

				<div
					v-if="showDropdown"
					class="mt-2 bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-auto"
				>
					<div class="p-3 space-y-2">
						<label
							v-for="event in availableEvents"
							:key="event.value"
							class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
						>
							<input
								type="checkbox"
								:value="event.value"
								v-model="formData.events"
							/>
							<span class="ml-2 text-sm text-gray-700">{{ event.label }}</span>
						</label>
					</div>
				</div>

				<p v-if="errors.events" class="mt-1 text-sm text-red-600">
					{{ errors.events }}
				</p>

				<div v-if="formData.events.length > 0" class="mt-2">
					<p class="text-xs text-gray-600 mb-1">
						Selected events ({{ formData.events.length }}):
					</p>
					<div class="flex flex-wrap gap-1">
						<span
							v-for="event in formData.events"
							:key="event"
							class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
						>
							{{ event }}
						</span>
					</div>
				</div>
			</div>

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
					{{ isSubmitting ? 'Creating...' : 'Create' }}
				</button>
			</div>
		</form>
	</ModalWrapper>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['close', 'added'])
const { organizationId } = useUserStore()
const showDropdown = ref(false)
const isSubmitting = ref(false)
const generalError = ref('')

const { data } = await useApi(`agents/${organizationId}/all`)
const agentsList = computed(() => data?.value?.data || [])

const formData = shallowReactive({
	prompt: '',
	is_head: true,
	events: [],
	agent: ''
})

const errors = ref({
	prompt: '',
	agent: '',
	events: ''
})

const availableEvents = [{ value: 'git_webhook', label: 'git_webhook' }]

const clearErrors = () => {
	errors.value = {
		prompt: '',
		agent: '',
		events: ''
	}
}

const validateForm = () => {
	clearErrors()
	let isValid = true

	// Validate prompt
	if (!formData.prompt.trim()) {
		errors.value.prompt = 'Prompt is required'
		isValid = false
	} else if (formData.prompt.trim().length < 3) {
		errors.value.prompt = 'Prompt must be at least 3 characters long'
		isValid = false
	}

	// Validate agent
	if (!formData.agent) {
		errors.value.agent = 'Agent is required'
		isValid = false
	}

	// Validate events
	if (formData.events.length === 0) {
		errors.value.events = 'At least one event must be selected'
		isValid = false
	}

	return isValid
}

const handleSubmit = async () => {
	if (!validateForm()) {
		return
	}

	isSubmitting.value = true

	try {
		await useApi(`workflow/${organizationId}/workflow`, {
			lazy: true,
			method: 'POST',
			body: { ...formData }
		})

		emit('added')
		handleCancel()
	} catch (error) {
		generalError.value =
			'An error occurred while creating the workflow. Please try again.'
		console.error('Submit error:', error)
	} finally {
		isSubmitting.value = false
	}
}

const resetForm = () => {
	formData.prompt = ''
	formData.is_head = true
	formData.events = []
	formData.agent = ''
	clearErrors()
	showDropdown.value = false
}

const handleCancel = () => {
	resetForm()
	emit('close')
}
</script>
