<template>
  <ModalWrapper v-if="open">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      {{ props.shouldBeHead ? "Create Head Agent Node" : "Create Agent Node" }}
    </h2>

    <div
      v-if="!props.shouldBeHead"
      class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md"
    >
      <p class="text-sm text-blue-700">
        This agent node will be linked to the workflow's head node.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Agent Selection -->
      <div>
        <label for="agent" class="block text-sm font-medium text-gray-700 mb-1">
          Agent <span class="text-red-500">*</span>
        </label>
        <select
          id="agent"
          v-model="formData.agent"
          required
          :class="[
            'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 capitalize',
            errors.agent
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
          ]"
        >
          <option value="">Select an agent</option>
          <option
            v-for="agent in agentsList"
            :key="agent"
            :value="agent"
            class="capitalize"
          >
            {{ agent }}
          </option>
        </select>
        <p v-if="errors.agent" class="mt-1 text-sm text-red-600">
          {{ errors.agent }}
        </p>
      </div>

      <!-- Prompt -->
      <div>
        <label
          for="prompt"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Prompt <span class="text-red-500">*</span>
        </label>
        <textarea
          id="prompt"
          v-model="formData.prompt"
          rows="4"
          required
          :class="[
            'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none',
            errors.prompt
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
          ]"
          placeholder="Enter the agent prompt..."
        ></textarea>
        <p v-if="errors.prompt" class="mt-1 text-sm text-red-600">
          {{ errors.prompt }}
        </p>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          :class="[
            'px-4 py-2 rounded-full transition-colors',
            isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-green-700 text-white hover:bg-green-800',
          ]"
        >
          {{ isSubmitting ? "Loading..." : "Add Agent Node" }}
        </button>
      </div>
    </form>
  </ModalWrapper>
</template>

<script setup>
import { shallowReactive } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  shouldBeHead: {
    type: Boolean,
    default: true,
  },
  parentNodeId: {
    type: String,
    default: null,
  },
});

const route = useRoute();
const workflowId = ref(route.params.id);

const emit = defineEmits(["close", "added"]);

const { organizationId } = useUserStore();
const { data } = await useApi(`agents/${organizationId}/all`);
const agentsList = computed(() => data?.value?.data || []);

const isSubmitting = ref(false);
const generalError = ref("");

const formData = shallowReactive({
  agent: "",
  prompt: "",
  is_task: false,
  is_head: props.shouldBeHead, // Agent nodes can be head nodes
});

const errors = ref({
  agent: "",
  prompt: "",
});

const clearErrors = () => {
  errors.value = {
    agent: "",
    prompt: "",
  };
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.agent) {
    errors.value.agent = "Agent is required";
    isValid = false;
  }

  if (!formData.prompt.trim()) {
    errors.value.prompt = "Prompt is required";
    isValid = false;
  } else if (formData.prompt.trim().length < 10) {
    errors.value.prompt = "Prompt must be at least 10 characters long";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Use the same endpoint pattern as task nodes
    const apiCall = {
      lazy: true,
      method: "POST",
      body: { ...formData },
    };

    // If this is not a head node, pass the head node ID
    // For non-head agent nodes, link to the workflow's head node
    if (!props.shouldBeHead && props.parentNodeId) {
      apiCall.query = {
        head_node: props.parentNodeId,
      };
    }
    // Head nodes don't need head_node parameter as they are the root

    await useApi(`workflow/${organizationId}/workflow`, apiCall);

    emit("added");
    handleCancel();
  } catch (error) {
    generalError.value =
      "An error occurred while creating the agent node. Please try again.";
    console.error("Submit error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.agent = "";
  formData.prompt = "";
  formData.is_task = false;
  formData.is_head = props.shouldBeHead;
  clearErrors();
};

const handleCancel = () => {
  resetForm();
  emit("close");
};
</script>
