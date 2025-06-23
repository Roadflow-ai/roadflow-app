<template>
  <div class="min-h-screen flex flex-col bg-gray-50 p-4">
    <section class="max-w-4xl w-full mx-auto mb-10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-green-900 mb-2">
  {{ organization?.name || 'Your Organization' }}
</h1>
          <p class="text-lg text-gray-700 max-w-2xl">
            Roadflow AI automatizes the generation of useful, structured documentation for every team in your tech company.<br>
            Keep your processes and knowledge always up-to-date, empower growth, customer success, and internal alignment, all from a single source.
          </p>
        </div>

      </div>

      <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center mb-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">How does it work?</h2>
        <ol class="list-decimal list-inside text-gray-800 mb-4 text-left w-full max-w-2xl">
          <li><b>Connect your tools</b>: Integrate Roadflow AI with your favorite data sources and tools.</li>
          <li><b>Configure webhooks</b>: Set up webhooks so that every time an event happens (deploy, release, ticket, etc.), Roadflow automatically generates and distributes content.</li>
          <li><b>Automate your flow</b>: Content is delivered to the right teams, in the right format, with no manual effort.</li>
        </ol>
        <img src="/assets/roadflow-pipeline.svg" alt="Roadflow Pipeline" class="w-full max-w-2xl mb-2" />
        <div class="flex justify-between w-full max-w-2xl mt-2 text-green-900 text-sm font-semibold">
          <span>Engineering</span>
          <span>Product</span>
          <span>Operations</span>
          <span>Customer Success</span>
          <span>Growth</span>
        </div>
      </div>
    </section>

    <section class="max-w-2xl w-full mx-auto bg-white rounded-xl shadow p-6 mb-10">
      <h2 class="text-xl font-semibold my-4">Users</h2>
      <ul v-if="organization && Array.isArray(organization.users) && organization.users.length">
        <li v-for="user in organization.users" :key="user.id || user" class="flex items-center gap-2 mb-2">
          <span class="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
            {{ user.name || user.email || user }}
          </span>
        </li>
      </ul>
      <div v-else>
        <div class="flex items-center gap-3 mb-2">
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">John Doe</span>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">jane@company.com</span>
        </div>
        <p class="mb-2 text-gray-500">There's no users yet. Start by inviting your team!</p>
        <button
          class="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800"
        >
          Invite someone
        </button>
      </div>
    </section>
  </div>
</template>


<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { organization } = storeToRefs(userStore)

useSeoMeta({
	title: 'RoadFlow AI'
})
</script>
