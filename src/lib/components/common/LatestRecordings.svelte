<script lang="ts">
  import type { LatestRecordingsData, Recording } from "$lib/types";
  let { recordings }: { recordings: LatestRecordingsData } = $props();

  let recentRecordings: Array<Recording> = $derived(recordings.recordings);
  import { slide } from "svelte/transition";
  import { SvelteDate } from "svelte/reactivity";
  import { getLocale } from "$lib/paraglide/runtime";
  import { m } from "$lib/paraglide/messages";
</script>

<div id="latest-recordings" data-name={m.latest_recordings()}>
  <h3><strong>{m.latest_recordings()}</strong></h3>
  {#if recordings.error}
    {m["error.loading_error"]()}
  {:else}
    {new SvelteDate(recordings.date).toLocaleDateString(getLocale(), {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
  {/if}
  <ul>
    {#each recentRecordings as record (record.title)}
      <li class="recording" transition:slide>
        <div class="recording-content">
          <a href={record.url} target="_blank">
            {record.title}
          </a>
        </div>
        <span class="font-size-small">{record.fileSize} </span>
      </li>
    {/each}
  </ul>
</div>

<style>
  div#latest-recordings ul {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
  }

  li.recording .recording-content {
    word-break: break-word;
    margin-bottom: 0.2em;
  }

  li.recording a {
    color: var(--color-text-2);
  }
  li.recording a:hover {
    color: var(--link-hover-color);
  }
</style>
