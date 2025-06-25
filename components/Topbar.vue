<template>
  <header
    class="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6"
  >
    <!-- Mobile menu button -->
    <button
      @click="$emit('toggle-mobile-menu')"
      class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>

    <!-- Logo -->
    <div class="flex items-center">
      <UiImageWithFallback
        src="/roadflow.png"
        alt="Roadflow Logo"
        fallback-type="logo"
        image-class="h-8 sm:h-10 w-auto object-contain"
        fallback-class="h-8 sm:h-10 flex items-center justify-center"
        container-class="h-8 sm:h-10 flex items-center"
        icon-size="w-6 h-6 sm:w-8 sm:h-8"
      />
    </div>

    <!-- Welcome message - hidden on mobile -->
    <span
      v-if="userStore.userData?.first_name"
      class="hidden sm:block text-sm lg:text-lg font-semibold text-gray-700 capitalize"
    >
      Welcome {{ userStore.userData.first_name }}
    </span>
    <div class="flex items-center space-x-2 sm:space-x-4">
      <!-- Notifications - hidden on mobile -->
      <button class="hidden sm:block p-2 rounded-full hover:bg-gray-100">
        <svg
          class="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
      </button>
      <!-- Charts - hidden on mobile -->
      <button class="hidden sm:block p-2 rounded-full hover:bg-gray-100">
        <svg
          class="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          ></path>
        </svg>
      </button>
      <div class="relative" ref="menuRef">
        <button
          class="p-2 rounded-full hover:bg-gray-100"
          @click="showMenu = !showMenu"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            ></path>
          </svg>
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50"
        >
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            @click="goToSettings"
          >
            Settings
          </button>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            @click="handleLogout"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/user";
import { onClickOutside } from "@vueuse/core";

// Define emits
const emit = defineEmits(['toggle-mobile-menu'])

const userStore = useUserStore();
const showMenu = ref(false);
const router = useRouter();
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  showMenu.value = false;
});

function handleLogout() {
  userStore.logout();
  router.push("/login");
  showMenu.value = false;
}

function goToSettings() {
  router.push("/dashboard/settings");
  showMenu.value = false;
}
</script>
