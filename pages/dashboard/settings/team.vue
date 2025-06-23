<template>
  <div class="flex flex-col w-full h-full gap-8">
    <div class="flex flex-col">
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">Members</h3>
      <div v-if="status === 'error'" class="text-red-500">
        Error loading team members. Please try again later.
      </div>
      <div v-else-if="pending" class="text-gray-500">
        Loading team members...
      </div>
      <div
        v-else-if="members.length > 0 && status === 'success'"
        class="flex flex-wrap justify-between items-start gap-4 w-full h-full"
      >
        <ul class="flex flex-wrap items-start gap-4 w-full h-full">
          <li
            :key="member.userId"
            v-for="member in members"
            class="mb-4 text-gray-500 bg-slate-100 rounded-xl px-4 py-6 w-80"
          >
            <div class="flex items-center space-x-4">
              <img
                v-if="member?.avatarUrl"
                :src="member?.avatarUrl"
                alt="Avatar"
                class="w-10 h-10 rounded-full"
              />
              <div v-else>
                <Icon name="uil:user-circle" size="30" />
              </div>
              <div>
                <h3 class="text-lg font-semibold capitalize">
                  {{ member.first_name }} {{ member.last_name }}
                </h3>
                <p class="text-sm text-gray-600 capitalize">
                  {{ member.role }}
                </p>
                <p class="text-sm text-gray-600">{{ member.email }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex flex-col">
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">Invitations</h3>
      <SettingsTeamInvitations />
    </div>
  </div>
</template>

<script setup>
useSeoMeta({ title: "Team Settings" });
const userStore = useUserStore();

if (!userStore.organizationId) {
  await userStore.fetchOrganization();
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
