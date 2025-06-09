<template>
  <div class="min-h-screen bg-gray-50">
    <Topbar />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
