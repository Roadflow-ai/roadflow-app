<template>
  <ModalWrapper v-if="open">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Invite Team Member
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <label class="block text-sm font-medium text-gray-700">
            Team Invitations
          </label>
          <button
            type="button"
            @click="addInvitation"
            class="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            + Add Another
          </button>
        </div>
        
        <div
          v-for="(invitation, index) in invitations"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex justify-between items-start">
            <span class="text-sm font-medium text-gray-600">Invitation {{ index + 1 }}</span>
            <button
              v-if="invitations.length > 1"
              type="button"
              @click="removeInvitation(index)"
              class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
          
          <div>
            <label
              :for="`email-${index}`"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span class="text-red-500">*</span>
            </label>
            <input
              :id="`email-${index}`"
              v-model="invitation.email"
              type="email"
              :class="[
                'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
                errors[`email-${index}`]
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
              ]"
              placeholder="Enter email address"
              required
            />
            <p v-if="errors[`email-${index}`]" class="mt-1 text-sm text-red-600">
              {{ errors[`email-${index}`] }}
            </p>
          </div>

          <div>
            <label :for="`role-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              :id="`role-${index}`"
              v-model="invitation.role"
              required
              :class="[
                'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 capitalize',
                errors[`role-${index}`]
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500',
              ]"
            >
              <option value="">Select a role</option>
              <option
                v-for="role in availableRoles"
                :key="role.value"
                :value="role.value"
                class="capitalize"
              >
                {{ role.label }}
              </option>
            </select>
            <p v-if="errors[`role-${index}`]" class="mt-1 text-sm text-red-600">
              {{ errors[`role-${index}`] }}
            </p>
          </div>
        </div>
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
          {{ isSubmitting ? "Sending..." : "Send Invitation" }}
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

const emit = defineEmits(["close", "added"]);
const { organizationId } = useUserStore();
const isSubmitting = ref(false);
const generalError = ref("");

const invitations = ref([
  {
    email: "",
    role: "admin",
  },
]);

const errors = ref({});

const availableRoles = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

const clearErrors = () => {
  errors.value = {};
};

const addInvitation = () => {
  invitations.value.push({
    email: "",
    role: "admin",
  });
};

const removeInvitation = (index) => {
  invitations.value.splice(index, 1);
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  invitations.value.forEach((invitation, index) => {
    // Validate email
    if (!invitation.email.trim()) {
      errors.value[`email-${index}`] = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitation.email.trim())) {
      errors.value[`email-${index}`] = "Please enter a valid email address";
      isValid = false;
    }

    // Validate role
    if (!invitation.role) {
      errors.value[`role-${index}`] = "Role is required";
      isValid = false;
    }
  });

  // Check for duplicate emails
  const emails = invitations.value.map(inv => inv.email.trim().toLowerCase());
  const duplicates = emails.filter((email, index) => emails.indexOf(email) !== index);
  if (duplicates.length > 0) {
    invitations.value.forEach((invitation, index) => {
      if (duplicates.includes(invitation.email.trim().toLowerCase())) {
        errors.value[`email-${index}`] = "Duplicate email address";
        isValid = false;
      }
    });
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    await useApi(`organization/${organizationId}/invite`, {
      lazy: true,
      method: "POST",
      body: invitations.value,
    });

    emit("added");
    handleCancel();
  } catch (error) {
    generalError.value =
      "An error occurred while sending the invitation. Please try again.";
    console.error("Submit error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  invitations.value = [
    {
      email: "",
      role: "admin",
    },
  ];
  clearErrors();
};

const handleCancel = () => {
  resetForm();
  emit("close");
};
</script>
