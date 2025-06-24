<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Settings Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
              <p class="mt-1 text-sm text-gray-600">
                Manage your organization settings and preferences
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
          <nav class="space-y-1">
            <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Organization
            </h3>
            <NuxtLink
              v-for="section in sections"
              :key="section.title"
              :to="`/dashboard/settings/${section.title.toLowerCase()}`"
              :class="[
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              <Icon 
                :name="section.icon" 
                size="20" 
                class="mr-3 flex-shrink-0"
              />
              {{ section.title }}
              <svg 
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

        <!-- Settings Overview -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Quick Settings</h2>
              <p class="mt-1 text-sm text-gray-600">
                Access and manage your most commonly used settings
              </p>
            </div>
            
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="section in sections"
                  :key="section.title"
                  class="relative group"
                >
                  <NuxtLink
                    :to="`/dashboard/settings/${section.title.toLowerCase()}`"
                    class="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all duration-200 group-hover:shadow-md"
                  >
                    <div class="flex items-start space-x-4">
                      <div :class="[
                        'flex-shrink-0 p-3 rounded-lg',
                        section.title === 'Team' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      ]">
                        <Icon :name="section.icon" size="24" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                          {{ section.title }}
                        </h3>
                        <p class="mt-1 text-sm text-gray-600">
                          {{ section.description }}
                        </p>
                        <div class="mt-3 flex items-center text-sm text-gray-500">
                          <span>{{ section.itemCount }} {{ section.itemLabel }}</span>
                          <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
              <p class="mt-1 text-sm text-gray-600">
                Latest changes to your organization settings
              </p>
            </div>
            <div class="p-6">
              <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p class="mt-1 text-sm text-gray-500">Activity will appear here when you make changes to your settings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Settings",
});

const sections = [
  {
    title: "Team",
    icon: "uil:users-alt",
    description: "Manage team members, roles, and invitations",
    itemCount: "5",
    itemLabel: "members"
  },
  {
    title: "Webhooks",
    icon: "uil:web-grid",
    description: "Configure input webhooks and integrations",
    itemCount: "3",
    itemLabel: "webhooks"
  },
];
</script>
