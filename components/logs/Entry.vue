<template>
  <div 
    class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
    @click="toggleExpanded"
  >
    <!-- Main Log Row -->
    <div class="grid grid-cols-12 gap-4 items-start">
      <!-- Type & Source -->
      <div class="col-span-2">
        <div class="flex items-center space-x-2">
          <div :class="[
            'w-2 h-2 rounded-full flex-shrink-0',
            getTypeColor(log.type)
          ]"></div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-gray-900 truncate">
              {{ log.type || 'Unknown' }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ log.source || 'No source' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Agent & Source ID -->
      <div class="col-span-2">
        <div v-if="log.agent" class="space-y-1">
          <div class="flex items-center space-x-2">
            <Icon name="uil:robot" size="16" class="text-blue-500 flex-shrink-0" />
            <span class="text-sm text-gray-900 truncate">{{ log.agent }}</span>
          </div>
        </div>
        <div v-else-if="log.source_id" class="space-y-1">
          <div class="text-xs text-gray-500">Source ID:</div>
          <div class="text-xs font-mono text-gray-900 truncate" :title="log.source_id">
            {{ log.source_id }}
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">No agent or source ID</div>
      </div>

      <!-- Data Preview -->
      <div class="col-span-4">
        <div class="space-y-1">
          <div class="text-sm text-gray-900 line-clamp-2">
            {{ getDataPreview(log.data) }}
          </div>
          <div class="flex items-center space-x-2 text-xs">
            <div v-if="getDataType(log.data)" class="flex items-center space-x-1">
              <Icon name="uil:file-alt" size="12" class="text-blue-500" />
              <span class="text-blue-600">{{ getDataType(log.data) }}</span>
            </div>
            <div v-if="log.embeddings && log.embeddings.length > 0" class="flex items-center space-x-1">
              <Icon name="uil:vector-square" size="12" class="text-purple-500" />
              <span class="text-purple-600">{{ log.embeddings.length }} embeddings</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Event -->
      <div class="col-span-2">
        <div v-if="hasSourceEvent" class="space-y-1">
          <div class="text-xs text-gray-500">Events:</div>
          <div class="flex flex-wrap gap-1">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {{ log.source_event.length }} {{ log.source_event.length === 1 ? 'event' : 'events' }}
            </span>
            <span v-if="getFirstEventKeys().length > 0" class="text-xs text-gray-400">
              {{ getFirstEventKeys().slice(0, 2).join(', ') }}{{ getFirstEventKeys().length > 2 ? '...' : '' }}
            </span>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400">No event data</div>
      </div>

      <!-- ID & Timestamp -->
      <div class="col-span-2">
        <div class="space-y-1">
          <div class="text-xs text-gray-500">Log ID:</div>
          <div class="text-xs font-mono text-gray-900 truncate" :title="log._id?.$oid || log.id">
            {{ formatLogId(log._id?.$oid || log.id) }}
          </div>
          <div v-if="log.createdAt" class="text-xs text-gray-500">
            {{ formatTimestamp(log.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-2 flex items-center justify-between">
      <div class="text-xs text-gray-400">
        Click to {{ isExpanded ? 'collapse' : 'expand' }} details
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click.stop="$emit('showDetail', log)"
          class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View Full Details
        </button>
        <Icon 
          :name="isExpanded ? 'uil:angle-up' : 'uil:angle-down'" 
          size="16" 
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'transform rotate-180': isExpanded }"
        />
      </div>
    </div>

    <!-- Expanded Details -->
    <div 
      v-if="isExpanded" 
      class="mt-4 pt-4 border-t border-gray-200 space-y-4"
    >
      <!-- Full Data -->
      <div v-if="log.data !== null && log.data !== undefined && log.data !== ''">
        <h4 class="text-sm font-medium text-gray-900 mb-2">Data</h4>
        <div class="bg-gray-50 rounded-md p-3">
          <pre class="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">{{ typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2) }}</pre>
        </div>
      </div>

      <!-- Source Events Details -->
      <div v-if="hasSourceEvent">
        <h4 class="text-sm font-medium text-gray-900 mb-2">
          Source Events ({{ log.source_event.length }})
        </h4>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          <div 
            v-for="(event, index) in log.source_event.slice(0, 5)" 
            :key="index"
            class="bg-gray-50 rounded-md p-3"
          >
            <div class="text-xs text-gray-600 mb-1">
              <strong>Event {{ index + 1 }}:</strong>
            </div>
            <pre class="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">{{ JSON.stringify(event, null, 2) }}</pre>
          </div>
          <div v-if="log.source_event.length > 5" class="text-xs text-gray-500">
            ... and {{ log.source_event.length - 5 }} more events
          </div>
        </div>
      </div>

      <!-- Embeddings -->
      <div v-if="log.embeddings && log.embeddings.length > 0">
        <h4 class="text-sm font-medium text-gray-900 mb-2">
          Embeddings ({{ log.embeddings.length }})
        </h4>
        <div class="space-y-2">
          <div 
            v-for="(embedding, index) in log.embeddings.slice(0, 5)" 
            :key="index"
            class="bg-purple-50 rounded-md p-3"
          >
            <div class="text-xs text-purple-700">
              <strong>Embedding {{ index + 1 }}:</strong>
              <span class="ml-2 font-mono">{{ formatEmbedding(embedding) }}</span>
            </div>
          </div>
          <div v-if="log.embeddings.length > 5" class="text-xs text-gray-500">
            ... and {{ log.embeddings.length - 5 }} more embeddings
          </div>
        </div>
      </div>

      <!-- Metadata -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
        <div>
          <div class="text-xs font-medium text-gray-500">Organization ID</div>
          <div class="text-sm text-gray-900 font-mono">{{ log.organizationId || 'N/A' }}</div>
        </div>
        <div>
          <div class="text-xs font-medium text-gray-500">Type</div>
          <div class="text-sm text-gray-900">{{ log.type || 'N/A' }}</div>
        </div>
        <div>
          <div class="text-xs font-medium text-gray-500">Source</div>
          <div class="text-sm text-gray-900">{{ log.source || 'N/A' }}</div>
        </div>
        <div>
          <div class="text-xs font-medium text-gray-500">Created</div>
          <div class="text-sm text-gray-900">{{ formatTimestamp(log.createdAt) || 'N/A' }}</div>
        </div>
        <div v-if="log.agent">
          <div class="text-xs font-medium text-gray-500">Agent</div>
          <div class="text-sm text-gray-900">{{ log.agent }}</div>
        </div>
        <div v-if="log.source_id">
          <div class="text-xs font-medium text-gray-500">Source ID</div>
          <div class="text-sm text-gray-900 font-mono break-all">{{ log.source_id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  log: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['showDetail']);

const isExpanded = ref(false);

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
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

const getDataPreview = (data) => {
  if (!data) {
    return 'No data';
  }
  
  const MAX_LENGTH = 150;
  
  // Handle string data
  if (typeof data === 'string') {
    return data.length > MAX_LENGTH ? data.substring(0, MAX_LENGTH) + '...' : data;
  }
  
  // Handle array data
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return 'Empty array';
    }
    
    // Stringify the entire array and truncate if needed
    const stringified = JSON.stringify(data);
    if (stringified.length <= MAX_LENGTH) {
      return stringified;
    }
    
    // If too long, show truncated version with count
    const preview = data.slice(0, 2).map(item => 
      typeof item === 'object' ? JSON.stringify(item).substring(0, 40) + '...' : String(item)
    ).join(', ');
    const result = `[${preview}${data.length > 2 ? `, ...+${data.length - 2} more` : ''}]`;
    return result.length > MAX_LENGTH ? result.substring(0, MAX_LENGTH) + '...' : result;
  }
  
  // Handle object data
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return 'Empty object';
    }
    
    // Try to stringify the entire object first
    const stringified = JSON.stringify(data);
    if (stringified.length <= MAX_LENGTH) {
      return stringified;
    }
    
    // Look for common meaningful fields first
    const meaningfulFields = ['message', 'description', 'text', 'content', 'title', 'name', 'error', 'result'];
    for (const field of meaningfulFields) {
      if (data[field] && typeof data[field] === 'string') {
        const fieldValue = String(data[field]);
        return fieldValue.length > MAX_LENGTH ? fieldValue.substring(0, MAX_LENGTH) + '...' : fieldValue;
      }
    }
    
    // Fallback to truncated JSON
    return stringified.substring(0, MAX_LENGTH) + '...';
  }
  
  // Handle primitives (number, boolean, etc.)
  const stringified = JSON.stringify(data);
  return stringified.length > MAX_LENGTH ? stringified.substring(0, MAX_LENGTH) + '...' : stringified;
};

const getDataType = (data) => {
  if (!data) return null;
  
  if (typeof data === 'string') return 'String';
  if (Array.isArray(data)) return `Array (${data.length} items)`;
  if (typeof data === 'object') return `Object (${Object.keys(data).length} keys)`;
  
  return typeof data;
};

const hasSourceEvent = computed(() => {
  return props.log.source_event && Array.isArray(props.log.source_event) && props.log.source_event.length > 0;
});

const getFirstEventKeys = () => {
  if (!hasSourceEvent.value || !props.log.source_event[0]) return [];
  return Object.keys(props.log.source_event[0]);
};

const formatLogId = (id) => {
  if (!id) return 'N/A';
  return id.length > 12 ? id.substring(0, 8) + '...' + id.substring(id.length - 4) : id;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;
  
  const date = timestamp.$date ? new Date(timestamp.$date) : new Date(timestamp);
  
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

const formatEmbedding = (embedding) => {
  if (Array.isArray(embedding)) {
    const preview = embedding.slice(0, 3).map(n => Number(n).toFixed(3)).join(', ');
    return `[${preview}${embedding.length > 3 ? `, ... +${embedding.length - 3} more` : ''}]`;
  }
  return String(embedding).substring(0, 50) + '...';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>