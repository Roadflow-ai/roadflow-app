<template>
  <div class="relative inline-block" :class="containerClass">
    <img
      v-if="!hasError && src"
      :src="src"
      :alt="alt"
      :class="imageClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- Default SVG fallback -->
    <div
      v-else
      :class="[
        'flex items-center justify-center bg-gray-100 text-gray-400',
        imageClass,
        fallbackClass
      ]"
    >
      <svg
        v-if="fallbackType === 'user'"
        :class="iconSize"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clip-rule="evenodd"
        />
      </svg>
      
      <svg
        v-else-if="fallbackType === 'image'"
        :class="iconSize"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clip-rule="evenodd"
        />
      </svg>
      
      <svg
        v-else-if="fallbackType === 'logo'"
        :class="iconSize"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        />
      </svg>
      
      <!-- Generic fallback -->
      <svg
        v-else
        :class="iconSize"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clip-rule="evenodd"
        />
      </svg>
      
      <span v-if="showFallbackText" class="ml-2 text-sm">{{ fallbackText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Image'
  },
  fallbackType: {
    type: String,
    default: 'image', // 'user', 'image', 'logo', 'generic'
    validator: (value) => ['user', 'image', 'logo', 'generic'].includes(value)
  },
  imageClass: {
    type: [String, Array, Object],
    default: 'w-full h-auto'
  },
  containerClass: {
    type: [String, Array, Object],
    default: ''
  },
  fallbackClass: {
    type: [String, Array, Object],
    default: ''
  },
  showFallbackText: {
    type: Boolean,
    default: false
  },
  fallbackText: {
    type: String,
    default: 'Image not available'
  },
  iconSize: {
    type: String,
    default: 'w-8 h-8'
  }
})

const emit = defineEmits(['error', 'load'])

const hasError = ref(false)

const handleImageError = (event) => {
  hasError.value = true
  emit('error', event)
}

const handleImageLoad = (event) => {
  hasError.value = false
  emit('load', event)
}

// Reset error state when src changes
watch(() => props.src, () => {
  hasError.value = false
})
</script>