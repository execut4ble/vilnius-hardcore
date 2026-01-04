<script lang="ts">
  import "../app.css";
  import {
    Header,
    Footer,
    Menu,
    RecentComments,
    UserInfo,
    ThemeToggle,
    BackgroundImage,
    Confetti,
  } from "$lib/components";
  import type { LayoutProps } from "./$types";
  import type { RecentCommentsData, UserInfoData } from "$lib/types";
  import { locales, setLocale } from "$lib/paraglide/runtime";
  import { page } from "$app/state";

  let { data, children }: LayoutProps = $props();
  let user: UserInfoData = $derived(data.user);
  let recentComments: RecentCommentsData = $derived(data.recentComments);
  let commentsEnabled: Boolean = $derived(data.globalCommentsEnabled);
  let backgroundImage = $derived(page.data.event?.[0]?.image ?? null);
</script>

<div class="app">
  <Confetti />
  <BackgroundImage {backgroundImage} />
  <Header />
  <main>
    <row>
      <mobile>
        <div id="locale">
          {#each locales as locale (locale)}
            <button onclick={() => setLocale(locale)}>{locale}</button>
          {/each}
        </div>
        {#if user}
          <UserInfo {user} />
        {/if}
        <Menu />
      </mobile>
      <section>
        {@render children?.()}
      </section>
      <sidebar>
        <div id="locale">
          {#each locales as locale (locale)}
            <button onclick={() => setLocale(locale)}>{locale}</button>
          {/each}
        </div>
        <div id="navigation">
          {#if user}
            <UserInfo {user} />
          {/if}
          <Menu />
        </div>
        {#if commentsEnabled}
          <RecentComments {recentComments} />
        {/if}
        <ThemeToggle />
      </sidebar>
    </row>
  </main>
  <Footer />
</div>

<style>
  :global(html) {
    --color-text: #ffff80;
    --color-text-2: #af1a1a;
    --color-text-3: #315563;
    --link-color: var(--color-text);
    --link-hover-color: var(--color-text);
    --form-border-color: var(--color-text-2);
    --form-text-color: var(--color-text);
  }

  :global(html.dark) {
    --color-text: #090;
    --color-text-2: #0f0;
    --color-text-3: #050;
    --link-color: var(--color-text-2);
    --link-hover-color: var(--color-bg);
    --form-border-color: var(--color-text-2);
    --form-text-color: var(--color-text-2);
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    padding: 1rem;
    width: 100%;
    max-width: 70rem;
    box-sizing: border-box;
    margin: 2rem auto;
    font-size: 14px;
    line-height: 16px;
    -webkit-font-smoothing: antialiased;
  }

  section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: center;
    padding: 1.5em 3em 1.5em 3em;
    min-width: 500px;
  }

  sidebar {
    display: flex;
    flex-direction: column;
    gap: 2em;
    align-items: center;
    width: 17em;
    padding: 2em 1em 2em 1em;
    flex-shrink: 0.1;
    border-left: 1px solid rgba(255, 255, 255, 0.075);
  }

  sidebar #navigation {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }

  row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.075);
    border-radius: 10px;
    backdrop-filter: blur(10px) brightness(50%);
  }

  @media screen and (max-width: 850px) {
    section {
      padding-left: 1em;
      padding-right: 1em;
      width: unset;
    }

    sidebar {
      width: 15em;
    }
  }

  @media screen and (min-width: 780px) {
    mobile {
      display: none;
    }
  }

  @media screen and (max-width: 780px) {
    section {
      display: flex;
      padding-left: 1em;
      min-width: auto;
      padding-bottom: 3em;
      align-self: center;
    }

    main {
      margin-top: 1em;
    }

    main row {
      flex-direction: column;
    }

    mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2em;
      margin-bottom: 2em;
      margin-top: 2em;
    }

    sidebar {
      width: auto;
      align-items: center;
      border: none;
    }

    sidebar #navigation {
      display: none;
    }

    sidebar #locale {
      display: none;
    }
  }

  :global(body) {
    --date-picker-foreground: var(--form-text-color);
    --date-picker-background: #1c1c1c;
    --date-picker-highlight-border: var(--form-border-color);
    --date-picker-border-color: rgba(255, 255, 255, 0.075);
    --date-picker-highlight-shadow: none;
    --date-picker-selected-color: var(--link-hover-color);
    --date-picker-selected-background: var(--color-text-2);
    --date-input-width: fit-content;
  }

  :global(.date-time-field input) {
    width: 16rem;
    margin-top: 0.83em !important;
    margin-bottom: 0.5em !important;
    font-weight: 400 !important;
    font-size: 1rem !important;
    padding: 12px 10px !important;
    border: 1px solid rgba(255, 255, 255, 0.075) !important;
  }

  :global(.date-time-field input:focus) {
    border-color: var(--form-border-color) !important;
  }

  :global(.date-time-field select) {
    background-color: var(--date-picker-background) !important;
  }
</style>
