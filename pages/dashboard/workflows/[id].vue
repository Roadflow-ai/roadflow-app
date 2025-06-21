<template>
	<div class="flex flex-col gap-5">
		<header class="flex items-start justify-between gap-4">
			<h3 class="text-2xl font-semibold text-gray-900">Workflow</h3>
			<div class="flex space-x-4">
				<button
					@click="open = true"
					class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800"
				>
					Add Node
				</button>
			</div>
		</header>
		<div v-if="pending">Cargando flujo de trabajo...</div>
		<div v-else-if="error">Error al cargar flujo de trabajo</div>
		<div class="flex gap-5" v-else>
			<WorkflowsNode
				v-for="node in rawNodes"
				:key="node._id"
				:nodeId="node._id"
				:title="node.is_task ? node.task?.title : node.prompt"
				:agent="node.agent"
				:function_name="node?.task?.function_name"
				:enabled="node.enabled"
				:isHead="node.is_head"
				:isTask="node.is_task"
				:createdAt="node.createdAt"
				@edited="refreshNodes"
				@deleted="refreshNodes"
			/>

			<div v-if="rawNodes.length === 0" class="empty-state">
				No se encontraron nodos.
			</div>
		</div>
		<WorkflowsAddNode
			@added="refreshNodes"
			:open="open"
			@close="open = false"
		/>
	</div>
</template>

<script setup>
useSeoMeta({ title: 'Workflow' })

const route = useRoute()

const workflowId = ref(route.params.id)
const userStore = useUserStore()
const open = ref(false)

if (!userStore.organizationId) {
	await userStore.fetchUser()
}

const organizationId = computed(() => userStore.organizationId)

const { data, refresh, pending, error } = await useApi(
	`workflow/${organizationId.value}/nodes/${workflowId.value}`
)

const rawNodes = computed(() => data.value?.data || [])

const refreshNodes = () => {
	refresh()
}
</script>
