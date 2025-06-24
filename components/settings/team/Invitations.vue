<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-8">
      <div class="text-center">
        <div class="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-sm text-gray-600">Loading invitations...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="text-center py-8">
      <div class="text-red-500 mb-4">
        <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-sm font-medium text-gray-900 mb-2">Error loading invitations</h4>
      <p class="text-sm text-gray-600 mb-4">Please try refreshing or contact support if the issue persists.</p>
      <button 
        @click="refresh"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <Icon name="uil:refresh" size="14" class="mr-2" />
        Retry
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header Actions -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="refresh"
            :disabled="pending"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon 
              name="uil:refresh" 
              size="16" 
              :class="['mr-2', { 'animate-spin': pending }]" 
            />
            Refresh
          </button>
        </div>
        <button
          @click="open = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Icon name="uil:plus" size="16" class="mr-2" />
          Invite Member
        </button>
      </div>

      <!-- Pending Invitations -->
      <div v-if="invitations.length > 0" class="space-y-3">
        <div
          v-for="invitation in invitations"
          :key="invitation.id"
          class="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Icon name="uil:envelope" size="20" class="text-amber-600" />
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-900">
                {{ invitation.email }}
              </h4>
              <div class="flex items-center space-x-2 mt-1">
                <span :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                  invitation.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                ]">
                  {{ invitation.role }}
                </span>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">
                  Invited {{ formatDate(invitation.createdAt) }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Pending
            </span>
            <button
              @click="resendInvitation(invitation.id)"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Resend invitation"
            >
              <Icon name="uil:redo" size="16" />
            </button>
            <button
              @click="cancelInvitation(invitation.id)"
              class="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Cancel invitation"
            >
              <Icon name="uil:times" size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <div class="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <Icon name="uil:envelope-add" size="24" class="text-blue-600" />
        </div>
        <h4 class="text-sm font-medium text-gray-900 mb-2">No pending invitations</h4>
        <p class="text-sm text-gray-500 mb-4">Invite team members to collaborate on your organization</p>
        <button
          @click="open = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Icon name="uil:plus" size="16" class="mr-2" />
          Send Invitation
        </button>
      </div>
    </div>

    <!-- Create Invitation Modal -->
    <SettingsTeamCreateInvitation
      :open="open"
      @close="open = false"
      @added="handleInvitationAdded"
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

const handleInvitationAdded = () => {
  refresh();
  open.value = false;
};

const resendInvitation = async (invitationId) => {
  try {
    await useApi(`organization/${organizationId.value}/invites/${invitationId}/resend`, {
      method: "POST",
    });
    // You could add a toast notification here
    console.log("Invitation resent successfully");
  } catch (error) {
    console.error("Error resending invitation:", error);
    alert("Failed to resend invitation. Please try again.");
  }
};

const cancelInvitation = async (invitationId) => {
  if (!confirm("Are you sure you want to cancel this invitation?")) {
    return;
  }

  try {
    await useApi(`organization/${organizationId.value}/invites/${invitationId}`, {
      method: "DELETE",
    });
    refresh();
  } catch (error) {
    console.error("Error canceling invitation:", error);
    alert("Failed to cancel invitation. Please try again.");
  }
};
</script>
