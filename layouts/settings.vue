<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Settings Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <nav class="flex mb-2" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2">
                  <li>
                    <NuxtLink 
                      to="/dashboard/settings" 
                      class="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Settings
                    </NuxtLink>
                  </li>
                  <li v-if="currentSection">
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span class="ml-2 text-sm font-medium text-gray-900">{{ currentSection }}</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
              <p v-if="pageDescription" class="mt-1 text-sm text-gray-600">
                {{ pageDescription }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="bg-green-50 px-3 py-1 rounded-full">
                <span class="text-xs font-medium text-green-700">Organization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1 sticky top-8">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Organization
            </h3>
            <NuxtLink
              v-for="section in sections"
              :key="section.title"
              :to="`/dashboard/settings/${section.title.toLowerCase()}`"
              :class="[
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isCurrentSection(section.title) 
                  ? 'bg-green-50 text-green-700 border-r-2 border-green-500' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              <Icon 
                :name="section.icon" 
                size="20" 
                class="mr-3 flex-shrink-0"
              />
              {{ section.title }}
              <svg 
                v-if="!isCurrentSection(section.title)"
                class="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </nav>
        </div>

        <!-- Page Content -->
        <div class="lg:col-span-3">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const sections = [
  {
    title: "Team",
    icon: "uil:users-alt",
  },
  {
    title: "Webhooks",
    icon: "uil:web-grid",
  },
]

const currentSection = computed(() => {
  const path = route.path
  if (path.includes('/team')) return 'Team'
  if (path.includes('/webhooks')) return 'Webhooks'
  return null
})

const pageTitle = computed(() => {
  return currentSection.value || 'Settings'
})

const pageDescription = computed(() => {
  switch (currentSection.value) {
    case 'Team':
      return 'Manage your organization members and team invitations'
    case 'Webhooks':
      return 'Configure input webhooks and external integrations'
    default:
      return 'Manage your organization settings and preferences'
  }
})

const isCurrentSection = (sectionTitle) => {
  return currentSection.value === sectionTitle
}
</script>