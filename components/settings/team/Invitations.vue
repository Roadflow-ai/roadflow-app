<template>
  <div class="flex flex-col">
    <div v-if="status === 'error'" class="text-red-500">
      Error loading invitations. Please try again later.
    </div>
    <div v-else-if="pending" class="text-gray-500">Loading invitations...</div>
    <div
      v-else-if="invitations.length > 0 && status === 'success'"
      class="flex flex-col w-full h-full gap-3"
    >
      <div class="flex mb-4 flex-row-reverse gap-5">
        <button
          class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon name="uil:refresh" size="24" @click="refresh" />
          <span class="ml-2">Refresh Invitations</span>
        </button>
        <button
          @click="open = true"
          class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Icon name="uil:plus" size="24" />
          <span class="ml-2">Invite Team Member</span>
        </button>
      </div>
      <ul class="flex flex-wrap items-start gap-4 w-full h-full">
        <li
          :key="invitation.id"
          v-for="invitation in invitations"
          class="mb-4 text-gray-500 bg-slate-100 rounded-xl px-4 py-6 w-80"
        >
          <div class="flex items-center space-x-4">
            <div>
              <Icon name="uil:mailbox" size="30" />
            </div>
            <div>
              <h3 class="text-lg font-semibold">
                {{ invitation.email }}
              </h3>
              <p class="text-sm text-gray-600 capitalize">
                {{ invitation.role }}
              </p>
              <p class="text-sm text-gray-600">
                {{ formatDate(invitation.createdAt) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <SettingsTeamCreateInvitation
      :open="open"
      @close="open = false"
      @added="refresh"
    />
  </div>
</template>

<script setup>
import dayjs from "dayjs";
useSeoMeta({ title: "Team Settings" });
const userStore = useUserStore();
const open = ref(false);

if (!userStore.organizationId) {
  await userStore.fetchOrganization();
}

const organizationId = computed(() => userStore.organizationId);

const { data, status, pending, refresh } = await useApi(
  `organization/${organizationId.value}/invites`,
  {
    lazy: true,
  }
);

const invitations = computed(() => data.value?.data ?? []);
const formatDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};
</script>
