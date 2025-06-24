<template>
  <NuxtLayout name="settings">
    <div class="space-y-8">
      <!-- Input Webhooks Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Input Webhooks</h3>
              <p class="mt-1 text-sm text-gray-600">
                Configure external integrations and webhook endpoints
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {{ webhooks.length }} {{ webhooks.length === 1 ? 'webhook' : 'webhooks' }}
              </span>
              <button
                @click="openCreateModal"
                class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Icon name="uil:plus" size="16" />
                Create Webhook
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div v-if="pending" class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p class="text-sm text-gray-600">Loading webhooks...</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="status === 'error'" class="text-center py-12">
            <div class="text-red-500 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading webhooks</h3>
            <p class="text-sm text-gray-600 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
            <button 
              @click="refresh"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Icon name="uil:refresh" size="16" class="mr-2" />
              Retry
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="webhooks.length === 0 && status === 'success'" class="text-center py-12">
            <div class="mx-auto w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="uil:web-grid" size="32" class="text-purple-600" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No webhooks yet</h3>
            <p class="text-gray-500 mb-6 max-w-sm mx-auto">Create your first input webhook to start receiving events from external services</p>
            <button
              @click="openCreateModal"
              class="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors inline-flex items-center gap-2"
            >
              <Icon name="uil:plus" size="16" />
              Create Webhook
            </button>
          </div>

          <!-- Webhooks Grid -->
          <div
            v-else-if="webhooks.length > 0 && status === 'success'"
            class="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div
              v-for="webhook in webhooks"
              :key="webhook.id"
              class="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="text-lg font-medium text-gray-900 truncate">
                      {{ webhook.name }}
                    </h4>
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {{ webhook.type }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-3">
                    {{ webhook.description }}
                  </p>
                </div>
                <div class="flex items-center gap-1 ml-4">
                  <button
                    @click="copyWebhookUrl(webhook)"
                    class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-white"
                    title="Copy webhook URL"
                  >
                    <Icon name="uil:copy" size="16" />
                  </button>
                  <button
                    @click="deleteWebhook(webhook.id)"
                    class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-white"
                    title="Delete webhook"
                  >
                    <Icon name="uil:trash-alt" size="16" />
                  </button>
                </div>
              </div>

              <div class="space-y-4">
                <!-- Webhook URL -->
                <div class="bg-white p-4 rounded-md border border-gray-200">
                  <div class="flex justify-between items-center mb-2">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide">Webhook URL</label>
                    <button
                      @click="copyWebhookUrl(webhook)"
                      class="text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                  <div class="bg-gray-50 p-2 rounded border">
                    <code class="text-xs text-gray-700 break-all font-mono">
                      {{ getWebhookUrl(webhook) }}
                    </code>
                  </div>
                </div>
                
                <!-- Metadata -->
                <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div>
                    <p class="text-xs text-gray-500">Created</p>
                    <p class="text-sm font-medium text-gray-700">
                      {{ formatDate(webhook.createdAt) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Status</p>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
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
  </NuxtLayout>
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