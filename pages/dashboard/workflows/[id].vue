<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Minimal Header -->
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-medium text-gray-900">Workflow</h1>
            <span v-if="rawNodes.length > 0" class="text-sm text-gray-400">{{ rawNodes.length }}</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- Add Node Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click="showNodeDropdown = !showNodeDropdown"
                class="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </button>
              
              <div
                v-if="showNodeDropdown"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
              >
                <button
                  @click="handleAddTaskNode"
                  class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Task Node
                </button>
                
                <button
                  @click="handleAddAgentNode"
                  class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div :class="['w-2 h-2 rounded-full', !hasHeadNode ? 'bg-green-500' : 'bg-blue-500']"></div>
                  Agent Node
                  <span v-if="!hasHeadNode" class="text-xs text-green-600 ml-auto">head</span>
                </button>
              </div>
            </div>

            <!-- Delete Button -->
            <button
              @click="showDeleteWorkflow = true"
              class="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-50 transition-colors"
              title="Delete workflow"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading workflow...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-20">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Error loading workflow</h3>
          <p class="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="rawNodes.length === 0" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p class="text-gray-600 text-sm mb-4">No nodes in this workflow</p>
          <button
            @click="showNodeDropdown = true"
            class="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            Add Node
          </button>
        </div>
      </div>

      <!-- Workflow Flow Layout -->
      <div v-else>
        <!-- Flow Header -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Execution Flow</h3>
          <div class="text-xs text-gray-500">Nodes execute in the order shown below</div>
        </div>

        <!-- Flow Container -->
        <div class="max-w-2xl mx-auto">
          <div class="space-y-6">
            <div
              v-for="(node, index) in orderedNodes"
              :key="node._id"
              class="relative"
            >
              <!-- Execution Order Number -->
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 flex flex-col items-center">
                  <!-- Step Number -->
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2',
                    node.is_head ? 'bg-green-50 border-green-200 text-green-700' :
                    node.is_task ? 'bg-gray-50 border-gray-200 text-gray-700' :
                    'bg-blue-50 border-blue-200 text-blue-700'
                  ]">
                    {{ index + 1 }}
                  </div>
                  
                  <!-- Flow Connector Line -->
                  <div 
                    v-if="index < orderedNodes.length - 1"
                    class="w-0.5 h-16 bg-gray-200 mt-2"
                  ></div>
                </div>
                
                <!-- Node Card -->
                <div class="flex-1 min-w-0">
                  <WorkflowsNode
                    :nodeId="node._id"
                    :title="node.is_task ? node.task?.title : node.prompt"
                    :agent="node.agent"
                    :function_name="node?.task?.function_name"
                    :enabled="node.enabled"
                    :isHead="node.is_head"
                    :isTask="node.is_task"
                    :parameters="node.parameters"
                    :createdAt="node.createdAt"
                    :executionOrder="index + 1"
                    @edited="refreshNodes"
                    @deleted="refreshNodes"
                  />
                </div>
              </div>

              <!-- Next Flow Indicator -->
              <div 
                v-if="index < orderedNodes.length - 1"
                class="flex items-center justify-center mt-3 mb-3"
              >
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Next</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Flow End Indicator -->
          <div class="flex items-center justify-center mt-8 pt-6 border-t border-gray-100">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Workflow Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <WorkflowsAddNode
      @added="refreshNodes"
      :open="showAddTaskNode"
      @close="showAddTaskNode = false"
    />
    <WorkflowsAddNodeAgent
      @added="refreshNodes"
      :open="showAddAgentNode"
      @close="showAddAgentNode = false"
      :shouldBeHead="!hasHeadNode"
      :parentNodeId="headNodeId"
    />
    <WorkflowsDeleteWorkflow
      :organizationId="organizationId"
      :workflowId="workflowId"
      :open="showDeleteWorkflow"
      @close="showDeleteWorkflow = false"
    />
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'

useSeoMeta({ title: "Workflow" });

const route = useRoute();

const workflowId = ref(route.params.id);
const { organizationId } = useUserStore();
const showAddTaskNode = ref(false);
const showAddAgentNode = ref(false);
const showDeleteWorkflow = ref(false);
const showNodeDropdown = ref(false);
const dropdownRef = ref(null);

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  showNodeDropdown.value = false;
});

const { data, refresh, pending, error } = await useApi(
  `workflow/${organizationId}/nodes/${workflowId.value}`
);

const rawNodes = computed(() => data.value?.data || []);

// Check if workflow has a head node (agent node should be head if no head exists)
const hasHeadNode = computed(() => {
  return rawNodes.value.some(node => node.is_head);
});

// Get the head node ID for linking non-head nodes
const headNodeId = computed(() => {
  const headNode = rawNodes.value.find(node => node.is_head);
  return headNode?._id || null;
});

// Computed properties for node categorization and ordering
const headNodes = computed(() => rawNodes.value.filter(node => node.is_head));
const agentNodes = computed(() => rawNodes.value.filter(node => !node.is_task));
const taskNodes = computed(() => rawNodes.value.filter(node => node.is_task));

// Sort nodes using linked list structure based on next_flow
const sortNodesByLinkedList = (nodes) => {
  if (!nodes || nodes.length === 0) return [];
  
  // Create a map for O(1) lookup
  const nodeMap = new Map();
  nodes.forEach(node => nodeMap.set(node._id, node));
  
  // Find head node (starting point of linked list)
  const headNode = nodes.find(node => node.is_head);
  if (!headNode) {
    console.warn('No head node found, falling back to original sorting');
    return [...nodes];
  }
  
  const sortedNodes = [];
  let currentNode = headNode;
  const visited = new Set();
  
  // Traverse the linked list using next_flow
  while (currentNode && !visited.has(currentNode._id)) {
    visited.add(currentNode._id);
    sortedNodes.push(currentNode);
    
    // Move to next node if next_flow exists
    if (currentNode.next_flow && nodeMap.has(currentNode.next_flow)) {
      currentNode = nodeMap.get(currentNode.next_flow);
    } else {
      break;
    }
  }
  
  // Add any remaining nodes that weren't part of the linked list
  const remainingNodes = nodes.filter(node => !visited.has(node._id));
  if (remainingNodes.length > 0) {
    console.warn('Found nodes not in linked list:', remainingNodes);
    sortedNodes.push(...remainingNodes);
  }
  
  return sortedNodes;
};

// Order nodes using linked list structure or fall back to type-based ordering
const orderedNodes = computed(() => {
  const nodes = rawNodes.value;
  
  // Check if nodes have next_flow field for linked list sorting
  const hasNextFlow = nodes.some(node => node.next_flow !== undefined);
  
  if (hasNextFlow) {
    return sortNodesByLinkedList(nodes);
  } else {
    // Fallback to original sorting
    const head = nodes.filter(node => node.is_head);
    const agents = nodes.filter(node => !node.is_task && !node.is_head);
    const tasks = nodes.filter(node => node.is_task);
    return [...head, ...agents, ...tasks];
  }
});

const refreshNodes = () => {
  refresh();
};

const handleAddTaskNode = () => {
  showAddTaskNode.value = true;
  showNodeDropdown.value = false;
};

const handleAddAgentNode = () => {
  showAddAgentNode.value = true;
  showNodeDropdown.value = false;
};
</script>
