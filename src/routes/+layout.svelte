<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "$lib/types";
  import {
    Header,
    Footer,
    Menu,
    RecentComments,
    UserInfo,
    ThemeToggle,
  } from "$lib/components";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
  let user = $derived(data.user);
  let recentComments = $derived(data.recentComments);
</script>

<div class="app">
  <Header />
  <main>
    <row>
      <mobile>
        <UserInfo {user} />
        <Menu />
      </mobile>
      <section>
        {@render children()}
      </section>
      <sidebar>
        <div class="navigation">
          <UserInfo {user} />
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
    width: 25em;
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
      width: auto;
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
  }
</style>
