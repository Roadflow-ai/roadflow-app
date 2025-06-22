<template>
	<section>
		<div class="flex justify-between items-center mb-8">
			<h1 class="text-2xl font-semibold text-gray-900">Workflows</h1>
			<div class="flex space-x-4">
				<button
					@click="open = true"
					class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800"
				>
					Add Workflow
				</button>
			</div>
		</div>

		<template v-if="pending">
			<p>Loading workflows...</p>
		</template>

		<template v-else-if="status === 'error'">
			<p class="text-red-500">Error loading workflows. Try again later.</p>
		</template>

		<template v-else-if="status === 'success' && workflows.length === 0">
			<p>There are no workflows to display at this moment.</p>
		</template>

		<template v-else-if="status === 'success' && workflows.length > 0">
			<div class="rounded-md overflow-hidden border border-green-500">
				<table class="w-full max-h-96">
					<thead>
						<tr class="bg-green-100">
							<th class="text-left p-3">Prompt</th>
							<th class="p-3 text-right text-gray-400">Fecha</th>
						</tr>
					</thead>
					<tbody>
						<tr
							class="hover:bg-green-100 hover:cursor-pointer bg-gray-100 border-t border-green-500"
							v-for="workflow in workflows"
							:key="workflow._id"
							@click="$router.push(`${$route.path}/${workflow._id}`)"
						>
							<td class="p-3 w-3/5">{{ workflow.prompt }}</td>
							<td class="p-3 w-1/5 text-right text-gray-400">
								{{ formatWorkflowDate(workflow.updatedAt) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</section>

	<WorkflowsAddWorkflow
		:open="open"
		@close="open = false"
		@added="refreshWorkflows"
	/>
</template>

<script setup>
import { computed } from 'vue'

useSeoMeta({ title: 'Workflows' })

const open = ref(false)
const userStore = useUserStore()

if (!userStore.organizationId) {
	await userStore.fetchOrganization()
}

const organizationId = computed(() => userStore.organizationId)

const { data, status, pending, refresh } = await useApi(
	`workflow/${organizationId.value}`,
	{
		lazy: true
	}
)

const refreshWorkflows = () => {
	refresh()
}

const workflows = computed(() => data.value?.data ?? [])

const formatWorkflowDate = (dateString) => {
	if (!dateString) return 'Fecha no disponible'

	const date = new Date(dateString)

	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}
	return date.toLocaleString('es', options)
}
</script>
