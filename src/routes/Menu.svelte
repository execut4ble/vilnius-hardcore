<script lang="ts">
  import { page } from "$app/stores";
</script>

<nav>
  <ul>
    <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
      <a href="/">Home</a>
    </li>
    <li aria-current={$page.url.pathname === "/about" ? "page" : undefined}>
      <a href="/about">About</a>
    </li>
    <li aria-current={$page.url.pathname === "/events" ? "page" : undefined}>
      <a href="/events">Events</a>
    </li>
  </ul>
</nav>

<style>
  nav {
    display: flex;
    justify-content: center;
    margin-left: 5em;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
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
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
  }

  nav a:hover {
    color: #111;
  }
</style>
