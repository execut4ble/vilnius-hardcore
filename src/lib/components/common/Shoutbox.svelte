<script lang="ts">
  import { enhance } from "$app/forms";
  let { shouts } = $props();
  import { relativeTime } from "svelte-relative-time";
  import { slide } from "svelte/transition";
  import FieldError from "./FieldError.svelte";

  type ValidationErrors = { author: string[]; content: string[] };
  type EnhancedResult = {
    data: {
      errors?: ValidationErrors;
    };
  };

  let author = $state("");
  let message = $state("");
  let errors: ValidationErrors | undefined = $state();
</script>

<div class="shoutbox">
  <h3><strong>Shoutbox</strong></h3>
  <ul>
    {#each shouts as shout (shout.id)}
      <li class="shout" transition:slide>
        <div class="heading">
          <div class="author">
            <strong>
              {shout.author}
            </strong>
          </div>
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
  <form
    method="POST"
    action="/?/add_shout"
    use:enhance={() => {
      return async ({ update, result }) => {
        if ((result as EnhancedResult).data) {
          errors = (result as EnhancedResult).data.errors;
        }
        await update();
      };
    }}
  >
    <input
      id="author"
      name="author"
      placeholder="Name"
      bind:value={author}
      maxlength="30"
      required
    />
    <textarea
      id="content"
      name="content"
      bind:value={message}
      maxlength="150"
      spellcheck="false"
      required
      autocomplete="off"
    ></textarea>
    <div class="actions">
      <button type="submit">Shout!</button>
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
</div>

<style>
  li.shout {
    margin-bottom: 1.5em;
  }

  li.shout .content {
    word-break: break-word;
    margin-bottom: 0.2em;
  }

  li.shout .heading {
    display: flex;
  }

  li.shout .date {
    margin-left: auto;
  }

  form .actions {
    display: flex;
  }

  form .length {
    margin-left: auto;
  }

  form textarea {
    min-width: 12.5em;
    max-width: 12.5em;
    height: 3em;
  }
</style>
