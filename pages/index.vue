<template>
	<div class="h-screen flex flex-col p-2 bg-gray-50">
		<picture>
			<source srcset="/roadflow.png" type="image/png" />
			<img src="/roadflow.png" alt="Roadflow Logo" class="h-10" />
		</picture>

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
