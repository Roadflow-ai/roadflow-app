<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Logs Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Logs</h1>
              <p class="mt-1 text-sm text-gray-600">
                View and monitor your organization's activity logs
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="bg-blue-50 px-3 py-1 rounded-full">
                <span class="text-xs font-medium text-blue-700">
                  {{ total || 0 }} total entries
                </span>
              </div>
              <button
                @click="refresh"
                :disabled="pending"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon
                  name="uil:refresh"
                  size="16"
                  :class="['mr-2', { 'animate-spin': pending }]"
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Search -->
            <div class="md:col-span-2">
              <label
                for="search"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Search logs
              </label>
              <div class="relative">
                <input
                  id="search"
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by source, agent, or data..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  @keyup.enter="applyFilters"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Icon name="uil:search" size="16" class="text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Type Filter -->
            <div>
              <label
                for="type-filter"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Type
              </label>
              <select
                id="type-filter"
                v-model="selectedType"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                @change="applyFilters"
              >
                <option value="">All types</option>
                <option
                  v-for="type in availableTypes"
                  :key="type"
                  :value="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>

            <!-- Source Filter -->
            <div>
              <label
                for="source-filter"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Source
              </label>
              <select
                id="source-filter"
                v-model="selectedSource"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                @change="applyFilters"
              >
                <option value="">All sources</option>
                <option
                  v-for="source in availableSources"
                  :key="source"
                  :value="source"
                >
                  {{ source }}
                </option>
              </select>
            </div>

            <!-- Page Size -->
            <div>
              <label
                for="page-size"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Per page
              </label>
              <select
                id="page-size"
                v-model="pageLimit"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                @change="applyFilters"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div
            class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200"
          >
            <div class="text-sm text-gray-500">
              Showing {{ logs.length }} of {{ total || 0 }} entries
              <span v-if="totalPages > 1">
                ({{ pageLimit }} per page, page {{ currentPage }} of
                {{ totalPages }})
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="clearFilters"
                v-if="hasActiveFilters"
                class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear filters
              </button>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div
              class="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"
            ></div>
            <p class="text-sm text-gray-600">Loading logs...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="text-red-500 mb-4">
            <svg
              class="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Error loading logs
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
          <button
            @click="refresh"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="uil:refresh" size="16" class="mr-2" />
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="logs.length === 0" class="text-center py-12">
          <div
            class="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4"
          >
            <Icon name="uil:file-search-alt" size="32" class="text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
          <p class="text-gray-500 mb-6 max-w-sm mx-auto">
            {{
              hasActiveFilters
                ? "No logs match your current filters. Try adjusting your search criteria."
                : "No activity logs have been recorded yet."
            }}
          </p>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <!-- Logs Content -->
        <div v-else>
          <!-- Table Header -->
          <div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div
              class="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div class="col-span-2">Type & Source</div>
              <div class="col-span-2">Agent & Source ID</div>
              <div class="col-span-4">Data</div>
              <div class="col-span-2">Source Events</div>
              <div class="col-span-2">ID & Timestamp</div>
            </div>
          </div>

          <!-- Log Entries -->
          <div class="divide-y divide-gray-200">
            <LogsEntry
              v-for="log in logs"
              :key="log.id"
              :log="log"
              @showDetail="showLogDetail"
            />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ getPageStartEntry() }}-{{ getPageEndEntry() }} of
          {{ total }} entries
        </div>
        <nav class="flex items-center space-x-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="uil:angle-left" size="16" />
          </button>

          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="uil:angle-right" size="16" />
          </button>
        </nav>
      </div>
    </div>

    <!-- Log Detail Modal -->
    <LogsDetailModal
      :open="showDetailModal"
      :log="selectedLog"
      @close="closeLogDetail"
    />
  </div>
</template>

<script setup>
useSeoMeta({ title: "Logs" });

const userStore = useUserStore();

if (!userStore.organizationId) {
  await userStore.fetchOrganization();
}

const organizationId = computed(() => userStore.organizationId);

// Reactive state
const currentPage = ref(1);
const pageLimit = ref(20); // Default page size
const searchQuery = ref("");
const selectedType = ref("");
const selectedSource = ref("");
const showDetailModal = ref(false);
const selectedLog = ref(null);

// API call with reactive query parameters
const { data, pending, error, refresh } = await useApi(
  `organization/${organizationId.value}/logs`,
  {
    query: computed(() => ({
      page: currentPage.value,
      limit: pageLimit.value,
      search: searchQuery.value || undefined,
      type: selectedType.value || undefined,
      source: selectedSource.value || undefined,
    })),
    lazy: true,
  }
);

// Computed properties
const logs = computed(() => data.value?.data || []);
const total = computed(() => data.value?.total || 0);
const totalPages = computed(() => data.value?.pages || 1);

// Filter options computed from current logs
const availableTypes = computed(() => {
  const types = new Set();
  logs.value.forEach((log) => {
    if (log.type) types.add(log.type);
  });
  return Array.from(types).sort();
});

const availableSources = computed(() => {
  const sources = new Set();
  logs.value.forEach((log) => {
    if (log.source) sources.add(log.source);
  });
  return Array.from(sources).sort();
});

const availableAgents = computed(() => {
  const agents = new Set();
  logs.value.forEach((log) => {
    if (log.agent) agents.add(log.agent);
  });
  return Array.from(agents).sort();
});

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedType.value || selectedSource.value;
});

// Pagination helpers
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const applyFilters = () => {
  currentPage.value = 1;
  refresh();
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedType.value = "";
  selectedSource.value = "";
  pageLimit.value = 20; // Reset to default
  currentPage.value = 1;
  refresh();
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    refresh();
  }
};

const getPageStartEntry = () => {
  return (currentPage.value - 1) * pageLimit.value + 1;
};

const getPageEndEntry = () => {
  const end = currentPage.value * pageLimit.value;
  return Math.min(end, total.value);
};

const showLogDetail = (log) => {
  selectedLog.value = log;
  showDetailModal.value = true;
};

const closeLogDetail = () => {
  showDetailModal.value = false;
  selectedLog.value = null;
};

// Watch for organization changes
watch(
  () => organizationId.value,
  () => {
    if (organizationId.value) {
      refresh();
    }
  }
);
</script>
