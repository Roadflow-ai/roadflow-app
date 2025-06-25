<template>
  <NuxtLayout name="settings">
    <div class="space-y-8">
      <!-- Team Members Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Team Members</h3>
              <p class="mt-1 text-sm text-gray-600">
                Manage your organization members and their roles
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ members.length }} {{ members.length === 1 ? 'member' : 'members' }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div v-if="pending" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-sm text-gray-600">Loading team members...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="status === 'error'" class="text-center py-12">
            <div class="text-red-500 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading team members</h3>
            <p class="text-sm text-gray-600 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
            <button 
              @click="refresh"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Icon name="uil:refresh" size="16" class="mr-2" />
              Retry
            </button>
          </div>

          <!-- Members List -->
          <div v-else-if="members.length > 0" class="space-y-4">
            <div
              v-for="member in members"
              :key="member.userId"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-4">
                <UiImageWithFallback
                  :src="member?.avatarUrl"
                  alt="Avatar"
                  fallback-type="user"
                  image-class="w-12 h-12 rounded-full object-cover"
                  fallback-class="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200"
                  container-class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                  icon-size="w-6 h-6"
                />
                <div>
                  <h4 class="text-sm font-medium text-gray-900 capitalize">
                    {{ member.first_name }} {{ member.last_name }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ member.email }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                  member.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ member.role }}
                </span>
                <button
                  v-if="member.role !== 'admin'"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                  title="More options"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No team members</h3>
            <p class="mt-1 text-sm text-gray-500">Start by inviting team members to your organization.</p>
          </div>
        </div>
      </div>

      <!-- Team Invitations Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Team Invitations</h3>
              <p class="mt-1 text-sm text-gray-600">
                Manage pending invitations and invite new team members
              </p>
            </div>
          </div>
        </div>
        <div class="p-6">
          <SettingsTeamInvitations />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
useSeoMeta({ title: "Team Settings" });
const userStore = useUserStore();

if (!userStore.organizationId) {
  await userStore.fetchOrganizations();
}

const organizationId = computed(() => userStore.organizationId);

const { data, status, pending, refresh } = await useApi(
  `organization/${organizationId.value}/members`,
  {
    lazy: true,
  }
);

const members = computed(() => data.value?.data ?? []);
</script>
