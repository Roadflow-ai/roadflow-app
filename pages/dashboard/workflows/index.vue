<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between">
          <!-- Title & Stats -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z" clip-rule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Workflows</h1>
              <p class="text-gray-600 mt-1">
                Manage and organize your automation workflows
                <span v-if="workflows.length > 0" class="text-gray-500">
                  • {{ workflows.length }} workflow{{ workflows.length !== 1 ? 's' : '' }}
                </span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- Search (for future) -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search workflows..."
                class="w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <!-- Add Workflow Button -->
            <button
              @click="open = true"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600 text-lg">Loading workflows...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="flex items-center justify-center py-20">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error loading workflows</h3>
          <p class="text-gray-600 mb-4">There was a problem loading your workflows. Please try again.</p>
          <button
            @click="refreshWorkflows"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="status === 'success' && filteredWorkflows.length === 0 && searchQuery === ''" class="flex items-center justify-center py-20">
        <div class="text-center max-w-md">
          <div class="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-3">No workflows yet</h3>
          <p class="text-gray-600 mb-8">Get started by creating your first automation workflow. Build powerful sequences of tasks and agents.</p>
          <button
            @click="open = true"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Workflow
          </button>
        </div>
      </div>

      <!-- No Search Results -->
      <div v-else-if="filteredWorkflows.length === 0 && searchQuery !== ''" class="flex items-center justify-center py-20">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
          <p class="text-gray-600">Try adjusting your search terms</p>
        </div>
      </div>

      <!-- Workflows Grid -->
      <div v-else-if="status === 'success' && filteredWorkflows.length > 0" class="space-y-6">
        <!-- View Toggle (for future: grid/list view) -->
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ filteredWorkflows.length }} workflow{{ filteredWorkflows.length !== 1 ? 's' : '' }}
            <span v-if="searchQuery" class="text-gray-500">for "{{ searchQuery }}"</span>
          </h2>
        </div>

        <!-- Workflows Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="workflow in filteredWorkflows"
            :key="workflow._id"
            @click="$router.push(`/dashboard/workflows/${workflow._id}`)"
            class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all duration-200 cursor-pointer group"
          >
            <!-- Workflow Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      WORKFLOW
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Quick Actions -->
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- Workflow Content -->
            <div class="mb-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
                {{ workflow.prompt || 'Untitled Workflow' }}
              </h3>
              
              <!-- Workflow Meta -->
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <span class="capitalize">{{ workflow.agent || 'No agent' }}</span>
                </div>
              </div>
            </div>

            <!-- Workflow Footer -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatWorkflowDate(workflow.updatedAt) }}
              </div>
              
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Workflow Modal -->
    <WorkflowsAddWorkflow
      :open="open"
      @close="open = false"
      @added="refreshWorkflows"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

useSeoMeta({ title: "Workflows" });

const open = ref(false);
const searchQuery = ref('');
const { organizationId } = useUserStore();

const { data, status, pending, refresh } = await useApi(
  `workflow/${organizationId}`,
  {
    lazy: true,
  }
);

const refreshWorkflows = () => {
  refresh();
};

const workflows = computed(() => data.value?.data ?? []);

// Filter workflows based on search query
const filteredWorkflows = computed(() => {
  if (!searchQuery.value.trim()) {
    return workflows.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return workflows.value.filter(workflow => 
    workflow.prompt?.toLowerCase().includes(query) ||
    workflow.agent?.toLowerCase().includes(query)
  );
});

const formatWorkflowDate = (dateString) => {
  if (!dateString) return "Date not available";

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Show relative time for recent dates
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  
  // Show formatted date for older items
  const options = {
    year: "numeric",
    month: "short", 
    day: "numeric",
  };
  return date.toLocaleDateString("en", options);
};
</script>
