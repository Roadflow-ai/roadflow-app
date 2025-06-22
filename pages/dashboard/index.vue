
<template>
  <div v-if="organization && organization.name" class="text-xl font-semibold text-green-900 mb-2">
    {{ organization.name }}
  </div>
  Communication that moves at the speed of your product
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { organization } = storeToRefs(userStore)

useSeoMeta({
	title: 'RoadFlow AI'
})
</script>
