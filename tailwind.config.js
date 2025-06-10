export default {
	content: [
		'./components/**/*.{vue,js,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}',
		'./app.vue'
	],
	theme: {
		extend: {
			colors: {
				green: {
					100: '#E8F5E8',
					500: '#479E52',
					800: '#175C32'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				script: ['Pacifico', 'cursive']
			}
		}
	},
	plugins: []
}
