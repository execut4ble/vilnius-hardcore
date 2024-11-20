<script lang="ts">
	import Header from './Header.svelte';
	import Menu from './Menu.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />
	<main>
		<row>
			{@render children()}
			<Menu />
		</row>
	</main>

	<footer>
		<p>
			powered by <strong>chebrytė</strong> and <a href="https://svelte.dev/docs/kit">SvelteKit</a></p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
		margin: 50px auto;
		font-size: 14px;
		font-weight: bold;
		line-height: 16px;

		-webkit-font-smoothing: antialiased;
	}

	row {
		display: flex;
		flex-direction: row;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
