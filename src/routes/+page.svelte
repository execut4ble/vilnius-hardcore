<script lang="ts">
	import Counter from './Counter.svelte';

</script>

<svelte:head>
	<title>Hardcore</title>
	<meta name="description" content="Vilnius Hardcore" />
</svelte:head>

<section>
	<h2>
		<strong>Current events</strong>
	</h2>
	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
