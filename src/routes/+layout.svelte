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
  let commentsEnabled: boolean = $derived(data.globalCommentsEnabled);
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
        <div id="navigation" data-name="Navigation">
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
  /* App shell*/

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    width: 100%;
    max-width: 70rem;
    box-sizing: border-box;
    padding: 1rem;
    margin: 2rem auto;
    font-size: 14px;
    line-height: 16px;
    -webkit-font-smoothing: antialiased;
  }

  /* Custom Layout Elements */

  row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    backdrop-filter: blur(10px) brightness(50%);
  }

  section {
    display: flex;
    flex-direction: column;
    align-content: center;
    width: 100%;
    min-width: 500px;
    padding: 1.5em 3em;
  }

  sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2em;
    width: 17em;
    padding: 2em 1em;
    flex-shrink: 0.1;
    border-left: 1px solid var(--border-subtle);
  }

  sidebar #navigation {
    display: flex;
    flex-direction: column;
    gap: 2em;
  }

  mobile {
    display: none;
  }

  /* Responsive */

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

  @media screen and (max-width: 780px) {
    main {
      margin-top: 1em;
    }

    main row {
      flex-direction: column;
    }

    section {
      padding-left: 1em;
      padding-bottom: 3em;
      min-width: auto;
      align-self: center;
    }

    sidebar {
      width: auto;
      align-items: center;
      border: none;
    }

    sidebar #navigation,
    sidebar #locale {
      display: none;
    }

    mobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2em;
      margin-top: 2em;
      margin-bottom: 2em;
    }
  }
</style>
