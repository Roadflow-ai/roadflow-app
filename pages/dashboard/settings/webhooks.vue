<template>
  <div class="flex flex-col w-full h-full gap-8">
    <div class="flex flex-col">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-semibold text-gray-900">Input Webhooks</h3>
        <button
          @click="openCreateModal"
          class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          <Icon name="uil:plus" size="20" />
          Create Webhook
        </button>
      </div>

      <div v-if="status === 'error'" class="text-red-500">
        Error loading webhooks. Please try again later.
      </div>
      <div v-else-if="pending" class="text-gray-500">
        Loading webhooks...
      </div>
      <div v-else-if="webhooks.length === 0 && status === 'success'" class="text-center py-8">
        <Icon name="uil:web-grid" size="48" class="mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No webhooks yet</h3>
        <p class="text-gray-500 mb-4">Create your first input webhook to start receiving events</p>
        <button
          @click="openCreateModal"
          class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition-colors"
        >
          Create Webhook
        </button>
      </div>
      <div
        v-else-if="webhooks.length > 0 && status === 'success'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="webhook in webhooks"
          :key="webhook.id"
          class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-1">
                {{ webhook.name }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">
                {{ webhook.description }}
              </p>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {{ webhook.type }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="copyWebhookUrl(webhook)"
                class="text-gray-500 hover:text-gray-700 transition-colors p-1"
                title="Copy webhook URL"
              >
                <Icon name="uil:copy" size="18" />
              </button>
              <button
                @click="deleteWebhook(webhook.id)"
                class="text-red-500 hover:text-red-700 transition-colors p-1"
                title="Delete webhook"
              >
                <Icon name="uil:trash-alt" size="18" />
              </button>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div class="bg-gray-50 p-3 rounded-md">
              <div class="flex justify-between items-center mb-2">
                <p class="text-xs text-gray-500 font-medium">Webhook URL</p>
                <button
                  @click="copyWebhookUrl(webhook)"
                  class="text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  Copy
                </button>
              </div>
              <p class="text-sm text-gray-700 font-mono break-all">
                {{ getWebhookUrl(webhook) }}
              </p>
            </div>
            
            <div class="pt-2 border-t border-gray-100">
              <p class="text-xs text-gray-500 mb-1">Created</p>
              <p class="text-sm text-gray-700">
                {{ formatDate(webhook.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Webhook Modal -->
    <SettingsWebhooksCreate
      :open="createModalOpen"
      @close="createModalOpen = false"
      @created="handleWebhookCreated"
    />
  </div>
</template>

<script setup>
import dayjs from "dayjs";

useSeoMeta({ title: "Webhook Settings" });

const userStore = useUserStore();
const createModalOpen = ref(false);
const config = useRuntimeConfig();

if (!userStore.organizationId) {
  await userStore.fetchOrganization();
}

const organizationId = computed(() => userStore.organizationId);

const { data, status, pending, refresh } = await useApi(
  `organization/${organizationId.value}/webhook/input`,
  {
    lazy: true,
  }
);

const webhooks = computed(() => data.value?.data ?? []);

const formatDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

const openCreateModal = () => {
  createModalOpen.value = true;
};

const handleWebhookCreated = () => {
  refresh();
  createModalOpen.value = false;
};

const getWebhookUrl = (webhook) => {
  const baseUrl = config.public.apiUrl || 'http://localhost:3000';
  return `${baseUrl}/api/v1/${webhook.type}/${webhook.key}`;
};

const copyWebhookUrl = async (webhook) => {
  const url = getWebhookUrl(webhook);
  
  try {
    await navigator.clipboard.writeText(url);
    // Show success feedback - you could use a toast notification here
    const button = event.target.closest('button');
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('text-green-700');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('text-green-700');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy URL:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Webhook URL copied to clipboard!');
  }
};

const deleteWebhook = async (webhookId) => {
  if (!confirm("Are you sure you want to delete this webhook? This action cannot be undone.")) {
    return;
  }

  try {
    await useApi(`organization/${organizationId.value}/webhook/input/${webhookId}`, {
      method: "DELETE",
    });
    refresh();
  } catch (error) {
    console.error("Error deleting webhook:", error);
    alert("Failed to delete webhook. Please try again.");
  }
};
</script>