<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Background overlay -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900" id="modal-title">
              Log Entry Details
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Full details for log entry {{ log?.id }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="uil:times" size="24" />
          </button>
        </div>

        <!-- Log Content -->
        <div v-if="log" class="space-y-6">
          <!-- Basic Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Basic Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Type</div>
                <div class="mt-1 flex items-center space-x-2">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    getTypeColor(log.type)
                  ]"></div>
                  <span class="text-sm text-gray-900">{{ log.type || 'Unknown' }}</span>
                </div>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</div>
                <div class="mt-1 text-sm text-gray-900">{{ log.source || 'No source' }}</div>
              </div>
              <div v-if="log.source_id">
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Source ID</div>
                <div class="mt-1 text-sm font-mono text-gray-900 break-all">{{ log.source_id }}</div>
              </div>
            </div>
          </div>

          <!-- IDs -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Identifiers</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID</div>
                <div class="mt-1 text-sm font-mono text-gray-900 break-all">{{ log.id }}</div>
              </div>
              <div v-if="log.source_id">
                <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Source ID</div>
                <div class="mt-1 text-sm font-mono text-gray-900 break-all">{{ log.source_id }}</div>
              </div>
            </div>
          </div>

          <!-- Data -->
          <div v-if="log.data">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Data</h4>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm text-green-400 whitespace-pre-wrap"><code>{{ formatDataForDisplay(log.data) }}</code></pre>
            </div>
          </div>

          <!-- Source Events -->
          <div v-if="hasSourceEvent">
            <h4 class="text-sm font-medium text-gray-900 mb-3">
              Source Events ({{ log.source_event.length }})
            </h4>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div 
                v-for="(event, index) in log.source_event" 
                :key="index"
                class="bg-gray-900 rounded-lg p-4 overflow-x-auto"
              >
                <div class="text-xs text-green-300 mb-2">Event {{ index + 1 }}:</div>
                <pre class="text-sm text-green-400 whitespace-pre-wrap"><code>{{ JSON.stringify(event, null, 2) }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Embeddings -->
          <div v-if="log.embeddings && log.embeddings.length > 0">
            <h4 class="text-sm font-medium text-gray-900 mb-3">
              Embeddings ({{ log.embeddings.length }})
            </h4>
            <div class="space-y-3 max-h-60 overflow-y-auto">
              <div 
                v-for="(embedding, index) in log.embeddings" 
                :key="index"
                class="bg-purple-50 border border-purple-200 rounded-lg p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-purple-900">Embedding {{ index + 1 }}</span>
                  <span class="text-xs text-purple-600">
                    {{ Array.isArray(embedding) ? `${embedding.length} dimensions` : 'Custom format' }}
                  </span>
                </div>
                <div class="bg-purple-900 rounded p-2 overflow-x-auto">
                  <pre class="text-xs text-purple-200 whitespace-pre-wrap"><code>{{ formatEmbeddingForDisplay(embedding) }}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              @click="copyLogData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Icon name="uil:copy" size="16" class="mr-2" />
              Copy Log Data
            </button>
            <button
              @click="$emit('close')"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  log: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const hasSourceEvent = computed(() => {
  return props.log?.source_event && 
         Array.isArray(props.log.source_event) && 
         props.log.source_event.length > 0;
});

const formatDataForDisplay = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  return JSON.stringify(data, null, 2);
};

const formatEmbeddingForDisplay = (embedding) => {
  if (Array.isArray(embedding)) {
    if (embedding.length <= 10) {
      return JSON.stringify(embedding, null, 2);
    } else {
      const preview = embedding.slice(0, 5);
      const end = embedding.slice(-2);
      return JSON.stringify([...preview, '...', ...end], null, 2)
        .replace('"..."', `... ${embedding.length - 7} more values ...`);
    }
  }
  return JSON.stringify(embedding, null, 2);
};

const getTypeColor = (type) => {
  const colors = {
    'error': 'bg-red-500',
    'warning': 'bg-yellow-500',
    'info': 'bg-blue-500',
    'success': 'bg-green-500',
    'debug': 'bg-purple-500',
    'webhook': 'bg-indigo-500',
    'api': 'bg-cyan-500',
    'workflow': 'bg-emerald-500'
  };
  
  return colors[type?.toLowerCase()] || 'bg-gray-500';
};


const copyLogData = async () => {
  if (!props.log) return;
  
  try {
    const logData = JSON.stringify(props.log, null, 2);
    await navigator.clipboard.writeText(logData);
    
    // You could add a toast notification here
    console.log('Log data copied to clipboard');
  } catch (error) {
    console.error('Failed to copy log data:', error);
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = JSON.stringify(props.log, null, 2);
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    alert('Log data copied to clipboard!');
  }
};

// Close modal on Escape key
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.open) {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>