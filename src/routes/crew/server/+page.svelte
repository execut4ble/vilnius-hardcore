<script lang="ts">
  import { MetaTags } from "$lib/components";
  import { m } from "$lib/paraglide/messages";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const info = $derived(data.info);
</script>

<svelte:head>
  <MetaTags title={m["server_env.title"]()} />
</svelte:head>

<div data-name={m["server_env.title"]()} class="server-env">
  <h2>{m["server_env.title"]()}</h2>
  <p>{m["server_env.description"]()}</p>

  <dl>
    <div class="row">
      <dt>{m["server_env.node"]()}</dt>
      <dd>{info.nodeVersion}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.platform"]()}</dt>
      <dd>{info.platform}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.hostname"]()}</dt>
      <dd>{info.hostname}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.cpu"]()}</dt>
      <dd>{info.cpu}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.memory"]()}</dt>
      <dd>
        {info.memoryFree}
        {m["server_env.free"]()}
        <br />
        {info.memoryTotal}
        {m["server_env.total"]()}
      </dd>
    </div>
    <div class="row">
      <dt>{m["server_env.disk"]()}</dt>
      <dd>
        {#if info.diskFree !== null && info.diskTotal !== null}
          {info.diskFree}
          {m["server_env.free"]()}
          <br />
          {info.diskTotal}
          {m["server_env.total"]()}
        {:else}
          {m["server_env.not_available"]()}
        {/if}
      </dd>
    </div>
    <div class="row">
      <dt>{m["server_env.media"]()}</dt>
      <dd>
        {#if info.mediaFiles !== null && info.mediaSize !== null}
          {info.mediaFiles}
          {m["server_env.files"]()}
          <br />
          {info.mediaSize}
          {m["server_env.total"]()}
        {:else}
          {m["server_env.not_available"]()}
        {/if}
      </dd>
    </div>
    <div class="row">
      <dt>{m["server_env.load"]()}</dt>
      <dd>{info.loadAverage}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.uptime_system"]()}</dt>
      <dd>{info.systemUptime}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.uptime_app"]()}</dt>
      <dd>{info.appUptime}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.timezone"]()}</dt>
      <dd>{info.timezone}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.database"]()}</dt>
      <dd>{info.database.version || m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.database_size"]()}</dt>
      <dd>{info.database.size || m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.redis"]()}</dt>
      <dd>{info.redis.version || m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.redis_memory"]()}</dt>
      <dd>{info.redis.memory || m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.commit"]()}</dt>
      <dd>{info.commitHash || m["server_env.not_available"]()}</dd>
    </div>
  </dl>

  <h3>{m["server_env.content"]()}</h3>

  <dl>
    <div class="row">
      <dt>{m["navigation.events"]()}</dt>
      <dd>{info.database.events ?? m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.posts"]()}</dt>
      <dd>{info.database.posts ?? m["server_env.not_available"]()}</dd>
    </div>
    <div class="row">
      <dt>{m["server_env.comments"]()}</dt>
      <dd>{info.database.comments ?? m["server_env.not_available"]()}</dd>
    </div>
  </dl>
</div>

<style>
  dl {
    display: flex;
    flex-direction: column;
    margin: 1.5rem 0;
  }

  h3 {
    margin-top: 2rem;
  }

  .row {
    display: grid;
    grid-template-columns: minmax(11rem, max-content) 1fr;
    column-gap: 1.5rem;
    align-items: baseline;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(127, 127, 127, 0.25);
  }

  .row:last-child {
    border-bottom: none;
  }

  dt {
    color: var(--color-text-2);
  }

  dd {
    margin: 0;
    text-align: right;
  }
</style>
