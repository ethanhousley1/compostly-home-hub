// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	integrations: [
		starlight({
			title: 'Compostly Ed',
			customCss: [
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What Is Composting?', slug: '' },
						{ label: 'Composting with Compostly', slug: 'getting-started/with-compostly' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'What to Compost', slug: 'guides/what-to-compost' },
						{ label: 'Getting Started at Home', slug: 'guides/getting-started-at-home' },
						{ label: 'Maintaining Your Compost', slug: 'guides/maintaining-your-compost' },
						{ label: 'Using Finished Compost', slug: 'guides/using-finished-compost' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
