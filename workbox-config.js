module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{xml,css,svg,png,ico,webmanifest,html,js}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'public/sw.js'
};