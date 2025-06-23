<template>
  <div class="max-w-3xl mx-auto py-10">
    <button @click="goBack" class="mb-4 px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      Back
    </button>
    <div class="mb-6 flex items-center gap-3">
      <h1 class="text-2xl font-bold text-gray-900 flex-1">{{ title }}</h1>
      <button v-if="!isEditing" @click="isEditing = true" class="px-4 py-1 rounded bg-green-700 text-white hover:bg-green-800">Edit</button>
      <button v-else @click="saveContent" class="px-4 py-1 rounded bg-blue-700 text-white hover:bg-blue-800">Save</button>
      <button v-if="isEditing" @click="cancelEdit" class="px-4 py-1 rounded bg-gray-300 text-gray-700 ml-2">Cancel</button>
    </div>
    <div v-if="!isEditing" class="prose prose-lg max-w-none bg-white rounded shadow p-6">
      <div v-html="contentHtml"></div>
    </div>
    <div v-else>
      <div class="flex gap-2 mb-2">
        <button @click="applyMarkdown('h1')" class="toolbar-btn" title="Heading 1">H1</button>
        <button @click="applyMarkdown('h2')" class="toolbar-btn" title="Heading 2">H2</button>
        <button @click="applyMarkdown('bold')" class="toolbar-btn" title="Bold"><b>B</b></button>
        <button @click="applyMarkdown('italic')" class="toolbar-btn" title="Italic"><i>I</i></button>
        <button @click="applyMarkdown('code')" class="toolbar-btn" title="Code">&lt;/&gt;</button>
        <button @click="applyMarkdown('ul')" class="toolbar-btn" title="Bulleted List">• List</button>
        <button @click="applyMarkdown('ol')" class="toolbar-btn" title="Numbered List">1. List</button>
      </div>
      <textarea v-model="editContent" ref="editorRef" rows="18" class="w-full border rounded p-3 font-mono text-base" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// Demo data
const demoDocs: Record<string, { title: string, content: string }> = {
  '1': {
    title: 'API Authentication Guide',
    content: `# API Authentication\n\nThis guide explains how to authenticate with our API.\n\n## Steps\n- Obtain your API key from the dashboard.\n- Send it as a Bearer token in the Authorization header.\n\n## Example\n\n\u0060\u0060\u0060http\nGET /api/v1/resource HTTP/1.1\nAuthorization: Bearer &lt;your_api_key&gt;\n\u0060\u0060\u0060\n`
  },
  '2': {
    title: 'Deployment Playbook',
    content: `# Deployment Playbook\n\nFollow these steps to deploy the application.\n\n1. Clone the repository.\n2. Install dependencies with \u0060npm install\u0060.\n3. Run \u0060npm run build\u0060 and then \u0060npm run start\u0060.\n\n---\n\nFor troubleshooting, see the docs.`
  }
}

const doc = demoDocs[id] || { title: 'Untitled Document', content: '# New Document\n\nStart writing here...' }
const title = doc.title
const content = ref(doc.content)
const isEditing = ref(false)
const editContent = ref(content.value)

const contentHtml = computed(() => {
  // Simple markdown to HTML (demo, not secure for production)
  return editContent.value
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^---$/gim, '<hr/>')
    .replace(/\n/g, '<br/>')
    .replace(/`{3}([\s\S]*?)`{3}/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^- (.*)$/gim, '<li>$1</li>')
    .replace(/<li>([\s\S]*?)<\/li>/g, '<ul><li>$1</li></ul>')
})

function saveContent() {
  content.value = editContent.value
  isEditing.value = false
}

function cancelEdit() {
  editContent.value = content.value
  isEditing.value = false
}
// Back button
function goBack() {
  router.back()
}

// Markdown toolbar logic
import { nextTick } from 'vue'
const editorRef = ref()
function applyMarkdown(type: string) {
  const textarea = editorRef.value
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  let value = editContent.value
  let selected = value.slice(start, end)
  let before = value.slice(0, start)
  let after = value.slice(end)

  let insert = ''
  switch (type) {
    case 'h1':
      insert = `# ${selected || 'Heading 1'}`
      break
    case 'h2':
      insert = `## ${selected || 'Heading 2'}`
      break
    case 'bold':
      insert = `**${selected || 'bold text'}**`
      break
    case 'italic':
      insert = `*${selected || 'italic text'}*`
      break
    case 'code':
      insert = `
${selected || 'code'}
`
      break
    case 'ul':
      insert = `- ${selected || 'List item'}`
      break
    case 'ol':
      insert = `1. ${selected || 'List item'}`
      break
    default:
      insert = selected
  }
  editContent.value = before + insert + after
  nextTick(() => {
    textarea.focus()
    textarea.selectionStart = textarea.selectionEnd = before.length + insert.length
  })
}

</script>

<style scoped>
.toolbar-btn {
  @apply px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 text-xs font-semibold;
}
</style>


<style scoped>
.prose h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.prose h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
}
.prose pre {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 0.8em;
  margin: 1em 0;
}
.prose ul {
  list-style: disc;
  margin-left: 2em;
}
</style>
