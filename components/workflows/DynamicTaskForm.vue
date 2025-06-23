<template>
  <div v-if="selectedTask" class="border-t pt-4">
    <h3 class="text-lg font-medium text-gray-700 mb-3">
      Parameters for {{ selectedTask.title }}
    </h3>
    
    <!-- Dynamic parameter fields -->
    <div v-for="(field, fieldName) in parameterFields" :key="fieldName" class="mb-4">
      <label
        :for="`param_${fieldName}`"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>
      
      <!-- Text Input -->
      <input
        v-if="field.type === 'text' || field.type === 'email'"
        :id="`param_${fieldName}`"
        v-model="modelValue[fieldName]"
        :type="field.type"
        :required="field.required"
        :placeholder="field.placeholder"
        :class="[
          'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
          errors[fieldName]
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        ]"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :id="`param_${fieldName}`"
        v-model="modelValue[fieldName]"
        :required="field.required"
        :placeholder="field.placeholder"
        rows="4"
        :class="[
          'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none',
          errors[fieldName]
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        ]"
      ></textarea>
      
      <!-- Select -->
      <select
        v-else-if="field.type === 'select'"
        :id="`param_${fieldName}`"
        v-model="modelValue[fieldName]"
        :required="field.required"
        :class="[
          'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
          errors[fieldName]
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        ]"
      >
        <option value="">{{ field.placeholder || 'Select an option' }}</option>
        <option
          v-for="option in field.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Number Input -->
      <input
        v-else-if="field.type === 'number'"
        :id="`param_${fieldName}`"
        v-model.number="modelValue[fieldName]"
        type="number"
        :required="field.required"
        :placeholder="field.placeholder"
        :min="field.min"
        :max="field.max"
        :step="field.step"
        :class="[
          'bg-gray-50 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2',
          errors[fieldName]
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
        ]"
      />
      
      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" class="flex items-center">
        <input
          :id="`param_${fieldName}`"
          v-model="modelValue[fieldName]"
          type="checkbox"
          class="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span class="text-sm text-gray-600">{{ field.description }}</span>
      </div>
      
      <!-- Error message -->
      <p v-if="errors[fieldName]" class="mt-1 text-sm text-red-600">
        {{ errors[fieldName] }}
      </p>
      
      <!-- Help text -->
      <p v-if="field.description && field.type !== 'checkbox'" class="mt-1 text-xs text-gray-500">
        {{ field.description }}
      </p>
    </div>
    
    <!-- Function name display -->
    <div v-if="selectedTask.function_name" class="mt-4 p-3 bg-gray-50 rounded-md">
      <p class="text-sm text-gray-600">
        <span class="font-medium">Function:</span> {{ selectedTask.function_name }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  selectedTask: {
    type: Object,
    default: null
  },
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

// Default parameter schema (fallback for current API structure)
const defaultParameterSchema = {
  to: {
    type: 'email',
    label: 'To Email',
    required: true,
    placeholder: 'recipient@example.com',
    description: 'Email address of the recipient'
  },
  Subject: {
    type: 'text',
    label: 'Subject',
    required: true,
    placeholder: 'Result of the previous task',
    description: 'Email subject line'
  }
}

// Enhanced parameter schemas for different task types
const taskParameterSchemas = {
  // Email task
  'send_email': {
    to: {
      type: 'email',
      label: 'To Email',
      required: true,
      placeholder: 'recipient@example.com'
    },
    subject: {
      type: 'text',
      label: 'Subject',
      required: true,
      placeholder: 'Email subject'
    },
    body: {
      type: 'textarea',
      label: 'Message Body',
      required: true,
      placeholder: 'Email content'
    },
    cc: {
      type: 'email',
      label: 'CC Email',
      required: false,
      placeholder: 'cc@example.com'
    }
  },
  
  // SMS task
  'send_sms': {
    to: {
      type: 'text',
      label: 'Phone Number',
      required: true,
      placeholder: '+1234567890'
    },
    message: {
      type: 'textarea',
      label: 'Message',
      required: true,
      placeholder: 'SMS message content'
    }
  },
  
  // Webhook task
  'webhook': {
    url: {
      type: 'text',
      label: 'Webhook URL',
      required: true,
      placeholder: 'https://api.example.com/webhook'
    },
    method: {
      type: 'select',
      label: 'HTTP Method',
      required: true,
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' }
      ]
    },
    headers: {
      type: 'textarea',
      label: 'Headers (JSON)',
      required: false,
      placeholder: '{"Content-Type": "application/json"}'
    },
    body: {
      type: 'textarea',
      label: 'Request Body',
      required: false,
      placeholder: 'Request payload'
    }
  },
  
  // File processing task
  'process_file': {
    file_path: {
      type: 'text',
      label: 'File Path',
      required: true,
      placeholder: '/path/to/file.txt'
    },
    action: {
      type: 'select',
      label: 'Action',
      required: true,
      options: [
        { value: 'read', label: 'Read File' },
        { value: 'copy', label: 'Copy File' },
        { value: 'move', label: 'Move File' },
        { value: 'delete', label: 'Delete File' }
      ]
    },
    destination: {
      type: 'text',
      label: 'Destination Path',
      required: false,
      placeholder: '/path/to/destination'
    }
  }
}

// Computed property to get parameter fields based on selected task
const parameterFields = computed(() => {
  if (!props.selectedTask) return {}
  
  // Check if task has custom parameter schema
  const functionName = props.selectedTask.function_name
  if (functionName && taskParameterSchemas[functionName]) {
    return taskParameterSchemas[functionName]
  }
  
  // Check if task template has its own parameter schema
  if (props.selectedTask.parameters_schema) {
    return props.selectedTask.parameters_schema
  }
  
  // Fall back to default schema
  return defaultParameterSchema
})

// Watch for task changes and initialize parameters
watch(() => props.selectedTask, (newTask) => {
  if (!newTask) return
  
  const newParameters = { ...props.modelValue } || {}
  Object.keys(parameterFields.value).forEach(fieldName => {
    // Only set default if field doesn't already have a value
    if (newParameters[fieldName] === undefined || newParameters[fieldName] === null) {
      const field = parameterFields.value[fieldName]
      if (field.type === 'checkbox') {
        newParameters[fieldName] = false
      } else if (field.type === 'number') {
        newParameters[fieldName] = field.default || 0
      } else {
        newParameters[fieldName] = field.default || ''
      }
    }
  })
  
  emit('update:modelValue', newParameters)
}, { immediate: true })

// Watch parameter values and emit updates
watch(() => props.modelValue, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>