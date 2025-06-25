<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Logs Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4 sm:py-6">
          <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Logs</h1>
              <p class="mt-1 text-sm text-gray-600">
                View and monitor your organization's activity logs
              </p>
            </div>
            <div class="flex items-center justify-between sm:justify-end space-x-3">
              <div class="bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full">
                <span class="text-xs font-medium text-blue-700">
                  {{ total || 0 }} {{ total === 1 ? 'entry' : 'entries' }}
                </span>
              </div>
              <button
                @click="refresh"
                :disabled="pending"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[40px]"
              >
                <Icon
                  name="uil:refresh"
                  size="16"
                  :class="['sm:mr-2', { 'animate-spin': pending }]"
                />
                <span class="hidden sm:inline">Refresh</span>
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
        <div class="p-4 sm:p-6">
          <div class="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-4">
            <!-- Search -->
            <div class="lg:col-span-2">
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
            class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-4 pt-4 border-t border-gray-200"
          >
            <div class="text-sm text-gray-500">
              <span class="block sm:inline">Showing {{ logs.length }} of {{ total || 0 }} entries</span>
              <span v-if="totalPages > 1" class="block sm:inline sm:ml-1">
                ({{ pageLimit }} per page, page {{ currentPage }} of {{ totalPages }})
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="clearFilters"
                v-if="hasActiveFilters"
                class="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors min-h-[40px]"
              >
                Clear filters
              </button>
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors min-h-[40px]"
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
          <!-- Desktop Table View -->
          <div class="hidden lg:block">
            <!-- Table Header -->
            <div class="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div
                class="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div class="col-span-2">Type</div>
                <div class="col-span-2">Source Log Reference</div>
                <div class="col-span-3">Data</div>
                <div class="col-span-2">Source Event</div>
                <div class="col-span-3">Created At</div>
              </div>
            </div>

            <!-- Desktop Log Entries -->
            <div class="divide-y divide-gray-200">
              <div
                v-for="log in logs"
                :key="log.id"
                class="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div class="grid grid-cols-12 gap-4 items-center cursor-pointer hover:bg-gray-50" @click="showLogDetail(log)">
                  <!-- Type -->
                  <div class="col-span-2">
                    <span class="text-sm font-medium text-gray-900">{{ log.type || 'N/A' }}</span>
                  </div>

                  <!-- Source Log Reference -->
                  <div class="col-span-2">
                    <div class="flex flex-col space-y-1">
                      <span v-if="log.source" class="text-sm text-gray-900 font-mono truncate">{{ log.source.substring(0, 12) }}...</span>
                      <span v-else class="text-sm text-gray-500 italic">No reference</span>
                      <span v-if="log.source_event?.type" class="text-xs text-gray-500">
                        → {{ log.source_event.type }}
                      </span>
                    </div>
                  </div>

                  <!-- Data -->
                  <div class="col-span-3">
                    <div class="text-sm text-gray-900 truncate">
                      <span v-if="typeof log.data === 'string'">{{ log.data.substring(0, 80) }}{{ log.data.length > 80 ? '...' : '' }}</span>
                      <span v-else-if="log.data && typeof log.data === 'object'">{{ JSON.stringify(log.data).substring(0, 80) }}...</span>
                      <span v-else-if="Array.isArray(log.data)">Array ({{ log.data.length }} items)</span>
                      <span v-else class="text-gray-500 italic">No data</span>
                    </div>
                  </div>

                  <!-- Source Event -->
                  <div class="col-span-2">
                    <div class="flex flex-col space-y-1">
                      <span v-if="log.source_event && typeof log.source_event === 'object'" class="text-sm text-gray-900">
                        <span v-if="log.source_event.id" class="font-mono truncate">{{ log.source_event.id }}</span>
                        <span v-else>Referenced log data</span>
                      </span>
                      <span v-else-if="log.source_event" class="text-sm text-gray-900">{{ log.source_event }}</span>
                      <span v-else class="text-sm text-gray-500 italic">No source event</span>
                      <span v-if="log.source_event?.createdAt" class="text-xs text-gray-500">
                        {{ formatDate(log.source_event.createdAt) }}
                      </span>
                    </div>
                  </div>

                  <!-- Created At -->
                  <div class="col-span-3">
                    <div class="flex flex-col space-y-1">
                      <span class="text-sm text-gray-900">{{ formatDateTime(log.createdAt) }}</span>
                      <span class="text-xs text-gray-500 font-mono truncate">ID: {{ log.id.substring(0, 8) }}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Card View -->
          <div class="lg:hidden space-y-3">
            <div
              v-for="log in logs"
              :key="log.id"
              @click="showLogDetail(log)"
              class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md active:shadow-lg transition-all cursor-pointer touch-manipulation"
            >
              <!-- Header: Type and Time -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2 min-w-0 flex-1">
                  <span 
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="getTypeBadgeClass(log.type)"
                  >
                    {{ log.type || 'Unknown' }}
                  </span>
                  <span v-if="log.source_event?.type" class="text-xs text-gray-400 truncate">
                    → {{ log.source_event.type }}
                  </span>
                </div>
                <div class="text-right ml-2 flex-shrink-0">
                  <div class="text-xs font-medium text-gray-900">{{ formatTime(log.createdAt) }}</div>
                  <div class="text-xs text-gray-500">{{ formatDate(log.createdAt) }}</div>
                </div>
              </div>

              <!-- Data Preview -->
              <div class="mb-3">
                <p class="text-sm text-gray-900 leading-relaxed">
                  <span v-if="typeof log.data === 'string'" class="break-words">
                    {{ log.data.length > 100 ? log.data.substring(0, 100) + '...' : log.data }}
                  </span>
                  <span v-else-if="log.data && typeof log.data === 'object'" class="font-mono text-sm break-all">
                    {{ JSON.stringify(log.data).substring(0, 100) }}...
                  </span>
                  <span v-else-if="Array.isArray(log.data)" class="italic text-gray-600">
                    Array with {{ log.data.length }} {{ log.data.length === 1 ? 'item' : 'items' }}
                  </span>
                  <span v-else class="text-gray-500 italic">No data available</span>
                </p>
              </div>

              <!-- Footer: Source Reference and ID -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center space-x-2 min-w-0 flex-1">
                  <span v-if="log.source" class="inline-flex items-center font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 truncate max-w-[120px]">
                    {{ log.source.substring(0, 12) }}...
                  </span>
                  <span v-else class="text-xs text-gray-400 italic">No reference</span>
                </div>
                <span class="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded ml-2 flex-shrink-0">
                  {{ log.id.substring(0, 8) }}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6">
        <!-- Mobile Pagination -->
        <div class="flex items-center justify-between sm:hidden">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="uil:angle-left" size="16" class="mr-1" />
            Previous
          </button>
          <span class="text-sm text-gray-700">
            {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <Icon name="uil:angle-right" size="16" class="ml-1" />
          </button>
        </div>

        <!-- Desktop Pagination -->
        <div class="hidden sm:flex sm:items-center sm:justify-between">
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
    </div>
    </div>

    <!-- Log Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeLogDetail"></div>

        <!-- Modal content -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg sm:max-w-2xl mx-4 sm:mx-0">
          <!-- Header -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Log Details</h3>
              <button
                @click="closeLogDetail"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <Icon name="uil:times" size="20" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-4 py-4 sm:px-6 sm:py-5 max-h-[70vh] overflow-y-auto">

            <div v-if="selectedLog" class="space-y-4">
              <!-- Log ID -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ID</label>
                <p class="text-sm text-gray-900 font-mono bg-gray-50 p-3 rounded break-all">{{ selectedLog.id }}</p>
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getTypeBadgeClass(selectedLog.type)"
                >
                  {{ selectedLog.type || 'Unknown' }}
                </span>
              </div>

              <!-- Source Log Reference -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Source Log Reference</label>
                <div class="bg-gray-50 p-3 rounded">
                  <p v-if="selectedLog.source" class="text-sm text-gray-900 font-mono mb-2 break-all">{{ selectedLog.source }}</p>
                  <p v-else class="text-sm text-gray-500 italic">No source log reference</p>
                  <p v-if="selectedLog.source_event?.type" class="text-xs text-gray-600">
                    References a <span class="font-medium">{{ selectedLog.source_event.type }}</span> log
                  </p>
                </div>
              </div>

            <!-- Source Event (Referenced Log) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Source Event (Referenced Log Data)</label>
              <div class="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                <div v-if="selectedLog.source_event" class="space-y-2">
                  <div v-if="selectedLog.source_event.id" class="text-xs text-gray-600 border-b border-gray-200 pb-1">
                    <strong>Referenced Log ID:</strong> {{ selectedLog.source_event.id }}
                  </div>
                  <div v-if="selectedLog.source_event.type" class="text-xs text-gray-600">
                    <strong>Type:</strong> {{ selectedLog.source_event.type }}
                  </div>
                  <div v-if="selectedLog.source_event.createdAt" class="text-xs text-gray-600">
                    <strong>Created:</strong> {{ formatDateTime(selectedLog.source_event.createdAt) }}
                  </div>
                  <div v-if="selectedLog.source_event.data" class="mt-2">
                    <div class="text-xs text-gray-600 mb-1"><strong>Data:</strong></div>
                    <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ formatLogData(selectedLog.source_event.data) }}</pre>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500 italic">No source event data</p>
              </div>
            </div>

            <!-- Data -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <div class="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ formatLogData(selectedLog.data) }}</pre>
              </div>
            </div>

            <!-- Created At -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
              <p class="text-sm text-gray-900">{{ formatDateTime(selectedLog.createdAt) }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200">
            <div class="flex justify-end">
              <button
                @click="closeLogDetail"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors min-h-[40px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';

useSeoMeta({ title: "Logs" });

const userStore = useUserStore();

if (!userStore.organizationId) {
  await userStore.fetchOrganizations();
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

// Helper functions for formatting
const formatDate = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM D, YYYY');
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

const formatLogData = (data) => {
  if (!data) return 'No data';
  if (typeof data === 'string') return data;
  return JSON.stringify(data, null, 2);
};

const formatTime = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('h:mm A');
};

const getTypeBadgeClass = (type) => {
  const typeClasses = {
    'error': 'bg-red-100 text-red-800',
    'warning': 'bg-yellow-100 text-yellow-800',
    'info': 'bg-blue-100 text-blue-800',
    'success': 'bg-green-100 text-green-800',
    'debug': 'bg-gray-100 text-gray-800',
    'webhook': 'bg-purple-100 text-purple-800',
    'api': 'bg-indigo-100 text-indigo-800',
    'system': 'bg-orange-100 text-orange-800',
    'user': 'bg-teal-100 text-teal-800',
    'workflow': 'bg-pink-100 text-pink-800'
  };
  
  return typeClasses[type?.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
