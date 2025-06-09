<template>
  <aside class="w-60 bg-gray-100 h-screen py-6">
    <nav class="space-y-2">
      <router-link
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.path"
        class="flex items-center space-x-3 px-4 py-3 hover:bg-gray-200 rounded-lg transition-colors"
        :class="{ 'bg-gray-200': activeRoute === item.path }"
      >
        <component :is="item.icon" class="w-5 h-5 text-gray-600" />
        <span class="text-gray-800">{{ item.label }}</span>
      </router-link>
    </nav>

  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeRoute = computed(() => route.path)

const menuItems = [
  { label: 'Home', path: '/', icon: 'HomeIcon' },
  { label: 'Engineering', path: '/engineering', icon: 'CodeIcon' },
  { label: 'Product', path: '/product', icon: 'ProductIcon' },
  { label: 'Operations', path: '/operations', icon: 'OperationsIcon' },
  { label: 'Customer Success', path: '/success', icon: 'CustomerIcon' },
  { label: 'Growth', path: '/growth', icon: 'GrowthIcon' },
  { label: 'Settings', path: '/settings', icon: 'SettingsIcon' }
]
</script>
