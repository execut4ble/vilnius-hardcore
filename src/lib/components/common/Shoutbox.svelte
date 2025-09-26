<script lang="ts">
  import { enhance } from "$app/forms";
  import { relativeTime } from "svelte-relative-time";
  import { slide } from "svelte/transition";
  import FieldError from "./FieldError.svelte";
  import { page } from "$app/state";
  import Fa from "svelte-fa";
  import { faTrash } from "@fortawesome/free-solid-svg-icons";

  type ValidationErrors = { author: string[]; content: string[] };
  type EnhancedResult = {
    data: {
      errors?: ValidationErrors;
    };
  };

  let { shouts } = $props();

  let author = $state("");
  let message = $state("");
  let errors: ValidationErrors | undefined = $state();
  let currentPage = $state(0);
  let perPage = 5;
  let totalRows = $derived(shouts.meta[0].totalRows);
  let totalPages = $derived(Math.ceil(totalRows / perPage));
  let start = $derived(currentPage * perPage);
  let end = $derived(
    currentPage === totalPages - 1 ? totalRows - 1 : start + perPage - 1,
  );

  let hoveredItem = $state(null);
  let displayInputForm = $state(false);

  async function fetchShouts(offset: number) {
    const res = await fetch(`/api/shouts?offset=${offset}`);
    if (res.ok) {
      shouts = await res.json();
    } else {
      console.error("Failed to fetch shouts:", res.statusText);
    }
  }
</script>

<div class="shoutbox">
  <h3><strong>Shoutbox</strong></h3>
  <ul>
    {#each shouts.data as shout (shout.id)}
      <li
        class="shout"
        onfocus={() => (hoveredItem = shout.id)}
        onmouseover={() => (hoveredItem = shout.id)}
        onmouseleave={() => (hoveredItem = null)}
      >
        <div class="heading">
          <div class="author" title={shout.author}>
            <strong>
              {shout.author}
            </strong>
          </div>
          {#if page.data.user && hoveredItem === shout.id}
            <form method="POST" action="/?/remove_shout" use:enhance>
              <input type="hidden" name="id" value={shout.id} />
              <button type="submit" class="post action">
                <Fa icon={faTrash} /></button
              >
            </form>
          {/if}
          <div
            class="font-size-small dim date"
            use:relativeTime={{ date: new Date(shout.date) }}
          ></div>
        </div>
        <div class="content">
          {shout.content}
        </div>
      </li>
    {:else}
      <div transition:slide>Nothing here. Write something!</div>
    {/each}
  </ul>
  {#if totalRows && totalRows > perPage}
    <div class="pagination">
      {#if currentPage !== 0}
        <button
          onclick={() => {
            currentPage -= 1;
            fetchShouts(start);
          }}
          aria-label="left arrow icon"
          aria-describedby="prev"
          >&lt;
        </button>
      {/if}
      <p>{start + 1} - {end + 1} of {totalRows}</p>
      {#if currentPage !== totalPages - 1}
        <button
          onclick={() => {
            currentPage += 1;
            fetchShouts(currentPage === 0 ? end : start);
          }}
          aria-label="right arrow icon"
          aria-describedby="next"
        >
          &gt;
        </button>
      {/if}
    </div>
  {/if}
  {#if displayInputForm}
    <form
      class="add-shout"
      method="POST"
      action="/?/add_shout"
      use:enhance={() => {
        return async ({ update, result }) => {
          if ((result as EnhancedResult).data) {
            errors = (result as EnhancedResult).data.errors;
          }
          await update();
          currentPage = 0;
        };
      }}
    >
      <input
        id="author"
        name="author"
        placeholder="Name"
        class="shoutbox"
        bind:value={author}
        maxlength="30"
        required
      />
      <textarea
        id="content"
        name="content"
        placeholder="Message"
        bind:value={message}
        maxlength="150"
        spellcheck="false"
        required
        autocomplete="off"
      ></textarea>
      <div class="actions">
        <button type="submit">Scream into the void!</button>
        <div class="length">
          {message.length}/150
        </div>
      </div>

      {#if errors?.author}
        <FieldError errors={errors?.author} />
      {/if}
      {#if errors?.content}
        <FieldError errors={errors?.content} />
      {/if}
    </form>
  {:else}
    <button
      id="areyouacop"
      name="areyouacop"
      onclick={() => (displayInputForm = true)}>Ż̴̼a̴͂ͅĺ̶͖g̷̋͜o̷̭̅ ̶̻̅l̵̯̍i̵̹͋s̶͎̿t̵͇̀e̸̯͑ṇ̸̽s̵͔̊.̶̪̏.̶̥͆.̸̲̆</button
    >
  {/if}
</div>

<style>
  li.shout:not(:last-child) {
    padding-bottom: 1.5em;
  }

  li.shout .content {
    word-break: break-word;
    padding: 0.2em 0 0.2em 0;
  }

  li.shout .heading {
    display: flex;
    gap: 0.2em;
    /* justify-content: space-around; */
    min-width: 0;
  }

  li.shout .date {
    margin-left: auto;
    padding-right: 1em;
    white-space: nowrap;
  }

  li.shout .author {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form .actions {
    display: flex;
  }

  form .length {
    margin-left: auto;
  }

  form.add-shout {
    display: flex;
    flex-direction: column;
  }
  form textarea {
    max-height: 5em;
    font-size: 10pt;
    box-sizing: border-box;
    width: 100%;
  }

  form input.shoutbox#author {
    font-size: 10pt;
    box-sizing: border-box;
    width: 100%;
  }

  div.shoutbox {
    width: 100%;
  }

  ul {
    max-height: 25em;
    overflow-y: scroll;
    overflow-x: hidden;
    max-width: 100%;
    padding-left: 0;
    list-style: none;
    font-size: 0.75rem;
    scrollbar-color: var(--color-text-2) var(--color-text);
  }

  div.pagination {
    display: flex;
    justify-content: center;
  }

  div.pagination p {
    margin-top: 0;
    margin-bottom: 0;
  }

  div.heading form {
    margin-bottom: 0;
    font-size: smaller;
  }
</style>
