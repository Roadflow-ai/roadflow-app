<template>
	<div class="workflow-container">
		<WorkflowsNode
			v-for="node in workflowNodes"
			:key="node._id"
			:title="node.task?.title || 'Sin título'"
			:description="node.task?.description || 'Sin descripción'"
			:enabled="node.enabled"
			:is-head="node.is_head"
			:is-task="node.is_task"
			:created-at="node.createdAt"
		/>
		<div v-if="workflowNodes.length === 0" class="empty-state">
			No hay nodos de workflow disponibles
		</div>
	</div>
</template>

<!-- TODO: FIX RENDER WITH CORRECT DATA SCHEMA -->
<script setup>
// const { data } = await useApi(`workflow/${organizationId.value}`, {
// 	lazy: true
// })

const data = {
	value: {
		success: true,
		data: [
			{
				organizationId: 0,
				is_head: false,
				next_flow: 'string',
				is_task: false,
				enabled: true,
				events: [],
				created_by: 0,
				parameters: {},
				task_template_id: 'string',
				agent: '',
				prompt: 'Mi prompt',
				_id: 'string',
				createdAt: '2025-06-19T04:40:22.028Z',
				updatedAt: '2025-06-19T04:40:22.028Z',
				task: {
					title: 'string',
					function_name: 'string',
					description: '',
					parameters: [],
					_id: 'string',
					createdAt: '2025-06-19T04:40:22.028Z',
					updatedAt: '2025-06-19T04:40:22.028Z'
				}
			}
		]
	}
}

const workflowNodes = computed(() => {
	const responseData = data.value?.data

	// Si no hay datos, retorna array vacío
	if (!responseData) return []

	// Si es un array, lo retorna tal como está
	if (Array.isArray(responseData)) {
		return responseData
	}

	// Si es un objeto único, lo convierte en array
	return [responseData]
})
</script>
