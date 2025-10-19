<script lang="ts">
  import {
    faBan,
    faGear,
    faUserGroup,
  } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { m } from "$lib/paraglide/messages.js";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
</script>

<div id="crew-nav">
  <nav>
    <ul class="navlist-items">
      <li aria-current={page.url.pathname === "/crew" ? "page" : undefined}>
        <a href={resolve("/crew")}><Fa icon={faGear}></Fa> {m.account()}</a>
      </li>
      <li
        aria-current={page.url.pathname === "/crew/users" ? "page" : undefined}
      >
        <a href={resolve("/crew/users")}
          ><Fa icon={faUserGroup}></Fa> {m.users()}</a
        >
      </li>
      <li
        aria-current={page.url.pathname === "/crew/jail" ? "page" : undefined}
      >
        <a href={resolve("/crew/jail")}
          ><Fa icon={faBan}></Fa> {m.blocked_ips_heading_short()}</a
        >
      </li>
    </ul>
  </nav>
</div>

<style>
  ul.navlist-items {
    display: flex;
    gap: 1em;
    list-style: none;
    padding-left: 0;
  }

  li a {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    border-radius: 12px;
    padding: 0.75rem;
  }

  li[aria-current="page"] a {
    color: var(--color-text-2);
    background: rgba(20, 20, 20, 0.75);
  }
</style>
