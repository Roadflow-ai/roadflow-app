<template>
	<div class="h-screen bg-gray-50 flex flex-col">
		<Topbar @toggle-mobile-menu="showMobileSidebar = !showMobileSidebar" />
		
		<!-- Mobile sidebar overlay -->
		<div v-if="showMobileSidebar" class="lg:hidden">
			<div class="fixed inset-0 z-50 flex">
				<!-- Overlay background -->
				<div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="showMobileSidebar = false"></div>
				
				<!-- Mobile sidebar -->
				<div class="relative flex w-full max-w-xs flex-col bg-white">
					<div class="absolute top-0 right-0 -mr-12 pt-2">
						<button
							@click="showMobileSidebar = false"
							class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						>
							<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<Sidebar @navigate="showMobileSidebar = false" />
				</div>
			</div>
		</div>

		<div class="flex flex-1 overflow-hidden">
			<!-- Desktop sidebar -->
			<div class="hidden lg:block">
				<Sidebar />
			</div>
			
			<main class="flex-1 overflow-x-hidden overflow-y-auto h-full p-4 sm:p-6 lg:p-8">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const showMobileSidebar = ref(false)
</script>
