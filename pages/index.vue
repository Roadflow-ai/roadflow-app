<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
const { organization } = storeToRefs(userStore)
</script>

<template>
  <div class="h-screen flex flex-col p-2 bg-gray-50">
    <UiImageWithFallback
      src="/roadflow.png"
      alt="Roadflow Logo"
      fallback-type="logo"
      image-class="h-10 w-auto object-contain"
      fallback-class="h-10 flex items-center justify-center"
      container-class="h-10 flex items-center"
      icon-size="w-8 h-8"
    />
    <div class="h-full flex items-center justify-center flex-col gap-5">
      <h1 class="text-center text-3xl font-extrabold text-gray-900">
        Welcome to Roadflow
      </h1>
      <div class="flex gap-2 items-center">
        <NuxtLink
          to="/login"
          class="min-w-28 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Log In
        </NuxtLink>
        <NuxtLink
          to="/signup"
          class="min-w-28 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Sign Up
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
