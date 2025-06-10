<template>
	<div class="h-screen bg-gray-50 flex flex-col">
		<Topbar />
		<div class="flex flex-1 overflow-hidden">
			<Sidebar />
			<main class="flex-1 overflow-x-hidden overflow-y-auto h-full">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>
