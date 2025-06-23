<template>
  <ModalWrapper v-if="open">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Create Input Webhook
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label
          for="name"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
            errors.name
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
          ]"
          placeholder="Enter webhook name"
          required
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          :class="[
            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none',
            errors.description
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
          ]"
          placeholder="Enter webhook description"
          rows="3"
          required
        />
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </p>
      </div>

      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
          Type <span class="text-red-500">*</span>
        </label>
        <select
          id="type"
          v-model="formData.type"
          required
          :class="[
            'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
            errors.type
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
          ]"
        >
          <option value="">Select webhook type</option>
          <option value="git">Git</option>
        </select>
        <p v-if="errors.type" class="mt-1 text-sm text-red-600">
          {{ errors.type }}
        </p>
      </div>

      <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
        <p class="text-sm text-red-600">{{ generalError }}</p>
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
          {{ isSubmitting ? "Creating..." : "Create Webhook" }}
        </button>
      </div>
    </form>
  </ModalWrapper>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "created"]);
const { organizationId } = useUserStore();
const isSubmitting = ref(false);
const generalError = ref("");

const formData = shallowReactive({
  name: "",
  description: "",
  type: "",
});

const errors = ref({
  name: "",
  description: "",
  type: "",
});

const clearErrors = () => {
  errors.value = {
    name: "",
    description: "",
    type: "",
  };
  generalError.value = "";
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  // Validate name
  if (!formData.name.trim()) {
    errors.value.name = "Name is required";
    isValid = false;
  } else if (formData.name.trim().length < 3) {
    errors.value.name = "Name must be at least 3 characters long";
    isValid = false;
  }

  // Validate description
  if (!formData.description.trim()) {
    errors.value.description = "Description is required";
    isValid = false;
  } else if (formData.description.trim().length < 10) {
    errors.value.description = "Description must be at least 10 characters long";
    isValid = false;
  }

  // Validate type
  if (!formData.type) {
    errors.value.type = "Type is required";
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
    await useApi(`organization/${organizationId}/webhook/input`, {
      lazy: true,
      method: "POST",
      body: { ...formData },
    });

    emit("created");
    handleCancel();
  } catch (error) {
    generalError.value =
      "An error occurred while creating the webhook. Please try again.";
    console.error("Submit error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.name = "";
  formData.description = "";
  formData.type = "";
  clearErrors();
};

const handleCancel = () => {
  resetForm();
  emit("close");
};
</script>