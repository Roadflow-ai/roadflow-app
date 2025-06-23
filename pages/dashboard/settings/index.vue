<template>
  <h1 class="text-2xl font-bold mb-4">Settings</h1>
  <div>
    <p>Manage your account settings and preferences.</p>
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      <NuxtLink
        v-for="section in sections"
        :key="section.title"
        :to="`/dashboard/settings/${section.title.toLowerCase()}`"
        class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow flex items-center space-x-4"
      >
        <i :class="section.icon" class="text-2xl"></i>
        <span class="text-lg font-semibold">{{ section.title }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Settings",
});

const sections = [
  {
    title: "Team",
    icon: "i-heroicons-users-solid",
  },
  {
    title: "Webhooks",
    icon: "i-heroicons-globe-alt-solid",
  },
];
</script>
