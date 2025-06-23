<template>
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-2xl font-semibold text-gray-900">Roadmap</h1>
	</div>

	<div class="space-y-8">
		<div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<ContentCard
					v-for="chanelog in chanelogList"
					:key="chanelog._id"
					:title="chanelog.title"
					:description="chanelog.description"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
useSeoMeta({
	title: 'Roadmap'
})

const { organizationId } = useUserStore()
const data = {
	value: {
		data: [
			{
				organizationId: 0,
				title: 'Changes in the flow',
				description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				position: 0,
				show: true,
				estimated_date: '2025-06-22T23:06:57.778Z',
				_id: 'string',
				createdAt: '2025-06-22T23:06:57.778Z',
				updatedAt: '2025-06-22T23:06:57.778Z'
			},
			{
				organizationId: 0,
				title: 'Changes in the flow 2',
				description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				position: 0,
				show: true,
				estimated_date: '2025-06-22T23:06:57.778Z',
				_id: 'string2',
				createdAt: '2025-06-22T23:06:57.778Z',
				updatedAt: '2025-06-22T23:06:57.778Z'
			},
			{
				organizationId: 0,
				title: 'Changes in the flow 3',
				description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				position: 0,
				show: true,
				estimated_date: '2025-06-22T23:06:57.778Z',
				_id: 'string3',
				createdAt: '2025-06-22T23:06:57.778Z',
				updatedAt: '2025-06-22T23:06:57.778Z'
			},
			{
				organizationId: 0,
				title: 'Changes in the flow 4',
				description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				position: 0,
				show: true,
				estimated_date: '2025-06-22T23:06:57.778Z',
				_id: 'string4',
				createdAt: '2025-06-22T23:06:57.778Z',
				updatedAt: '2025-06-22T23:06:57.778Z'
			}
		]
	}
}

// const { data, status, pending, refresh } = await useApi(
// 	`changelog/${organizationId}`,
// 	{
// 		lazy: true,
// 		query: {
// 			page: 1,
// 			limit: 20
// 		}
// 	}
// )

const chanelogList = computed(() => data.value?.data ?? [])
</script>
