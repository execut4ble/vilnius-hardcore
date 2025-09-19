<script lang="ts">
  import "../app.css";
  import {
    Header,
    Footer,
    Menu,
    RecentComments,
    UserInfo,
    ThemeToggle,
  } from "$lib/components";
  import type { LayoutProps } from "./$types";
  import type { RecentCommentsData, UserInfoData } from "$lib/types";
  import { locales, setLocale } from "$lib/paraglide/runtime";

  let { data, children }: LayoutProps = $props();
  let user: UserInfoData = $derived(data.user);
  let recentComments: RecentCommentsData = $derived(data.recentComments);
</script>

<div class="app">
  <Header />
  <main>
    <row>
      <mobile>
        <div class="locale">
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
        <div class="locale">
          {#each locales as locale (locale)}
            <button onclick={() => setLocale(locale)}>{locale}</button>
          {/each}
        </div>
        <div class="navigation">
          {#if user}
            <UserInfo {user} />
          {/if}
          <Menu />
        </div>
        <RecentComments {recentComments} />
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
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
    margin: 50px auto;
    font-size: 14px;
    line-height: 16px;
    -webkit-font-smoothing: antialiased;
  }

  section {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-content: center;
    margin: 0 5em 0 5em;
    min-width: 500px;
  }

  sidebar {
    display: flex;
    flex-direction: column;
    gap: 2em;
    align-items: center;
    margin-top: 2em;
    width: 15em;
    flex-shrink: 0.1;
  }

  sidebar .navigation {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }

  row {
    display: flex;
    flex-direction: row;
  }

  @media screen and (max-width: 850px) {
    section {
      margin-left: 1em;
      margin-right: 1em;
      width: unset;
      align-self: center;
    }
  }

  @media screen and (min-width: 720px) {
    mobile {
      display: none;
    }
  }

  @media screen and (max-width: 720px) {
    section {
      display: flex;
      margin-left: 1em;
      min-width: auto;
      margin-bottom: 3em;
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
      margin-bottom: 3em;
    }

    sidebar {
      width: 100%;
      align-items: center;
    }

    sidebar .navigation {
      display: none;
    }

    sidebar .locale {
      display: none;
    }
  }
</style>
