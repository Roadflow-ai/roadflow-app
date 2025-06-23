<template>
  <div class="flex flex-col gap-5">
    <header class="flex items-start justify-between gap-4">
      <h3 class="text-2xl font-semibold text-gray-900">Workflow</h3>
      <div class="flex space-x-4">
        <!-- Dropdown for Add Node -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="showNodeDropdown = !showNodeDropdown"
            class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 flex items-center gap-2"
          >
            Add Node
            <svg
              class="w-4 h-4 transform transition-transform"
              :class="{ 'rotate-180': showNodeDropdown }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div
            v-if="showNodeDropdown"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
          >
            <button
              @click="handleAddTaskNode"
              class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
            >
              Add Task Node
            </button>
            <button
              @click="handleAddAgentNode"
              class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
            >
              Add Agent Node
              <span v-if="!hasHeadNode" class="text-xs text-green-600 block">
                (Will be head node)
              </span>
              <span v-else-if="hasHeadNode" class="text-xs text-blue-600 block">
                (Will link to head node)
              </span>
            </button>
          </div>
        </div>

        <button
          @click="showDeleteWorkflow = true"
          class="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
        >
          Delete Workflow
        </button>
      </div>
    </header>
    <div v-if="pending">Loading workflow...</div>
    <div v-else-if="error">Error loading workflow</div>
    <div v-else class="grid grid-cols-[repeat(auto-fit,300px)] gap-4">
      <WorkflowsNode
        v-for="node in rawNodes"
        :key="node._id"
        :nodeId="node._id"
        :title="node.is_task ? node.task?.title : node.prompt"
        :agent="node.agent"
        :function_name="node?.task?.function_name"
        :enabled="node.enabled"
        :isHead="node.is_head"
        :isTask="node.is_task"
        :parameters="node.parameters"
        :createdAt="node.createdAt"
        @edited="refreshNodes"
        @deleted="refreshNodes"
      />

      <div v-if="rawNodes.length === 0" class="empty-state">
        No nodes found.
      </div>
    </div>
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
