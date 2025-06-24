<template>
  <div class="bg-white p-4 rounded-xl shadow-sm">
    <UiImageWithFallback 
      :src="image" 
      :alt="title" 
      fallback-type="image"
      image-class="rounded-md h-40 w-full object-cover mb-4"
      fallback-class="rounded-md h-40 w-full mb-4 flex items-center justify-center"
      container-class="rounded-md h-40 w-full mb-4 overflow-hidden"
      icon-size="w-12 h-12"
    />
    <h3 class="font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-600 mb-4">{{ description }}</p>
    <button class="bg-green-50 text-green-700 rounded-md px-3 py-1 hover:bg-green-100" @click="$emit('view', id)">
      View
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    default: undefined
  },
  title: String,
  description: String,
  image: String
})

</script>
