<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { m } from "$lib/paraglide/messages.js";
  import { getLocale } from "$lib/paraglide/runtime";
  import sadtrombone from "$lib/sound/sadtrombone.ogg";

  const sadTromboneText: string = "🪊 surullinen pasuuna";

  let audio: HTMLAudioElement;

  function playAudio() {
    audio.currentTime = 0;
    audio.play();
  }
</script>

<div class="menu">
  <nav>
    <ul>
      <li aria-current={page.url.pathname === "/" ? "page" : undefined}>
        <a href={resolve("/")}>{m["navigation.home"]()}</a>
      </li>
      <li aria-current={page.url.pathname === "/about" ? "page" : undefined}>
        <a href={resolve("/about")}>{m["navigation.about"]()}</a>
      </li>
      <li aria-current={page.url.pathname === "/events" ? "page" : undefined}>
        <a href={resolve("/events")}>{m["navigation.events"]()}</a>
      </li>
      <li>
        <a href="https://mp3.hardcore.lt/1120/">{m["navigation.xi20live"]()}</a>
      </li>
      <li>
        <a href="https://music.ver.lt">{m["navigation.music"]()}</a>
      </li>
      <li aria-current={page.url.pathname === "/blog" ? "page" : undefined}>
        <a href={resolve("/blog")}>{m["navigation.blog"]()}</a>
      </li>
      <li>
        <a href="https://oldschool.hardcore.lt"
          >{m["navigation.oldversion"]()}</a
        >
      </li>
      <li aria-current={page.url.pathname === "/contacts" ? "page" : undefined}>
        <a href={resolve("/contacts")}>{m["navigation.contacts"]()}</a>
      </li>
      {#if getLocale() === "fi"}
        <li>
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" onclick={playAudio}>{sadTromboneText.toUpperCase()}</a>
        </li>
        <audio bind:this={audio} src={sadtrombone}></audio>
      {/if}
    </ul>
  </nav>
</div>

<style>
  ul {
    position: relative;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: calc(47% - var(--size));
    left: calc(0% - var(--size));
    rotate: -90deg;
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-text);
  }

  nav a {
    height: 100%;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
  }

  nav a:hover {
    color: var(--link-hover-color);
  }

  @media screen and (max-width: 780px) {
    nav a {
      font-size: 12pt;
      line-height: 16pt;
    }
  }
</style>
