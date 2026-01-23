<script lang="ts">
  import { resolve } from "$app/paths";
  import Logo from "$lib/images/logo.gif";
  const description: string = $state(
    "Ska funk rasta punk scene, Vilnius, Lithuania",
  );
</script>

<header>
  <a href={resolve("/")} aria-label="Vilnius Hardcore">
    <img src={Logo} alt={description} />
    <figlet
      ><pre>    .__                     .___                            .__   __   
    |  |__ _____ _______  __| _/____  ___________   ____    |  |_/  |_ 
    |  |  \\__  \\_  __ \/ __ |/ ___\/  _ \_  __ \_/ __ \   |  |\   __\
    |   Y  \/ __ \|  | \/ /_/ \  \__(  &lt_&gt )  | \/\  ___/   |  |_|  |  
    |___|  (____  /__|  \____ |\___  &lt____/|__|    \___  &gt /\____/__|  
         \/     \/           \/    \/                  \/  \/</pre></figlet
    >
    <div class="site-description">
      <span>{description}</span><span class="cursor">&nbsp;</span>
    </div>
  </a>
</header>

<style>
  :global(html.dark) figlet,
  :global(html.dark) header .site-description {
    display: inherit;
  }

  :global(html.dark) header img {
    display: none;
  }

  :global(html) figlet,
  :global(html):not(.dark) span.cursor {
    display: none;
  }

  header {
    display: flex;
    justify-content: center;
  }

  header img {
    padding-top: 0.75em;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
    border-radius: 10px;
  }

  header a {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  header a:hover {
    background: none;
    color: var(--color-text-2);
  }

  figlet pre {
    margin-top: 0;
    padding-top: 1.2em;
    color: var(--color-text-2);
    background-color: rgba(0, 0, 0, 0);
    margin-bottom: 0;
    font-weight: 800;
    box-shadow: none;
  }

  .site-description {
    text-transform: uppercase;
  }

  :global(html):not(.dark) .site-description {
    color: #f2f3f1;
    position: absolute;
  }

  .cursor {
    display: inline-block;
    background: var(--color-bg);
    margin-left: 1px;

    -webkit-animation: blink 2s linear 0s infinite;
    -moz-animation: blink 2s linear 0s infinite;
    -ms-animation: blink 2s linear 0s infinite;
    -o-animation: blink 2s linear 0s infinite;
    animation: blink 2s linear 0s infinite;
  }

  @keyframes blink {
    0% {
      background: var(--color-text-2);
    }
    47% {
      background: var(--color-text-2);
    }
    50% {
      background: var(--color-bg);
    }
    97% {
      background: var(--color-bg);
    }
    100% {
      background: var(--color-text-2);
    }
  }

  @media screen and (max-width: 850px) {
    figlet pre {
      font-size: 1.85vw;
    }
  }

  @media screen and (max-width: 780px) {
    header img {
      width: 100%;
      height: auto;
    }
  }

  @media screen and (min-width: 781px) {
    :global(html):not(.dark) header .site-description {
      padding-top: 13.37rem;
      padding-left: 3.5em;
    }
  }

  @media screen and (max-width: 780px) {
    :global(html):not(.dark) header .site-description {
      padding-top: 27.5%;
      font-size: 2vw;
      padding-left: 3.5em;
    }
  }

  @media screen and (max-width: 780px) {
    :global(html.dark) header .site-description {
      font-size: 2vw;
    }
  }
</style>
