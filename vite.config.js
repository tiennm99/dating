import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** @returns {'' | `/${string}`} */
function resolveBase() {
	// BASE_PATH is the single base-path knob; CI derives it from the repository name.
	const configuredBase = process.env.BASE_PATH ?? '';

	if (configuredBase === '' || configuredBase.startsWith('/')) {
		return /** @type {'' | `/${string}`} */ (configuredBase);
	}

	throw new Error('BASE_PATH must be empty or start with "/"');
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				strict: true
			}),
			paths: { base: resolveBase() }
		})
	]
});
